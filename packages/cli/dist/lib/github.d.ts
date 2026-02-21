export interface GitHubRepoData {
    name: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    topics: string[];
    html_url: string;
    homepage: string | null;
}
export declare function fetchGitHubRepos(username: string): Promise<GitHubRepoData[] | null>;
//# sourceMappingURL=github.d.ts.map