function ProjectList({ children }: { children: React.ReactNode }) {
  if (!children) return null
  return <div data-projex-list>{children}</div>
}

export { ProjectList }
