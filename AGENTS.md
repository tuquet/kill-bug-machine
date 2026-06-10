<!-- intent-skills:start -->

## Skill Loading

Before substantial work:

- Skill check: run `pnpm dlx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

## UI Blocks & Features

When tasked with implementing a new UI feature, page, or function (e.g., login, signup, dashboard, settings):

- **Always consider Shadcn Blocks:** Use the command `npx shadcn@latest add <block-name>` (e.g., `login-02`, `signup-02`) to scaffold the UI quickly.
- Shadcn Blocks provide complete, responsive page layouts that follow the project's design system.
