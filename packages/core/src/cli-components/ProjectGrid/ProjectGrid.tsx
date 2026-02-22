function ProjectGrid({ children }: { children: React.ReactNode }) {
  if (!children) return null
  return <div data-folio-grid>{children}</div>
}

export { ProjectGrid }
