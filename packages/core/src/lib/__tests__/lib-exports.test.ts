import { describe, it, expect } from 'vitest'
import { projexProjectInputSchema, type ProjexProjectInputZod } from '../index'

describe('lib index exports', () => {
  it('should export projexProjectInputSchema from lib/index', () => {
    expect(projexProjectInputSchema).toBeDefined()
    expect(typeof projexProjectInputSchema.parse).toBe('function')
  })

  it('should export ProjexProjectInputZod type from lib/index', () => {
    const typeCheck: ProjexProjectInputZod = {
      id: 'test',
      type: 'github',
      repo: 'user/repo',
      status: 'active'
    }
    expect(typeCheck).toBeDefined()
  })

  it('should validate a valid project using schema from lib/index', () => {
    const result = projexProjectInputSchema.safeParse({
      id: 'test',
      type: 'github',
      repo: 'user/repo',
      status: 'active'
    })
    expect(result.success).toBe(true)
  })
})
