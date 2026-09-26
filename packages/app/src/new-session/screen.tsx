import { createEffect, createResource, untrack } from "solid-js"
import { useSearchParams } from "@solidjs/router"
import { createComposerModel } from "@/composer/model"
import { useComposerCommands } from "@/composer/commands"
import { createNewSessionComposerAdapter } from "./composer-adapter"
import { NewSessionView } from "./view"

/** The draft-only Session page. Submitting creates a session without project selection. */
export default function NewSessionPage(props: { draftId: string }) {
  const [search, setSearch] = useSearchParams<{ draftId?: string; prompt?: string }>()
  const composer = createNewSessionComposerAdapter({ draftID: props.draftId })
  const model = createComposerModel(composer.adapter)
  useComposerCommands({ model: composer.model })
  createEffect(() => {
    if (!composer.ready()) return
    model.restoreFocus()
  })
  createEffect(() => {
    if (!composer.ready()) return
    untrack(() => {
      const text = search.prompt
      if (!text) return
      composer.adapter.state.set([{ type: "text", content: text, start: 0, end: text.length }], text.length)
      setSearch({ ...search, prompt: undefined })
    })
  })

  const ready = Promise.resolve()
  const [suspendUntilPromptReady] = createResource(
    () => composer.ready.promise ?? ready,
    (promise) => promise.then(() => true),
  )

  return (
    <div class="relative size-full overflow-hidden flex flex-col">
      {suspendUntilPromptReady()}
      <div class="flex-1 min-h-0 flex flex-col gap-2 px-2 pb-[var(--shell-bottom-inset,8px)] pt-[var(--shell-top-inset,8px)]">
        <NewSessionView composer={model} />
      </div>
    </div>
  )
}
