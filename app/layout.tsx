import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CollabSpace',
  description: 'A collaborative space for real-time project management and team collaboration',
  generator: 'Next.js',
}

export default function RootLayout({
  // app/layout.tsx

  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}
