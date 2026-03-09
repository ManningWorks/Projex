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

## Resuming Subagent Calls
When you call a subagent with the `Task` tool, it returns a `task_id` in the response. 
You can reuse this `task_id` in subsequent calls to resume the same subagent session, maintaining conversation context across multiple interactions.
**Use when:** reviewing changes or iterating with the same subagent. 
**Why:** Maintains context across calls, enabling refinement and preserving the agent's memory of previous work.