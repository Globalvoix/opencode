import { describe, expect } from "bun:test"
import { Effect, Layer } from "effect"
import { Bus } from "@opencode/core/bus"
import { AppNodeBuilder } from "@opencode/core/effect/app-node-builder"
import { LayerNode } from "@opencode/util/effect/layer-node"
import { Database } from "@opencode/core/database/database"
import { AbsolutePath } from "@opencode/core/schema"
import { LocationServiceMap } from "@opencode/core/location-service-map"
import { Project } from "@opencode/core/project"
import { Session } from "@opencode/core/session"
import { SessionExecution } from "@opencode/core/session/execution"
import { SessionInbox } from "@opencode/core/session/inbox"
import { SessionMove } from "@opencode/core/session/move"
import { SessionProjector } from "@opencode/core/session/projector"
import { SessionStore } from "@opencode/core/session/store"
import { SessionTransfer } from "@opencode/core/session/transfer"
import { Workspace } from "@opencode/core/workspace"
import { E2BWorkspace } from "@opencode/core/workspace/e2b"
import { testEffect } from "./lib/effect"
import { globalProjectNode } from "./lib/project"
import { promptLocationNode } from "./fixture/prompt-location"

const calls: Array<string> = []

const workspaceStub = Layer.succeed(
  Workspace.Service,
  Workspace.Service.of({
    create: () => {
      calls.push("create")
      return Effect.succeed(Workspace.ID.make("wrk_test_sandbox"))
    },
    provision: () => {
      calls.push("provision")
      return Effect.succeed(
        new Workspace.Info({
          id: Workspace.ID.make("wrk_test_sandbox"),
          provider: E2BWorkspace.provider,
          binding: {},
          createdAt: 0,
          lastUsedAt: 0,
        }),
      )
    },
    connect: () => Effect.die("not implemented"),
    destroy: () => {
      calls.push("destroy")
      return Effect.succeed({ destroyed: true })
    },
  }),
)

const it = testEffect(
  AppNodeBuilder.build(
    LayerNode.group([
      Database.node,
      Bus.node,
      SessionProjector.node,
      SessionStore.node,
      Session.node,
      SessionTransfer.node,
      SessionInbox.node,
      SessionMove.node,
      Workspace.node,
      Project.node,
    ]),
    [
      Bus.node.replace(Bus.configured({ persist: true })),
      Project.node.replace(globalProjectNode),
      LocationServiceMap.node.replace(promptLocationNode),
      SessionExecution.node.replace(SessionExecution.noopLayer),
      Workspace.node.replace(workspaceStub),
    ],
  ),
)

describe("Sandbox sessions", () => {
  it.effect("provisions a workspace on create and destroys it on remove", () =>
    Effect.gen(function* () {
      const session = yield* Session.Service
      calls.length = 0
      const created = yield* session.create({ sandbox: true })
      expect(calls).toEqual(["create", "provision"])
      expect(created.location.workspaceID).toBe(Workspace.ID.make("wrk_test_sandbox"))
      expect(created.location.directory).toBe(AbsolutePath.make(E2BWorkspace.SANDBOX_DIRECTORY))
      yield* session.remove(created.id)
      expect(calls).toEqual(["create", "provision", "destroy"])
    }),
  )
})
