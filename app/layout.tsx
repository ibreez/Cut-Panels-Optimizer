import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CPO V17',
  description: 'Cut Panel Optimizer',
  createdBy: 'Breezy',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
