import { useLanguage } from "@/runtime/i18n/language"

export function NewSessionWordmark() {
  const language = useLanguage()
  return (
    <div data-component="new-session-wordmark" class="mx-auto w-full max-w-[720px]">
      <h1 class="text-center text-[28px] font-semibold leading-[36px] tracking-[-0.2px] text-v2-text-text-base">
        {language.t("newSession.heading")}
      </h1>
    </div>
  )
}
