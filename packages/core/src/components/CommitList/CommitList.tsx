import type { ProjectCommit } from '../../types'

function CommitList({ commits }: { commits: ProjectCommit[] }) {
  if (!commits || commits.length === 0) return null

  return (
    <div data-folio-commit-list>
      {commits.map((commit) => (
        <div key={commit.url} data-folio-commit>
          <div data-folio-commit-message>
            {commit.message.length > 100
              ? `${commit.message.slice(0, 100)}...`
              : commit.message}
          </div>
          <div data-folio-commit-date>{commit.date}</div>
          {commit.url && (
            <a href={commit.url} data-folio-commit-link>
              View Commit
            </a>
          )}
          {commit.author && 'name' in commit.author && commit.author.name && (
            <div data-folio-commit-author>{commit.author.name}</div>
          )}
        </div>
      ))}
    </div>
  )
}

export { CommitList }
