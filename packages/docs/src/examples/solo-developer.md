# Solo Developer Portfolio

A complete portfolio example for solo developers who work with different types of projects. This example demonstrates how to mix GitHub repositories, npm packages, and manual/showcase projects in a single portfolio.

## Features

- **GitHubCard** - Open source projects with stars, forks, and language
- **NpmCard** - Published npm packages with downloads and version
- **ShowcaseCard** - Personal projects with custom descriptions and links
- **ProjectGrid** - Responsive grid layout for all cards

## Use Case

This example is perfect for solo developers who:
- Contribute to open source (GitHub repos)
- Publish npm packages
- Build personal projects or SaaS products

## Code

```tsx
import { GitHubCard, NpmCard, ShowcaseCard, ProjectGrid } from '@manningworks/projex'

function SoloPortfolio() {
  return (
    <div>
      <h1>My Projects</h1>
      <p>A collection of open source work, npm packages, and personal projects.</p>

      <ProjectGrid>
        <GitHubCard project={githubProject} />
        <NpmCard>
          <NpmCard.Header project={npmProject} />
          <NpmCard.Description project={npmProject} />
          <NpmCard.Stats project={npmProject} />
          <NpmCard.Status project={npmProject} />
          <NpmCard.Links project={npmProject} />
        </NpmCard>
        <ShowcaseCard>
          <ShowcaseCard.Header project={manualProject} />
          <ShowcaseCard.Description project={manualProject} />
          <ShowcaseCard.Tags project={manualProject} />
          <ShowcaseCard.Status project={manualProject} />
          <ShowcaseCard.Links project={manualProject} />
        </ShowcaseCard>
      </ProjectGrid>
    </div>
  )
}
```

## Configuration

Define your projects in `projex.config.ts`:

```typescript
import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  {
    id: 'my-library',
    type: 'github',
    repo: 'yourusername/my-library',
    status: 'active',
  },
  {
    id: 'my-package',
    type: 'npm',
    package: 'my-package',
    status: 'active',
  },
  {
    id: 'my-app',
    type: 'manual',
    status: 'shipped',
    name: 'My App',
    tagline: 'A beautiful web application',
    description: 'A complete web application built with modern technologies.',
    stack: ['React', 'Next.js', 'TypeScript'],
    links: {
      live: 'https://myapp.dev',
      github: 'https://github.com/username/myapp',
    },
  },
])
```

## HTML Output

The components generate semantic HTML with `data-projex-*` attributes for styling:

```html
<div data-projex-grid>
  <!-- GitHubCard generates -->
  <div data-projex-card>
    <div data-projex-card-header>
      <h3>facebook/react</h3>
      <span data-projex-language data-projex-language-color="#f1e05a">JavaScript</span>
    </div>
    <div data-projex-card-description>The library for web and native user interfaces.</div>
    <div data-projex-card-stats>
      <span data-projex-stat="stars">243694 stars</span>
      <span data-projex-stat="forks">50666 forks</span>
    </div>
    <div data-projex-status data-projex-status-value="active">active</div>
    <div data-projex-card-links>
      <a href="..." data-projex-link data-projex-link-type="github">GitHub</a>
      <a href="..." data-projex-link data-projex-link-type="live">Live</a>
    </div>
  </div>

  <!-- NpmCard generates -->
  <div data-projex-card>
    <div data-projex-card-header>
      <h3>lodash</h3>
    </div>
    <div data-projex-card-stats>
      <span data-projex-stat="downloads">480058614 downloads</span>
      <span data-projex-stat="version">v4.17.23</span>
    </div>
    <div data-projex-status data-projex-status-value="active">active</div>
    <div data-projex-card-links>
      <a href="..." data-projex-link data-projex-link-type="npm">npm</a>
    </div>
  </div>

  <!-- ShowcaseCard generates -->
  <div data-projex-card>
    <div data-projex-card-header>
      <h3>My Portfolio</h3>
      <p data-projex-card-tagline>Personal project showcase</p>
    </div>
    <div data-projex-card-description>A complete portfolio website showcasing my projects and work.</div>
    <div data-projex-card-tags>
      <span data-projex-tag>Next.js</span>
      <span data-projex-tag>React</span>
      <span data-projex-tag>TypeScript</span>
      <span data-projex-tag>Tailwind</span>
    </div>
    <div data-projex-status data-projex-status-value="active">active</div>
    <div data-projex-card-links>
      <a href="..." data-projex-link data-projex-link-type="live">Live</a>
      <a href="..." data-projex-link data-projex-link-type="github">GitHub</a>
    </div>
  </div>
</div>
```

See the [Styling Guide](../guides/styling.md) for comprehensive CSS examples.

## Styling Example

Basic CSS to style the cards:

```css
/* Card base */
[data-projex-card] {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
}

/* Header */
[data-projex-card-header] h3 {
  margin: 0 0 8px 0;
  font-size: 1.1em;
  font-weight: 600;
}

/* Description */
[data-projex-card-description] {
  margin: 8px 0;
  color: #6b7280;
}

/* Tags */
[data-projex-card-tags] {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 8px 0;
}

[data-projex-tag] {
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85em;
}

/* Stats */
[data-projex-card-stats] {
  display: flex;
  gap: 16px;
  margin: 12px 0;
  color: #6b7280;
}

/* Status */
[data-projex-status] {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85em;
}

[data-projex-status-value="active"] {
  background: #dcfce7;
  color: #166534;
}

/* Links */
[data-projex-card-links] {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

[data-projex-link] {
  color: #374151;
  text-decoration: none;
}

/* Grid */
[data-projex-grid] {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
```

For more styling patterns, see the [Styling Guide](../guides/styling.md).

## Tips

1. **Use GitHubCard as-is** - It automatically fetches and displays GitHub data
2. **Compose NpmCard** - Use compound components for npm packages to control layout
3. **Customize ShowcaseCard** - Perfect for projects without GitHub or npm
4. **Mix and match** - Combine all card types in one portfolio
5. **Add filters** - Use `ProjectFilterBar` to let users filter by project type

## Next Steps

- Add search functionality with `ProjectSearch`
- Add filters for project type or status
- Make cards interactive with hover effects
- Add a featured project section
