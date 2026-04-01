# Creator Portfolio

A portfolio example for content creators who have a YouTube channel and sell digital products on Gumroad. This demonstrates how to showcase your content and products in one place.

## Features

- **YouTube integration** - Display subscriber count, total views, and latest video
- **Gumroad products** - Show sales, revenue, and product links
- **Hybrid projects** - Combine YouTube with products you're promoting
- **Manual projects** - Highlight courses, templates, or services

## Use Case

Perfect for:
- YouTubers selling courses, ebooks, or templates
- Content creators with paid products
- Developers who teach and sell digital goods

## Code

```tsx
import { 
  ProjectCard, 
  ProjectGrid,
  ShowcaseCard 
} from '@manningworks/projex'

function CreatorPortfolio({ projects }) {
  return (
    <div>
      <h1>My Content</h1>
      <p>YouTube tutorials, courses, and resources.</p>

      <ProjectGrid>
        {projects.map((project) => (
          <ProjectCard key={project.id}>
            <ProjectCard.Header project={project} />
            <ProjectCard.Description project={project} />
            <ProjectCard.Stats project={project} />
            <ProjectCard.Links project={project} />
          </ProjectCard>
        ))}
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
  // YouTube channel
  {
    id: 'my-channel',
    type: 'youtube',
    channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
    status: 'active',
    name: 'My Channel',
    tagline: 'Tutorials on web development',
  },
  // Gumroad products
  {
    id: 'course-name',
    type: 'gumroad',
    productId: 'prod_abc123',
    status: 'shipped',
    name: 'Complete React Course',
    tagline: 'Master React from scratch',
    description: 'A comprehensive course covering React, hooks, and modern patterns.',
    stack: ['React', 'TypeScript', 'Next.js'],
    links: {
      live: 'https://gumroad.com/l/abc123',
    },
  },
  {
    id: 'template-name',
    type: 'gumroad',
    productId: 'prod_xyz789',
    status: 'shipped',
    name: 'Portfolio Template',
    tagline: 'Beautiful portfolio starter',
    description: 'A beautiful, customizable portfolio template for developers.',
    stack: ['Next.js', 'Tailwind'],
    links: {
      live: 'https://gumroad.com/l/xyz789',
    },
  },
])
```

## Environment Variables

You'll need to set up API tokens for the build:

```bash
# .env.local
YOUTUBE_TOKEN=your_youtube_api_key
GUMROAD_TOKEN=your_gumroad_access_token
```

### Getting YouTube Token

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create API key credentials

### Getting Gumroad Token

1. Go to [Gumroad Settings](https://app.gumroad.com/settings/api_tokens)
2. Generate a new access token
3. Copy the token (shown once)

## Stats Displayed

**YouTube:**
- Subscribers
- Total channel views
- Latest video title & URL

**Gumroad:**
- Total sales
- Formatted revenue
- Product URL

## Styling Example

```css
/* Creator-style cards */
[data-projex-card] {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  background: #fff;
}

/* YouTube-style stats */
[data-projex-stat="subscribers"]::before {
  content: '👤 ';
}

[data-projex-stat="views"]::before {
  content: '👁️ ';
}

/* Gumroad-style stats */
[data-projex-stat="sales"]::before {
  content: '💰 ';
}

/* Grid layout */
[data-projex-grid] {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}
```

For more styling patterns, see the [Styling Guide](../guides/styling).

## Tips

1. **Feature your channel** - Put your YouTube channel first to showcase your content
2. **Link products to videos** - Add video links to product descriptions
3. **Use consistent tags** - Tag products by topic to match your video content
4. **Update regularly** - Rebuild when you publish new videos or products
5. **Add Product Hunt** - Track launches with the product-hunt type

## Next Steps

- Add Product Hunt integration to track launches
- Create hybrid projects linking videos to products
- Add search to find specific content
- Include a newsletter or email list
