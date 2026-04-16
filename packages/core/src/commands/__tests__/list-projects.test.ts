import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listProjectsCommand } from '../list-projects.js'
import * as configEditor from '../../lib/config-editor.js'

vi.mock('node:fs')

vi.mock('../../lib/config-editor.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../lib/config-editor.js')>()
  return {
    ...actual,
    getProjectSummaries: vi.fn(),
  }
})

describe('listProjectsCommand', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should display table with projects', async () => {
    const { existsSync } = await import('node:fs')
    vi.mocked(existsSync).mockReturnValue(true)

    vi.mocked(configEditor.getProjectSummaries).mockReturnValue([
      { id: 'project-1', type: 'github', status: 'active', featured: true, name: 'Project One' },
      { id: 'project-2', type: 'npm', status: 'shipped', featured: false, name: 'project-2' },
    ])

    const tableSpy = vi.spyOn(console, 'table').mockImplementation(() => {})

    await listProjectsCommand()

    expect(tableSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          ID: 'project-1',
          Type: 'github',
          Status: 'active',
          Featured: '★',
          Name: 'Project One',
        }),
        expect.objectContaining({
          ID: 'project-2',
          Type: 'npm',
          Status: 'shipped',
          Featured: '-',
          Name: 'project-2',
        }),
      ]),
    )

    tableSpy.mockRestore()
  })

  it('should print "No projects found" when empty', async () => {
    const { existsSync } = await import('node:fs')
    vi.mocked(existsSync).mockReturnValue(true)

    vi.mocked(configEditor.getProjectSummaries).mockReturnValue([])

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    await listProjectsCommand()

    expect(logSpy).toHaveBeenCalledWith('No projects found.')

    logSpy.mockRestore()
  })

  it('should exit when config file not found', async () => {
    const { existsSync } = await import('node:fs')
    vi.mocked(existsSync).mockReturnValue(false)

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

    await listProjectsCommand()

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('not found'))
    expect(exitSpy).toHaveBeenCalledWith(1)

    errorSpy.mockRestore()
    exitSpy.mockRestore()
  })

  it('should truncate long values', async () => {
    const { existsSync } = await import('node:fs')
    vi.mocked(existsSync).mockReturnValue(true)

    vi.mocked(configEditor.getProjectSummaries).mockReturnValue([
      {
        id: 'a-very-long-project-id-that-exceeds',
        type: 'github',
        status: 'active',
        featured: true,
        name: 'A Very Long Project Name That Should Be Truncated',
      },
    ])

    const tableSpy = vi.spyOn(console, 'table').mockImplementation(() => {})

    await listProjectsCommand()

    const rows = tableSpy.mock.calls[0][0] as Array<Record<string, string>>
    expect(rows[0].ID.length).toBeLessThanOrEqual(20)
    expect(rows[0].Name.length).toBeLessThanOrEqual(20)

    tableSpy.mockRestore()
  })
})
