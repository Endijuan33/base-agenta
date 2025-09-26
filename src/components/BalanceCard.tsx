'use client'

import { useAccount, useBalance } from 'wagmi'
import { formatUnits } from 'viem'

const BalanceCard = () => {
  const { address, isConnected } = useAccount()
  const { data: balance, isLoading } = useBalance({ address })

  if (!isConnected) {
    return (
      <div className="p-6 rounded-lg bg-[rgba(var(--card-background),0.7)] border border-[rgba(var(--card-border),0.7)] backdrop-blur-sm shadow-lg">
        <p className="text-gray-400">Please connect your wallet to see your balance.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6 rounded-lg bg-[rgba(var(--card-background),0.7)] border border-[rgba(var(--card-border),0.7)] backdrop-blur-sm shadow-lg">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-lg bg-[rgba(var(--card-background),0.7)] border border-[rgba(var(--card-border),0.7)] backdrop-blur-sm shadow-lg space-y-2">
      <p className="text-sm font-semibold text-gray-300">Total Balance</p>
      {balance ? (
        <p className="text-3xl font-bold text-white">
          {parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} {balance.symbol}
        </p>
      ) : (
        <p className="text-gray-400">Could not fetch balance.</p>
      )}
    </div>
  )
}

export default BalanceCard
