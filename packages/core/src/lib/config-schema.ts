import { z } from 'zod'

const projectStatusSchema = z.enum([
  'active',
  'shipped',
  'in-progress',
  'coming-soon',
  'archived',
  'for-sale',
])

const projectStruggleTypeSchema = z.enum(['warn', 'error'])

const projectStruggleSchema = z.object({
  type: projectStruggleTypeSchema,
  text: z.string(),
})

const projectTimelineEntrySchema = z.object({
  date: z.string(),
  note: z.string(),
})

const projectPostSchema = z.object({
  title: z.string(),
  date: z.string(),
  url: z.string().url().optional(),
})

const projectStatsSchema = z
  .object({
    stars: z.number().optional(),
    forks: z.number().optional(),
    downloads: z.string().optional(),
    version: z.string().optional(),
    upvotes: z.number().optional(),
    comments: z.number().optional(),
    launchDate: z.string().optional(),
  })
  .optional()

const customLinkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
})

const projectLinksSchema = z.object({
  github: z.string().url().optional(),
  live: z.string().url().optional(),
  npm: z.string().url().optional(),
  docs: z.string().url().optional(),
  demo: z.string().url().optional(),
  appStore: z.string().url().optional(),
  playStore: z.string().url().optional(),
  productHunt: z.string().url().optional(),
  custom: customLinkSchema.array().optional(),
})

const baseProjectInputSchema = z.object({
  id: z.string(),
  status: projectStatusSchema,
  featured: z.boolean().optional(),
  name: z.string().optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  background: z.string().optional(),
  why: z.string().optional(),
  image: z.string().optional(),
  struggles: projectStruggleSchema.array().optional(),
  timeline: projectTimelineEntrySchema.array().optional(),
  posts: projectPostSchema.array().optional(),
  stack: z.string().array().optional(),
  links: projectLinksSchema.optional(),
  stats: projectStatsSchema.optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  linkOrder: z.string().array().optional(),
  override: z
    .object({
      name: z.string().optional(),
      tagline: z.string().optional(),
      description: z.string().optional(),
      stack: z.string().array().optional(),
    })
    .optional(),
})

const gitHubProjectInputSchema = baseProjectInputSchema.extend({
  type: z.literal('github'),
  repo: z.string(),
  commits: z.number().optional(),
})

const manualProjectInputSchema = baseProjectInputSchema.extend({
  type: z.literal('manual'),
})

const npmProjectInputSchema = baseProjectInputSchema.extend({
  type: z.literal('npm'),
  package: z.string(),
})

const productHuntProjectInputSchema = baseProjectInputSchema.extend({
  type: z.literal('product-hunt'),
  slug: z.string(),
})

const hybridProjectInputSchema = baseProjectInputSchema.extend({
  type: z.literal('hybrid'),
  repo: z.string(),
  package: z.string(),
  commits: z.number().optional(),
})

const youtubeProjectInputSchema = baseProjectInputSchema.extend({
  type: z.literal('youtube'),
  channelId: z.string(),
})

const gumroadProjectInputSchema = baseProjectInputSchema.extend({
  type: z.literal('gumroad'),
  productId: z.string(),
})

const lemonSqueezyProjectInputSchema = baseProjectInputSchema.extend({
  type: z.literal('lemonsqueezy'),
  storeId: z.string(),
})

const devToProjectInputSchema = baseProjectInputSchema.extend({
  type: z.literal('devto'),
  username: z.string(),
})

export const projexProjectInputSchema = z.discriminatedUnion('type', [
  gitHubProjectInputSchema,
  manualProjectInputSchema,
  npmProjectInputSchema,
  productHuntProjectInputSchema,
  hybridProjectInputSchema,
  youtubeProjectInputSchema,
  gumroadProjectInputSchema,
  lemonSqueezyProjectInputSchema,
  devToProjectInputSchema,
])

export type ProjexProjectInputZod = z.infer<typeof projexProjectInputSchema>
