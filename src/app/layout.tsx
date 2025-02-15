import type { Metadata } from 'next'
import { PrimeReactProvider } from 'primereact/api'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

import 'primeflex/primeflex.css'
import 'primereact/resources/primereact.css'
import 'primereact/resources/themes/lara-dark-teal/theme.css'
import 'primeicons/primeicons.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PrimeReactProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} text-center`}>
          <h1>Taller de autos</h1>
          {children}
        </body>
      </PrimeReactProvider>
    </html>
  )
}
