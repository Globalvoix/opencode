import { CommandExitError, Sandbox } from "e2b"
import { Deferred, Effect, PlatformError, Queue, Scope, Sink, Stream } from "effect"
import { ChildProcess } from "effect/unstable/process"
import { ChildProcessSpawner, ExitCode, ProcessId, make, makeHandle } from "effect/unstable/process/ChildProcessSpawner"

/**
 * Spawns every process inside one E2B sandbox. The environment layer derives
 * its whole Files implementation from `sh -c` spawns (see exec-defaults), so
 * this mapping is the only E2B-specific execution code the agent needs; file
 * reads, writes, listings and stats all flow through it.
 *
 * Known deviations from a local spawner, all inherent to remote execution:
 * - `stdout: "inherit"` is captured instead of reaching a parent console.
 * - `extendEnv: true` merges with the sandbox base environment, not the host
 *   `process.env`.
 * - `additionalFds` beyond stdin/stdout/stderr resolve to drain/empty handles.
 * - Per-command `timeoutMs` is the sandbox timeout; agent commands are ended
 *   by scope finalizers instead.
 * - Stdout/stderr arrive as UTF-8 text through the E2B event stream, so
 *   byte-exact binary output is not preserved.
 */

export const SANDBOX_TIMEOUT_MS = 3_600_000

const module = "E2BSpawner"

const failure = (method: string, cause: unknown) =>
  PlatformError.systemError({
    _tag: "Unknown",
    module,
    method,
    description: cause instanceof Error ? cause.message : String(cause),
  })

/**
 * POSIX single-quote `arg` so argv arrays survive being joined into one shell
 * string for `commands.run`. Every argument is quoted even when it looks safe.
 */
export function quoteArg(arg: string) {
  return `'${arg.replaceAll("'", `'\\''`)}'`
}

interface ShellCommand {
  readonly shell: string
  readonly cwd: string | undefined
  readonly envs: Record<string, string> | undefined
}

function definedEnv(env: Record<string, string | undefined> | undefined) {
  if (!env) return undefined
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(env)) {
    if (value !== undefined) out[key] = value
  }
  return Object.keys(out).length > 0 ? out : undefined
}

/**
 * Render a standard command as one shell string. Direct execution keeps argv
 * boundaries through quoting; `shell: true` preserves the caller's intent that
 * the string is already shell source.
 */
export function standardToShell(command: ChildProcess.StandardCommand): ShellCommand {
  return {
    shell:
      command.options.shell === true || typeof command.options.shell === "string"
        ? [command.command, ...command.args].join(" ")
        : [command.command, ...command.args].map(quoteArg).join(" "),
    cwd: command.options.cwd,
    envs: definedEnv(command.options.env),
  }
}

type StdinInput = ChildProcess.CommandInput | ChildProcess.StdinConfig | undefined

/**
 * Whether spawning must open remote stdin: a preset input stream, or an
 * explicitly piped/overlapped descriptor. `ignore`, `inherit` and absent mean
 * closed; inherit has no parent console to attach to from a server process.
 */
export function stdinOpen(input: StdinInput): boolean {
  const inner = typeof input === "object" && input !== null && "stream" in input ? input.stream : input
  if (typeof inner === "object" && inner !== null) return true
  return inner === "pipe" || inner === "overlapped"
}

interface RemoteProcess {
  readonly pid: number
  readonly stdout: Stream.Stream<Uint8Array>
  readonly stderr: Stream.Stream<Uint8Array>
  readonly all: Stream.Stream<Uint8Array>
  readonly send: (bytes: Uint8Array) => Effect.Effect<void, PlatformError.PlatformError>
  readonly closeInput: Effect.Effect<void, PlatformError.PlatformError>
  readonly code: Deferred.Deferred<number, PlatformError.PlatformError>
  readonly kill: Effect.Effect<void>
}

const encoder = new TextEncoder()

interface Tap {
  readonly stream: Stream.Stream<Uint8Array>
  readonly pushers: Array<(data: string) => void>
  readonly enders: Array<() => void>
}

const makeTap = (): Tap => {
  const pushers: Array<(data: string) => void> = []
  const enders: Array<() => void> = []
  const stream = Stream.callback<Uint8Array>((queue) =>
    Effect.sync(() => {
      pushers.push((data) => Queue.offerUnsafe(queue, encoder.encode(data)))
      enders.push(() => Queue.endUnsafe(queue))
    }),
  )
  return { stream, pushers, enders }
}

const fanout = (taps: ReadonlyArray<Tap>) => (data: string) => {
  for (const tap of taps) for (const push of tap.pushers) push(data)
}

const finish = (taps: ReadonlyArray<Tap>) => {
  for (const tap of taps) for (const end of tap.enders) end()
}

const startRemote = Effect.fn("E2BSpawner.start")(function* (
  sandbox: Sandbox,
  shell: string,
  cwd: string | undefined,
  envs: Record<string, string> | undefined,
  openStdin: boolean,
  captureStdout: boolean,
  captureStderr: boolean,
) {
  const out = makeTap()
  const err = makeTap()
  const both = makeTap()
  const handle = yield* Effect.tryPromise({
    try: () =>
      sandbox.commands.run(shell, {
        background: true,
        cwd,
        envs,
        stdin: openStdin,
        timeoutMs: SANDBOX_TIMEOUT_MS,
        onStdout: captureStdout ? fanout([out, both]) : undefined,
        onStderr: captureStderr ? fanout([err, both]) : undefined,
      }),
    catch: (cause) => failure("spawn", cause),
  })
  const code = yield* Deferred.make<number, PlatformError.PlatformError>()
  const taps = [out, err, both]
  yield* Effect.forkScoped(
    Effect.tryPromise({
      try: () =>
        handle.wait().then(
          (result) => result.exitCode,
          (error) => {
            if (error instanceof CommandExitError) return error.exitCode
            throw error
          },
        ),
      catch: (cause) => failure("wait", cause),
    }).pipe(
      Effect.tap((exitCode) => Deferred.succeed(code, exitCode)),
      Effect.tapError((cause) => Deferred.fail(code, cause)),
      Effect.ensuring(Effect.sync(() => finish(taps))),
    ),
  )
  yield* Effect.addFinalizer(() =>
    Deferred.isDone(code).pipe(
      Effect.flatMap((done) =>
        done ? Effect.void : Effect.promise(() => handle.kill()).pipe(Effect.ignore),
      ),
    ),
  )
  const send = (bytes: Uint8Array) =>
    Effect.tryPromise({
      try: () => handle.sendStdin(bytes),
      catch: (cause) => failure("stdin", cause),
    })
  return {
    pid: handle.pid,
    stdout: out.stream,
    stderr: err.stream,
    all: both.stream,
    send,
    closeInput: Effect.tryPromise({
      try: () => handle.closeStdin(),
      catch: (cause) => failure("stdin", cause),
    }),
    code,
    kill: Effect.promise(() => handle.kill()).pipe(Effect.ignore),
  }
})

const spawnRemote: (
  sandbox: Sandbox,
  command: ChildProcess.Command,
  forceStdin: boolean,
  captureStdout?: boolean,
  captureStderr?: boolean,
) => Effect.Effect<RemoteProcess, PlatformError.PlatformError, Scope.Scope> = Effect.fn(
  "E2BSpawner.spawnRemote",
)(function* (
  sandbox: Sandbox,
  command: ChildProcess.Command,
  forceStdin: boolean,
  captureStdout = true,
  captureStderr = true,
) {
  if (command._tag === "PipedCommand") {
    if (
      command.options.from !== undefined &&
      command.options.from !== "stdout" &&
      command.options.from !== "stderr" &&
      command.options.from !== "all"
    )
      return yield* Effect.fail(failure("spawn", new Error(`Unsupported pipe source: ${command.options.from}`)))
    if (command.options.to !== undefined && command.options.to !== "stdin")
      return yield* Effect.fail(failure("spawn", new Error(`Unsupported pipe target: ${command.options.to}`)))
    const left = yield* spawnRemote(sandbox, command.left, forceStdin)
    const right = yield* spawnRemote(sandbox, command.right, true)
    const source =
      command.options.from === "stderr" ? left.stderr : command.options.from === "all" ? left.all : left.stdout
    yield* Effect.forkScoped(Stream.runForEach(source, right.send).pipe(Effect.andThen(right.closeInput)))
    return {
      pid: right.pid,
      stdout: right.stdout,
      stderr: Stream.mergeAll([left.stderr, right.stderr], { concurrency: "unbounded" }),
      all: Stream.mergeAll([left.stderr, right.all], { concurrency: "unbounded" }),
      send: right.send,
      closeInput: right.closeInput,
      code: right.code,
      kill: Effect.andThen(left.kill, right.kill),
    }
  }
  const rendered = standardToShell(command)
  const open = forceStdin || stdinOpen(command.options.stdin)
  const started = yield* startRemote(sandbox, rendered.shell, rendered.cwd, rendered.envs, open, captureStdout, captureStderr)
  const send = open
    ? started.send
    : (_bytes: Uint8Array) => Effect.fail(failure("stdin", new Error("Remote stdin is not open for this command")))
  const closeInput = open ? started.closeInput : Effect.void
  return { ...started, send, closeInput }
})

const closedStdin = Sink.fail(failure("stdin", new Error("Remote stdin is not open for this command")))

/**
 * Build the spawner service for one connected sandbox. Every process the
 * agent starts through the returned service executes inside that sandbox.
 */
export const makeE2BSpawner = (sandbox: Sandbox): ChildProcessSpawner["Service"] =>
  make((command) =>
    Effect.gen(function* () {
      const output = (which: "stdout" | "stderr") => {
        const setting = command._tag === "StandardCommand" ? command.options[which] : undefined
        const inner =
          typeof setting === "object" && setting !== null && "stream" in setting ? setting.stream : setting
        if (typeof inner === "object" && inner !== null) return true
        return inner !== "ignore"
      }
      const remote = yield* spawnRemote(sandbox, command, false, output("stdout"), output("stderr"))
      const stdinSink = (() => {
        if (command._tag !== "StandardCommand" || !stdinOpen(command.options.stdin)) return closedStdin
        return Sink.forEach(remote.send).pipe(Sink.ensuring(remote.closeInput))
      })()
      return makeHandle({
        pid: ProcessId(remote.pid),
        exitCode: Effect.map(Deferred.await(remote.code), ExitCode),
        isRunning: Effect.map(Deferred.isDone(remote.code), (done) => !done),
        kill: () => remote.kill,
        stdin: stdinSink,
        stdout: output("stdout") ? remote.stdout : Stream.empty,
        stderr: output("stderr") ? remote.stderr : Stream.empty,
        all: remote.all,
        getInputFd: (fd) => (fd === 0 ? stdinSink : Sink.drain),
        getOutputFd: (fd) => (fd === 1 ? remote.stdout : fd === 2 ? remote.stderr : Stream.empty),
        unref: Effect.succeed(Effect.void),
      })
    }),
  )

export * as EnvironmentE2B from "./e2b.js"
