# AGENTS.md

Guidelines for agentic coding agents operating in this repository.

## Commands

```bash
pnpm install && pnpm build && pnpm typecheck && pnpm lint && pnpm test
```

## Agent Rules

- **NEVER run dev servers** - only build/lint/test commands
- Store PRDs/briefings in `project_docs/`
- Follow existing code patterns (read before writing)

## Specialized Agents

- **@release-manager** - version bumping, changelog, git tagging
- **@documentation-manager** - docs verification, completeness checks
