import { describe, it, expect } from 'vitest'
import { folioProjectInputSchema, type FolioProjectInputZod } from '../index'

describe('lib index exports', () => {
  it('should export folioProjectInputSchema from lib/index', () => {
    expect(folioProjectInputSchema).toBeDefined()
    expect(typeof folioProjectInputSchema.parse).toBe('function')
  })

  it('should export FolioProjectInputZod type from lib/index', () => {
    const typeCheck: FolioProjectInputZod = {
      id: 'test',
      type: 'github',
      repo: 'user/repo',
      status: 'active'
    }
    expect(typeCheck).toBeDefined()
  })

  it('should validate a valid project using schema from lib/index', () => {
    const result = folioProjectInputSchema.safeParse({
      id: 'test',
      type: 'github',
      repo: 'user/repo',
      status: 'active'
    })
    expect(result.success).toBe(true)
  })
})
