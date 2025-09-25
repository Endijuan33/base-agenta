
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Web3ModalProvider } from '../lib/wagmi'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'dApp Starter',
  description: 'A Next.js starter for building dApps',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3ModalProvider>
          {children}
          <Toaster />
        </Web3ModalProvider>
      </body>
    </html>
  )
}
