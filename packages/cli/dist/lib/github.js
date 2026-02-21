export async function fetchGitHubRepos(username) {
    try {
        const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;
        const headers = {
            Accept: 'application/vnd.github.v3+json',
        };
        const token = process.env.GITHUB_TOKEN;
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        const response = await fetch(url, {
            headers,
        });
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data.map((repo) => ({
            name: repo.name,
            description: repo.description,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            language: repo.language,
            topics: repo.topics || [],
            html_url: repo.html_url,
            homepage: repo.homepage,
        }));
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=github.js.map