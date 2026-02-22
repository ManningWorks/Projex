# Decisions

## VitePress srcDir Configuration — 2026-02-22

**Decision**
Always set `srcDir: 'src'` in VitePress config when source files are in a `src/` subdirectory.

**Why**
Without `srcDir`, VitePress builds work but the client-side router fails:
- Hash map keys use `src_index.md` format
- Router expects `index.md` for `/` route
- Initial HTML renders correctly (SSR)
- After JS loads, route lookup fails → 404 page

The `cleanUrls: true` setting makes this worse because the router relies entirely on the hash map for route resolution.

**Rejected**
- Using fix-paths.js post-build script (was masking the root cause)
- Disabling cleanUrls (removes nice URLs without fixing the issue)

**Consequences**
When creating new VitePress docs sites:
1. Set `srcDir: 'src'` if using a src folder
2. Verify hash map keys match expected route paths
3. Test preview server in browser, not just curl

```ts
// packages/docs/.vitepress/config.ts
export default defineConfig({
  srcDir: 'src',  // Critical when content is in src/
  cleanUrls: true,
  // ...
})
```
