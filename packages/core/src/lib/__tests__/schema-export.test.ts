import { describe, it, expect } from 'vitest'
import { projexProjectInputSchema } from '../config-schema'

describe('config schema exports', () => {
  it('should export projexProjectInputSchema', () => {
    expect(projexProjectInputSchema).toBeDefined()
    expect(typeof projexProjectInputSchema.parse).toBe('function')
  })

  it('should validate a valid GitHub project', () => {
    const result = projexProjectInputSchema.safeParse({
      id: 'test',
      type: 'github',
      repo: 'user/repo',
      status: 'active'
    })
    expect(result.success).toBe(true)
  })

  it('should validate a valid manual project', () => {
    const result = projexProjectInputSchema.safeParse({
      id: 'test',
      type: 'manual',
      status: 'active',
      name: 'Test Project',
      description: 'Test description'
    })
    expect(result.success).toBe(true)
  })
})
