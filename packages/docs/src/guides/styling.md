# Styling Guide

Projex ships zero styling - just semantic HTML with data attributes for CSS targeting. You have complete control over the look and feel of your portfolio.

## Data Attribute Reference

All Projex components use `data-projex-*` attributes for styling hooks. These provide semantic, maintainable selectors that won't conflict with your existing CSS.

### Card Components

All card components (GitHubCard, NpmCard, ShowcaseCard) share these base attributes:

```html
<div data-projex-card>
  <div data-projex-card-header>
    <h3>Project Name</h3>
  </div>
  <div data-projex-card-description>Project description...</div>
  <div data-projex-card-tags>
    <span data-projex-tag>React</span>
    <span data-projex-tag>TypeScript</span>
  </div>
  <div data-projex-card-stats>
    <span data-projex-stat="stars">243 stars</span>
    <span data-projex-stat="forks">45 forks</span>
  </div>
  <div data-projex-status data-projex-status-value="active">active</div>
  <div data-projex-card-links>
    <a href="..." data-projex-link data-projex-link-type="github">GitHub</a>
    <a href="..." data-projex-link data-projex-link-type="live">Live</a>
  </div>
</div>
```

### GitHubCard Specific Attributes

```html
<span data-projex-language data-projex-language-color="#f1e05a">JavaScript</span>
```

### Stats Attributes

Available `data-projex-stat` values:
- `stars` - GitHub stars
- `forks` - GitHub forks
- `downloads` - npm downloads
- `version` - package version
- `upvotes` - Product Hunt upvotes
- `comments` - Product Hunt comments
- `subscribers` - YouTube subscribers
- `views` - YouTube views
- `revenue` - Gumroad revenue
- `sales` - Gumroad sales
- `mrr` - Lemon Squeezy MRR
- `orders` - Lemon Squeezy orders
- `customers` - Lemon Squeezy customers
- `articles` - Dev.to articles
- `total-views` - Dev.to total views
- `reactions` - Dev.to average reactions

### Link Attributes

Available `data-projex-link-type` values:
- `github` - GitHub repository link
- `live` - Live demo/site link
- `docs` - Documentation link
- `demo` - Demo link
- `npm` - npm package link
- `product-hunt` - Product Hunt link
- `youtube` - YouTube link
- `app-store` - App Store link
- `play-store` - Play Store link
- `custom` - Custom link (see `data-projex-link-label`)

Custom links include:
```html
<a href="..." data-projex-link data-projex-link-type="custom" data-projex-link-label="Blog">Blog</a>
```

### Status Values

Available `data-projex-status-value` values:
- `active` - Project is actively maintained
- `shipped` - Project has been released
- `in-progress` - Work in progress
- `coming-soon` - Coming soon
- `archived` - Project is archived
- `for-sale` - Project is for sale

### ProjectGrid

```html
<div data-projex-grid>
  <!-- cards -->
</div>
```

### ProjectList

```html
<div data-projex-list>
  <!-- list items -->
</div>
```

### FeaturedProject & ProjectView

```html
<div data-projex-featured>
  <img data-projex-featured-image src="..." alt="..." />
  <div data-projex-view>
    <h2>Project Name</h2>
    <div data-projex-view-section data-projex-view-section-name="description">
      Description...
    </div>
    <div data-projex-view-stats>...</div>
    <div data-projex-view-links>...</div>
  </div>
</div>
```

### Struggles, Timeline, and Posts

```html
<!-- Struggles -->
<div data-projex-struggle data-projex-struggle-type="warn">Warning text</div>
<div data-projex-struggle data-projex-struggle-type="error">Error text</div>

<!-- Timeline -->
<div>
  <span data-projex-timeline-date>2024-01</span>
  <span data-projex-timeline-note>Initial design</span>
</div>

<!-- Posts -->
<div>
  <span data-projex-post-title>Blog Post Title</span>
  <span data-projex-post-date>2024-01-15</span>
  <a href="..." data-projex-post-link>Link</a>
</div>
```

### Commits

```html
<div data-projex-commits>
  <div data-projex-commits-header>Commits</div>
  <ul>
    <li data-projex-commit>
      <div data-projex-commit-message>Commit message...</div>
      <div data-projex-commit-date>2024-01-15</div>
      <a href="..." data-projex-commit-link>Link</a>
      <span data-projex-commit-author>author-name</span>
    </li>
  </ul>
</div>
```

## CSS Selector Patterns

### Targeting Card Containers

```css
/* All cards */
[data-projex-card] { }

/* Specific card types (requires adding data attribute yourself) */
[data-projex-card][data-projex-type="github"] { }
[data-projex-card][data-projex-type="npm"] { }
[data-projex-card][data-projex-type="manual"] { }
```

### Targeting Card Sections

```css
/* Headers */
[data-projex-card-header] { }

/* Descriptions */
[data-projex-card-description] { }

/* Tags container and individual tags */
[data-projex-card-tags] { }
[data-projex-tag] { }

/* Stats container */
[data-projex-card-stats] { }

/* Individual stats */
[data-projex-stat="stars"] { }
[data-projex-stat="forks"] { }
[data-projex-stat="downloads"] { }

/* Links container */
[data-projex-card-links] { }

/* Individual links by type */
[data-projex-link-type="github"] { }
[data-projex-link-type="live"] { }
[data-projex-link-type="npm"] { }
```

### Targeting Status

```css
/* All statuses */
[data-projex-status] { }

/* Specific statuses */
[data-projex-status-value="active"] { }
[data-projex-status-value="shipped"] { }
[data-projex-status-value="in-progress"] { }
```

### Combining Selectors

```css
/* Stars on GitHub cards */
[data-projex-card][data-projex-type="github"] [data-projex-stat="stars"] { }

/* Downloads on npm cards */
[data-projex-card][data-projex-type="npm"] [data-projex-stat="downloads"] { }

/* GitHub links on any card */
[data-projex-link-type="github"] { }
```

## Common Styling Patterns

### Minimal Card Style

```css
[data-projex-card] {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
}

[data-projex-card-header] h3 {
  margin: 0 0 8px 0;
  font-size: 1.1em;
  font-weight: 600;
}

[data-projex-card-description] {
  margin: 8px 0;
  color: #6b7280;
}

[data-projex-card-stats] {
  display: flex;
  gap: 16px;
  margin: 12px 0;
  color: #6b7280;
}

[data-projex-status] {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: 500;
}

[data-projex-status-value="active"] {
  background: #dcfce7;
  color: #166534;
}

[data-projex-status-value="shipped"] {
  background: #dbeafe;
  color: #1e40af;
}

[data-projex-card-links] {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

[data-projex-link] {
  color: #374151;
  text-decoration: none;
}

[data-projex-link]:hover {
  text-decoration: underline;
}
```

### Grid Layout

```css
[data-projex-grid] {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

[data-projex-card] {
  display: flex;
  flex-direction: column;
  height: 100%;
}
```

### Tags Style

```css
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
  color: #374151;
}
```

### GitHub Card Specific

```css
/* Language with color dot */
[data-projex-language]::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  background: var(--projex-language-color, #6b7280);
}

[data-projex-language][data-projex-language-color="#f1e05a"]::before {
  background: #f1e05a; /* JavaScript */
}

[data-projex-language][data-projex-language-color="#3178c6"]::before {
  background: #3178c6; /* TypeScript */
}
```

### Type-Specific Styling

You can add type-specific styling by wrapping cards with type attributes:

```tsx
<div data-projex-card data-projex-type="github">
  {/* card content */}
</div>
```

Then style by type:

```css
/* GitHub cards get a border with GitHub brand color */
[data-projex-card][data-projex-type="github"] {
  border-color: #24292f;
}

/* npm cards get npm brand color */
[data-projex-card][data-projex-type="npm"] {
  border-color: #cb3837;
}

/* Showcase cards get a different style */
[data-projex-card][data-projex-type="manual"] {
  border-color: #7c3aed;
}
```

### Link Icons with CSS

Add icons using pseudo-elements:

```css
[data-projex-link-type="github"]::before {
  content: '📦';
  margin-right: 4px;
}

[data-projex-link-type="live"]::before {
  content: '🔗';
  margin-right: 4px;
}

[data-projex-link-type="npm"]::before {
  content: 'npm';
  margin-right: 4px;
}
```

### Dark Mode Support

```css
@media (prefers-color-scheme: dark) {
  [data-projex-card] {
    background: #1f2937;
    border-color: #374151;
    color: #f9fafb;
  }

  [data-projex-card-description] {
    color: #9ca3af;
  }

  [data-projex-card-stats] {
    color: #9ca3af;
  }

  [data-projex-link] {
    color: #d1d5db;
  }
}
```

### CSS Variables for Themeability

Use CSS variables to make your styles themeable:

```css
:root {
  --projex-card-bg: #ffffff;
  --projex-card-border: #e5e7eb;
  --projex-card-text: #374151;
  --projex-tag-bg: #f3f4f6;
  --projex-tag-text: #374151;
}

[data-projex-card] {
  background: var(--projex-card-bg);
  border: 1px solid var(--projex-card-border);
  color: var(--projex-card-text);
}

[data-projex-tag] {
  background: var(--projex-tag-bg);
  color: var(--projex-tag-text);
}
```

## Complete Example

Here's a complete stylesheet for a modern card design:

```css
/* Card base */
[data-projex-card] {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}

[data-projex-card]:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Header */
[data-projex-card-header] h3 {
  margin: 0 0 4px 0;
  font-size: 1.25em;
  font-weight: 600;
  color: #111827;
}

[data-projex-card-tagline] {
  margin: 0 0 12px 0;
  color: #6b7280;
  font-size: 0.95em;
}

/* Description */
[data-projex-card-description] {
  margin: 12px 0;
  color: #4b5563;
  line-height: 1.6;
}

/* Tags */
[data-projex-card-tags] {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 12px 0;
}

[data-projex-tag] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85em;
  font-weight: 500;
}

/* Stats */
[data-projex-card-stats] {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 12px 0;
  padding: 12px 0;
  border-top: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
}

[data-projex-stat] {
  color: #6b7280;
  font-size: 0.9em;
}

/* Status */
[data-projex-status] {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

[data-projex-status-value="active"] {
  background: #ecfdf5;
  color: #047857;
}

[data-projex-status-value="shipped"] {
  background: #eff6ff;
  color: #1d4ed8;
}

[data-projex-status-value="in-progress"] {
  background: #fef3c7;
  color: #b45309;
}

[data-projex-status-value="coming-soon"] {
  background: #f5f3ff;
  color: #7c3aed;
}

[data-projex-status-value="archived"] {
  background: #f3f4f6;
  color: #4b5563;
}

[data-projex-status-value="for-sale"] {
  background: #fee2e2;
  color: #b91c1c;
}

/* Links */
[data-projex-card-links] {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

[data-projex-link] {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  text-decoration: none;
  font-size: 0.9em;
  font-weight: 500;
  transition: all 0.2s;
}

[data-projex-link]:hover {
  background: #374151;
  color: #fff;
  border-color: #374151;
}

/* Grid */
[data-projex-grid] {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

/* List */
[data-projex-list] {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

## CSS Custom Properties

All components use CSS custom properties with fallback values. This allows fine-grained customization without editing theme files:

```css
:root {
  --folio-card-bg: #ffffff;
  --folio-card-border: #e5e7eb;
  --folio-card-radius: 8px;
  --folio-card-padding: 16px;
  --folio-card-text: #374151;

  --folio-tag-bg: #f3f4f6;
  --folio-tag-text: #374151;
  --folio-tag-radius: 4px;

  --folio-stats-label: #6b7280;
  --folio-stats-value: #374151;

  --folio-link-text: #374151;

  --folio-status-active-bg: #dcfce7;
  --folio-status-active-text: #166534;
  --folio-status-shipped-bg: #dbeafe;
  --folio-status-shipped-text: #1e40af;
  --folio-status-in-progress-bg: #fef3c7;
  --folio-status-in-progress-text: #92400e;
  --folio-status-coming-soon-bg: #f3e8ff;
  --folio-status-coming-soon-text: #7c3aed;
  --folio-status-archived-bg: #f1f5f9;
  --folio-status-archived-text: #475569;
  --folio-status-for-sale-bg: #fee2e2;
  --folio-status-for-sale-text: #991b1b;
}
```

**Target specific components:**

```css
/* Override only GitHub-type cards */
[data-projex-type-value="github"] {
  --folio-card-bg: #f0fdf4;
}

/* Override specific project by ID */
[data-projex-card="my-project"] {
  --folio-card-border: #10b981;
}
```

## Best Practices

1. **Use data attributes, not classes** - Projex provides semantic data attributes for all elements. Use these instead of adding your own classes for consistent styling.

2. **Start with base styles** - Define base styles for `[data-projex-card]`, `[data-projex-card-header]`, etc., then build type-specific styles on top.

3. **Use CSS variables** - Make your styles themeable with CSS variables for colors, spacing, and other values.

4. **Consider responsive design** - Use `@media` queries to adjust layouts for different screen sizes, especially for grids.

5. **Progressive enhancement** - Ensure your portfolio works and looks good even without JavaScript (Projex generates static HTML at build time).

6. **Accessibility** - Use semantic HTML (provided by Projex) and ensure sufficient color contrast for text.

7. **Performance** - Keep CSS efficient by avoiding overly specific selectors and using the cascade wisely.
