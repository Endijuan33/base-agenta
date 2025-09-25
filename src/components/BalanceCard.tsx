
'use client'

import { useAccount, useBalance } from 'wagmi'

export function BalanceCard() {
  const { address } = useAccount()
  const { data: nativeBalance } = useBalance({ address })

  // TODO: Add ERC20 balance

  return (
    <div className="p-4 bg-gray-100 rounded-md dark:bg-gray-800">
      <h3 className="text-lg font-bold">Balances</h3>
      <div className="mt-4">
        <p className="text-sm font-medium">
          Native Token: {nativeBalance?.formatted} {nativeBalance?.symbol}
        </p>
        {/* TODO: Display ERC20 balance */}
      </div>
    </div>
  )
}
