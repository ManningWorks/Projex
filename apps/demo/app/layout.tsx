import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Folio Demo',
  description: 'Demo application for Folio component library',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
