import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import inquirer from 'inquirer';
import { init } from '../init';
import * as fs from 'node:fs/promises';
import { fetchGitHubRepos } from '../../lib/github';
vi.mock('node:fs/promises', () => ({
    writeFile: vi.fn(),
    access: vi.fn(),
    readFile: vi.fn(),
}));
vi.mock('inquirer', () => ({
    default: {
        prompt: vi.fn(),
    },
}));
vi.mock('../../lib/github.js', () => ({
    fetchGitHubRepos: vi.fn(),
}));
const mockFs = vi.mocked(fs);
const mockFetchGitHubRepos = vi.mocked(fetchGitHubRepos);
const consoleSpy = {
    log: vi.spyOn(console, 'log').mockImplementation(() => { }),
    error: vi.spyOn(console, 'error').mockImplementation(() => { }),
};
const originalProcessExit = process.exit;
let mockProcessExit;
class ExitProcessError extends Error {
    code;
    constructor(code) {
        super(`Process exited with code ${code}`);
        this.code = code;
    }
}
const originalEnv = process.env;
describe('init command', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockProcessExit = vi.fn((code) => {
            throw new ExitProcessError(code);
        });
        process.exit = mockProcessExit;
        mockFs.access.mockImplementation(() => Promise.reject(new Error('File not found')));
        mockFs.readFile.mockResolvedValue('{}');
        mockFs.writeFile.mockResolvedValue(undefined);
        process.env = { ...originalEnv };
        delete process.env.GITHUB_TOKEN;
    });
    afterEach(() => {
        process.exit = originalProcessExit;
        process.env = originalEnv;
    });
    describe('basic init (without --github)', () => {
        it('should create folio.config.ts with template content', async () => {
            await init();
            expect(mockFs.writeFile).toHaveBeenCalledWith(expect.stringContaining('folio.config.ts'), expect.stringContaining("import { defineProjects } from '@folio/core'"), 'utf-8');
        });
        it('should show success message after creating config', async () => {
            await init();
            expect(consoleSpy.log).toHaveBeenCalledWith(expect.stringContaining('folio.config.ts created successfully'));
        });
        it('should warn when Next.js not detected', async () => {
            await init();
            expect(consoleSpy.log).toHaveBeenCalledWith(expect.stringContaining('Next.js not detected'));
        });
        it('should warn when package.json not found', async () => {
            await init();
            expect(consoleSpy.log).toHaveBeenCalledWith(expect.stringContaining('package.json not found'));
        });
        it('should skip overwrite prompt when config file does not exist', async () => {
            await init();
            expect(mockFs.writeFile).toHaveBeenCalled();
        });
        it('should handle permission denied error', async () => {
            const error = new Error('Permission denied');
            error.code = 'EACCES';
            mockFs.writeFile.mockRejectedValue(error);
            try {
                await init();
            }
            catch (e) {
                expect(e).toBeInstanceOf(ExitProcessError);
            }
            expect(consoleSpy.error).toHaveBeenCalledWith(expect.stringContaining('Permission denied'));
        });
        it('should handle generic write errors', async () => {
            mockFs.writeFile.mockRejectedValue(new Error('Write failed'));
            try {
                await init();
            }
            catch (e) {
                expect(e).toBeInstanceOf(ExitProcessError);
            }
            expect(consoleSpy.error).toHaveBeenCalledWith(expect.stringContaining('Failed to create'));
        });
    });
    describe('github init (with --github)', () => {
        it('should prompt for GitHub username', async () => {
            vi.mocked(inquirer.prompt)
                .mockResolvedValueOnce({ username: 'testuser' })
                .mockResolvedValueOnce({ includeForks: false });
            mockFetchGitHubRepos.mockResolvedValue({
                data: [
                    {
                        name: 'test-repo',
                        description: 'Test repository',
                        stargazers_count: 100,
                        forks_count: 10,
                        language: 'TypeScript',
                        topics: [],
                        html_url: 'https://github.com/testuser/test-repo',
                        homepage: null,
                        fork: false,
                        archived: false,
                    },
                ],
                error: null,
                rateLimitRemaining: 60,
            });
            await init({ github: true });
            expect(inquirer.prompt).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({
                    name: 'username',
                    type: 'input',
                }),
            ]));
        });
        it('should create config with fetched repositories', async () => {
            vi.mocked(inquirer.prompt)
                .mockResolvedValueOnce({ username: 'testuser' })
                .mockResolvedValueOnce({ includeForks: false });
            mockFetchGitHubRepos.mockResolvedValue({
                data: [
                    {
                        name: 'my-project',
                        description: 'My awesome project',
                        stargazers_count: 50,
                        forks_count: 5,
                        language: 'TypeScript',
                        topics: ['react', 'typescript'],
                        html_url: 'https://github.com/testuser/my-project',
                        homepage: 'https://example.com',
                        fork: false,
                        archived: false,
                    },
                ],
                error: null,
                rateLimitRemaining: 60,
            });
            await init({ github: true });
            const writeFileCall = mockFs.writeFile.mock.calls[0];
            expect(writeFileCall[0]).toContain('folio.config.ts');
            expect(writeFileCall[1]).toContain("id: 'my-project'");
        });
        it('should show error for invalid GitHub username', async () => {
            vi.mocked(inquirer.prompt).mockResolvedValueOnce({ username: 'invaliduser' });
            mockFetchGitHubRepos.mockResolvedValue({
                data: null,
                error: 'not_found',
                rateLimitRemaining: null,
            });
            try {
                await init({ github: true });
            }
            catch (e) {
                expect(e).toBeInstanceOf(ExitProcessError);
            }
            expect(consoleSpy.log).toHaveBeenCalledWith(expect.stringContaining('not found'));
        });
        it('should show rate limit warning without GITHUB_TOKEN', async () => {
            delete process.env.GITHUB_TOKEN;
            vi.mocked(inquirer.prompt).mockResolvedValueOnce({ username: 'testuser' });
            mockFetchGitHubRepos.mockResolvedValue({
                data: null,
                error: 'rate_limit',
                rateLimitRemaining: 0,
            });
            try {
                await init({ github: true });
            }
            catch (e) {
                expect(e).toBeInstanceOf(ExitProcessError);
            }
            expect(consoleSpy.log).toHaveBeenCalledWith(expect.stringContaining('60 requests/hour'));
            expect(consoleSpy.log).toHaveBeenCalledWith(expect.stringContaining('GITHUB_TOKEN'));
        });
        it('should show network error message', async () => {
            vi.mocked(inquirer.prompt).mockResolvedValueOnce({ username: 'testuser' });
            mockFetchGitHubRepos.mockResolvedValue({
                data: null,
                error: 'network',
                rateLimitRemaining: null,
            });
            try {
                await init({ github: true });
            }
            catch (e) {
                expect(e).toBeInstanceOf(ExitProcessError);
            }
            expect(consoleSpy.log).toHaveBeenCalledWith(expect.stringContaining('network connection'));
        });
        it('should show error when no repositories found', async () => {
            vi.mocked(inquirer.prompt).mockResolvedValueOnce({ username: 'testuser' });
            mockFetchGitHubRepos.mockResolvedValue({
                data: [],
                error: null,
                rateLimitRemaining: 60,
            });
            try {
                await init({ github: true });
            }
            catch (e) {
                expect(e).toBeInstanceOf(ExitProcessError);
            }
            expect(consoleSpy.log).toHaveBeenCalledWith(expect.stringContaining('No repositories found'));
        });
        it('should filter out archived repositories', async () => {
            vi.mocked(inquirer.prompt)
                .mockResolvedValueOnce({ username: 'testuser' })
                .mockResolvedValueOnce({ includeForks: false });
            mockFetchGitHubRepos.mockResolvedValue({
                data: [
                    {
                        name: 'active-repo',
                        description: 'Active',
                        stargazers_count: 10,
                        forks_count: 1,
                        language: 'TypeScript',
                        topics: [],
                        html_url: 'https://github.com/testuser/active-repo',
                        homepage: null,
                        fork: false,
                        archived: false,
                    },
                    {
                        name: 'archived-repo',
                        description: 'Archived',
                        stargazers_count: 20,
                        forks_count: 2,
                        language: 'JavaScript',
                        topics: [],
                        html_url: 'https://github.com/testuser/archived-repo',
                        homepage: null,
                        fork: false,
                        archived: true,
                    },
                ],
                error: null,
                rateLimitRemaining: 60,
            });
            await init({ github: true });
            const writeFileCall = mockFs.writeFile.mock.calls[0];
            expect(writeFileCall[1]).toContain('active-repo');
            expect(writeFileCall[1]).not.toContain('archived-repo');
        });
        it('should filter out repositories without description', async () => {
            vi.mocked(inquirer.prompt)
                .mockResolvedValueOnce({ username: 'testuser' })
                .mockResolvedValueOnce({ includeForks: false });
            mockFetchGitHubRepos.mockResolvedValue({
                data: [
                    {
                        name: 'with-desc',
                        description: 'Has description',
                        stargazers_count: 10,
                        forks_count: 1,
                        language: 'TypeScript',
                        topics: [],
                        html_url: 'https://github.com/testuser/with-desc',
                        homepage: null,
                        fork: false,
                        archived: false,
                    },
                    {
                        name: 'no-desc',
                        description: null,
                        stargazers_count: 20,
                        forks_count: 2,
                        language: 'JavaScript',
                        topics: [],
                        html_url: 'https://github.com/testuser/no-desc',
                        homepage: null,
                        fork: false,
                        archived: false,
                    },
                ],
                error: null,
                rateLimitRemaining: 60,
            });
            await init({ github: true });
            const writeFileCall = mockFs.writeFile.mock.calls[0];
            expect(writeFileCall[1]).toContain('with-desc');
            expect(writeFileCall[1]).not.toContain('no-desc');
        });
        it('should filter out forked repos when user declines', async () => {
            vi.mocked(inquirer.prompt)
                .mockResolvedValueOnce({ username: 'testuser' })
                .mockResolvedValueOnce({ includeForks: false });
            mockFetchGitHubRepos.mockResolvedValue({
                data: [
                    {
                        name: 'original-repo',
                        description: 'Original',
                        stargazers_count: 10,
                        forks_count: 1,
                        language: 'TypeScript',
                        topics: [],
                        html_url: 'https://github.com/testuser/original-repo',
                        homepage: null,
                        fork: false,
                        archived: false,
                    },
                    {
                        name: 'forked-repo',
                        description: 'Forked',
                        stargazers_count: 20,
                        forks_count: 2,
                        language: 'JavaScript',
                        topics: [],
                        html_url: 'https://github.com/testuser/forked-repo',
                        homepage: null,
                        fork: true,
                        archived: false,
                    },
                ],
                error: null,
                rateLimitRemaining: 60,
            });
            await init({ github: true });
            const writeFileCall = mockFs.writeFile.mock.calls[0];
            expect(writeFileCall[1]).toContain('original-repo');
            expect(writeFileCall[1]).not.toContain('forked-repo');
        });
        it('should include forked repos when user accepts', async () => {
            vi.mocked(inquirer.prompt)
                .mockResolvedValueOnce({ username: 'testuser' })
                .mockResolvedValueOnce({ includeForks: true });
            mockFetchGitHubRepos.mockResolvedValue({
                data: [
                    {
                        name: 'original-repo',
                        description: 'Original',
                        stargazers_count: 10,
                        forks_count: 1,
                        language: 'TypeScript',
                        topics: [],
                        html_url: 'https://github.com/testuser/original-repo',
                        homepage: null,
                        fork: false,
                        archived: false,
                    },
                    {
                        name: 'forked-repo',
                        description: 'Forked',
                        stargazers_count: 20,
                        forks_count: 2,
                        language: 'JavaScript',
                        topics: [],
                        html_url: 'https://github.com/testuser/forked-repo',
                        homepage: null,
                        fork: true,
                        archived: false,
                    },
                ],
                error: null,
                rateLimitRemaining: 60,
            });
            await init({ github: true });
            const writeFileCall = mockFs.writeFile.mock.calls[0];
            expect(writeFileCall[1]).toContain('original-repo');
            expect(writeFileCall[1]).toContain('forked-repo');
        });
        it('should filter out .template and .github.io repos', async () => {
            vi.mocked(inquirer.prompt)
                .mockResolvedValueOnce({ username: 'testuser' })
                .mockResolvedValueOnce({ includeForks: false });
            mockFetchGitHubRepos.mockResolvedValue({
                data: [
                    {
                        name: 'normal-repo',
                        description: 'Normal',
                        stargazers_count: 10,
                        forks_count: 1,
                        language: 'TypeScript',
                        topics: [],
                        html_url: 'https://github.com/testuser/normal-repo',
                        homepage: null,
                        fork: false,
                        archived: false,
                    },
                    {
                        name: 'my.template',
                        description: 'Template',
                        stargazers_count: 20,
                        forks_count: 2,
                        language: 'JavaScript',
                        topics: [],
                        html_url: 'https://github.com/testuser/my.template',
                        homepage: null,
                        fork: false,
                        archived: false,
                    },
                    {
                        name: 'testuser.github.io',
                        description: 'GitHub Pages',
                        stargazers_count: 30,
                        forks_count: 3,
                        language: 'HTML',
                        topics: [],
                        html_url: 'https://github.com/testuser/testuser.github.io',
                        homepage: null,
                        fork: false,
                        archived: false,
                    },
                ],
                error: null,
                rateLimitRemaining: 60,
            });
            await init({ github: true });
            const writeFileCall = mockFs.writeFile.mock.calls[0];
            expect(writeFileCall[1]).toContain('normal-repo');
            expect(writeFileCall[1]).not.toContain('my.template');
            expect(writeFileCall[1]).not.toContain('testuser.github.io');
        });
        it('should show error when no repos match criteria', async () => {
            vi.mocked(inquirer.prompt)
                .mockResolvedValueOnce({ username: 'testuser' })
                .mockResolvedValueOnce({ includeForks: false });
            mockFetchGitHubRepos.mockResolvedValue({
                data: [
                    {
                        name: 'archived-repo',
                        description: 'Archived',
                        stargazers_count: 10,
                        forks_count: 1,
                        language: 'TypeScript',
                        topics: [],
                        html_url: 'https://github.com/testuser/archived-repo',
                        homepage: null,
                        fork: false,
                        archived: true,
                    },
                ],
                error: null,
                rateLimitRemaining: 60,
            });
            try {
                await init({ github: true });
            }
            catch (e) {
                expect(e).toBeInstanceOf(ExitProcessError);
            }
            expect(consoleSpy.log).toHaveBeenCalledWith(expect.stringContaining('No repositories match'));
        });
        it('should escape single quotes in description', async () => {
            vi.mocked(inquirer.prompt)
                .mockResolvedValueOnce({ username: 'testuser' })
                .mockResolvedValueOnce({ includeForks: false });
            mockFetchGitHubRepos.mockResolvedValue({
                data: [
                    {
                        name: 'quote-repo',
                        description: "It's a test with 'quotes'",
                        stargazers_count: 10,
                        forks_count: 1,
                        language: 'TypeScript',
                        topics: [],
                        html_url: 'https://github.com/testuser/quote-repo',
                        homepage: null,
                        fork: false,
                        archived: false,
                    },
                ],
                error: null,
                rateLimitRemaining: 60,
            });
            await init({ github: true });
            const writeFileCall = mockFs.writeFile.mock.calls[0];
            expect(writeFileCall[1]).toContain("It\\'s a test with \\'quotes\\'");
        });
        it('should validate username is not empty', async () => {
            vi.mocked(inquirer.prompt)
                .mockResolvedValueOnce({ username: 'testuser' })
                .mockResolvedValueOnce({ includeForks: false });
            mockFetchGitHubRepos.mockResolvedValue({
                data: [],
                error: null,
                rateLimitRemaining: 60,
            });
            try {
                await init({ github: true });
            }
            catch {
                // Expected to exit
            }
            const promptCall = vi.mocked(inquirer.prompt).mock.calls[0];
            const questions = promptCall[0];
            const validateFn = questions[0]?.validate;
            if (validateFn) {
                expect(validateFn('')).toBe('Username is required');
                expect(validateFn('  ')).toBe('Username is required');
                expect(validateFn('validuser')).toBe(true);
            }
        });
    });
});
//# sourceMappingURL=init.test.js.map