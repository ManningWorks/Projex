declare module 'prismjs/components/*' {
  const Prism: any
  export = Prism
}

declare module 'prismjs/components/prism-*' {
  const Prism: any
  export = Prism
}

declare module 'prismjs' {
  const Prism: {
    highlightElement: (element: HTMLElement) => void
    languages: Record<string, any>
  }
  export = Prism
}
