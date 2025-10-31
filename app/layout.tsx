import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Legal Info Assistant (MVP)',
  description: 'Non-advisory legal information demo'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
