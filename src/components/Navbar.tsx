
'use client'

import { WalletButton } from './WalletButton'

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900">
      <div className="text-2xl font-bold">dApp Starter</div>
      <WalletButton />
    </nav>
  )
}
