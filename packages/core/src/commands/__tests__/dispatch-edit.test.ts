import { describe, it, expect, vi, beforeEach } from 'vitest'
import { dispatchEdit } from '../dispatch-edit.js'

vi.mock('../edit-project.js', () => ({
  editProjectCommand: vi.fn(),
}))

describe('dispatchEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should route "project" to editProjectCommand with id', async () => {
    const { editProjectCommand } = await import('../edit-project.js')

    await dispatchEdit('project', 'my-project', { status: 'shipped' })

    expect(editProjectCommand).toHaveBeenCalledWith('my-project', { status: 'shipped' })
  })

  it('should exit when project is called without id', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

    await dispatchEdit('project', undefined)

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Project ID is required'),
    )
    expect(exitSpy).toHaveBeenCalledWith(1)

    errorSpy.mockRestore()
    exitSpy.mockRestore()
  })

  it('should exit for unknown content type', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

    await dispatchEdit('unknown', 'some-id')

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unknown content type'),
    )
    expect(exitSpy).toHaveBeenCalledWith(1)

    errorSpy.mockRestore()
    exitSpy.mockRestore()
  })
})
