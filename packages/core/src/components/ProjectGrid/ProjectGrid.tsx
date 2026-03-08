function ProjectGrid({ children }: { children: React.ReactNode }) {
  if (!children) return null
  return <div data-projex-grid>{children}</div>
}

export { ProjectGrid }
