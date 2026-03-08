# Contributing to Projex

Projex is in active development. We welcome contributions from experienced developers who understand the shadcn philosophy: own your code, use good defaults, avoid opinions.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/your-username/projex.git
cd projex

# Install dependencies
pnpm install

# Run tests
pnpm test

# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Build all packages
pnpm build
```

## Project Structure

```
projex/
├── packages/
│   ├── core/          # Main component library (includes CLI)
│   └── docs/          # VitePress documentation
├── project_docs/      # Internal documentation (PRDs, briefings)
└── scripts/           # Utility scripts
```

## Code Style Guidelines

Projex follows strict code style conventions to maintain consistency and quality. Please review `AGENTS.md` for detailed guidelines.

### TypeScript

- **Strict mode** - always enabled
- **No comments** - code should be self-documenting
- **Explicit return types** on exported functions
- **Prefer interfaces over types** for object shapes
- **Use discriminated unions** for variants

### Components

- **Compound components** for flexibility
- **Render nothing for empty data** - return null
- **Data attributes on every element** for styling hooks
- **No inline styles in library code**

### API Fetching

- **Build-time only** - use Next.js `fetch` with `{ cache: 'force-cache' }`
- **Never fetch client-side**
- **Return null on fetch failures** - never throw

### Error Handling

- **Never throw** from component code
- **Return null** on failures
- **Log warnings** for recoverable issues

## Testing

We maintain high test coverage (>97% lines). All contributions must include tests.

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm --filter @projex/core test:coverage

# Run tests in watch mode
pnpm --filter @projex/core test:watch

# Run benchmarks
pnpm benchmark
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and ensure they pass (`pnpm test && pnpm typecheck && pnpm lint`)
5. Commit your changes with clear messages
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### PR Requirements

- All tests must pass
- Type checking must succeed
- No linting warnings
- New features must include tests
- Documentation updates if needed
- Follow semantic versioning for breaking changes

## Public API

The public API is documented in `CHANGELOG.md`. Breaking changes to public exports require a major version bump.

### What's Public API

- Components: `ProjectCard`, `ProjectView`, `ProjectList`, `FeaturedProject`
- Utilities: `defineProjects`, `normalise`, all filter/sort functions, API fetchers
- Types: `ProjexProject`, `ProjexProjectInput`, all discriminated union types
- Data attributes: All `data-projex-*` attributes for CSS targeting

### What's Implementation Detail

- File structure and organization
- Internal helper functions not exported from `index.ts`
- Test utilities and fixtures
- Build configuration

## Release Process

Releases are automated via GitHub Actions on version tags.

```bash
# Bump version in package.json files
# Commit changes with "Release v1.x.x"
git tag v1.x.x
git push origin v1.x.x
```

The CI pipeline will:
1. Run all tests and checks
2. Build all packages
3. Publish to npm

## Bundle Size

Projex is optimized for minimal bundle impact. Check bundle size before contributing:

```bash
pnpm bundle-size
```

Bundle size limits:
- `@manningworks/projex`: < 10 KB (target: < 3 KB)

## Documentation

Documentation lives in `packages/docs/` using VitePress.

```bash
# Run docs locally
pnpm --filter @projex/docs dev
```

When contributing new features:
1. Update TypeScript types and interfaces
2. Add/update tests
3. Update the main README if the API changes
4. Update VitePress docs for public APIs
5. Update `CHANGELOG.md` with the changes

## Questions?

Feel free to open an issue for questions or discussion about potential contributions.
