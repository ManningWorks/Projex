function ProjectList({ children }: { children: React.ReactNode }) {
  if (!children) return null
  return <div data-folio-list>{children}</div>
}

export { ProjectList }
