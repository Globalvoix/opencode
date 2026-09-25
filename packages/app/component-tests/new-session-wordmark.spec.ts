import { expect, story } from "../../storybook/playwright/story"

for (const theme of ["light", "dark"]) {
  for (const direction of ["ltr", "rtl"]) {
    story(`shows the build heading without a wordmark (${theme}, ${direction})`, async ({ mount, page }) => {
      const component = await mount("app-new-session-wordmark--reveal", { globals: { theme, direction } })
      const heading = component.getByRole("heading", { name: "What should we build?", exact: true })
      await expect(heading).toBeVisible()
      await expect(component.locator("svg")).toHaveCount(0)
      expect(await heading.evaluate((element) => element.getBoundingClientRect().right <= innerWidth)).toBe(true)
    })
  }
}
