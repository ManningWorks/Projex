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

## Exclude Source and Sourcemaps from npm Package — 2026-02-23

**Decision**
Exclude `src/`, `*.js.map`, `*.d.ts.map`, `eslint.config.js`, `tsconfig.json`, and `copy-components.js` from npm package. Publish only `dist/` (compiled code) and `package.json`.

**Why**
Consumers only need compiled code - TypeScript source files and sourcemaps double the package size with no runtime benefit. Reducing package size improves install time and bandwidth for all consumers.

**Rejected**
Keep sourcemaps (`*.js.map`, `*.d.ts.map`) - considered for better debugging experience, but the 60% size reduction (167→74 files, 197KB→77.5KB) outweighs marginal debugging utility for an npm library.

**Consequences**
Package size reduced from 40.6 KB to 17.5 KB. Consumers cannot debug into compiled source files, but they can reference the GitHub repo for source code if needed.

## React Component Integration in VitePress — 2026-03-06

**Decision**
Create ReactWrapper.vue component that bridges React components to VitePress by using createRoot to render React components in their own context, rather than registering React components directly as Vue components.

**Why**
VitePress is Vue-only and doesn't natively support React components. Registering React components as Vue components causes React hooks to fail because React isn't properly initialized - the "Invalid hook call" error occurs when useState and other hooks are called outside a valid React context. The ReactWrapper creates a proper React root where hooks can execute correctly.

**Rejected**
- vue-react library — designed for Vue 2, incompatible with VitePress/Vue 3
- Slot-based approach — Vue slots don't translate to React component structure
- Direct component registration — fails because Vue tries to render React components without React context

**Consequences**
All interactive examples in docs must use `<ReactWrapper name="ComponentName" />` syntax. React components are not registered as Vue components in theme/index.ts. React components are imported directly in ReactWrapper.vue to maintain proper React context.
