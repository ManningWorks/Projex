export interface GitHubRepoData {
    name: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    topics: string[];
    html_url: string;
    homepage: string | null;
    fork: boolean;
    archived: boolean;
}
export type FetchReposError = 'rate_limit' | 'network' | 'not_found' | 'other';
export interface FetchReposResult {
    data: GitHubRepoData[] | null;
    error: FetchReposError | null;
    rateLimitRemaining: number | null;
}
export declare function fetchGitHubRepos(username: string): Promise<FetchReposResult>;
//# sourceMappingURL=github.d.ts.map