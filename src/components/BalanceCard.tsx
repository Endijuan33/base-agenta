'use client'

import { useBalance } from 'wagmi'
import { formatUnits } from 'viem'
import { WalletCards, AlertTriangle } from 'lucide-react'

interface BalanceCardProps {
  address: `0x${string}` | undefined;
}

// A more robust number formatting function for crypto values
const formatBalance = (value: bigint, decimals: number): string => {
    const formattedValue = parseFloat(formatUnits(value, decimals));

    if (formattedValue === 0) return '0.00';

    // Use significant digits for very small numbers, and fraction digits for larger ones
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: formattedValue < 1 ? 6 : 4, 
    }).format(formattedValue);
}

const BalanceCard = ({ address }: BalanceCardProps) => {

  const { data: balance, isLoading, error } = useBalance({ address });

  // Base classes for the card
  const cardClasses = "card relative p-6 flex flex-col justify-between h-48 overflow-hidden";

  // Shimmer effect for loading state
  const ShimmerEffect = () => (
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_infinite]" />
  );

  if (!address) {
    return (
      <div className={cardClasses}>
        <div className="flex justify-between items-start">
            <p className="font-semibold text-gray-300">Native Balance</p>
            <WalletCards className="h-6 w-6 text-gray-500" />
        </div>
        <div className="text-center">
            <p className="text-lg text-gray-400">Please connect your wallet.</p>
        </div>
        <div/>{/* Empty div for flex alignment */}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={cardClasses}>
        <ShimmerEffect />
        <div className="h-6 bg-gray-600/50 rounded w-3/4 mb-4"></div>
        <div className="h-12 bg-gray-500/50 rounded w-1/2"></div>
      </div>
    )
  }

  if (error || !balance) {
      return (
          <div className={`${cardClasses} items-center justify-center text-center`}>
              <AlertTriangle className="h-8 w-8 text-red-400 mb-2" />
              <p className="font-semibold text-red-400">Balance Unavailable</p>
              <p className="text-xs text-gray-500 max-w-xs mt-1">Could not fetch balance. The network might be busy.</p>
          </div>
      )
  }

  return (
    <div className={cardClasses}>
        {/* Decorative background gradient */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-vibrant-purple/20 rounded-full blur-3xl opacity-50" />

        <div className="flex justify-between items-start z-10">
            <p className="text-lg font-semibold text-gray-200">Native Balance</p>
            <WalletCards className="h-6 w-6 text-gray-400" />
        </div>

        <div className="z-10">
            <span className="text-5xl font-bold text-white">{formatBalance(balance.value, balance.decimals)}</span>
            <span className="ml-2 text-2xl font-medium text-gray-400">{balance.symbol}</span>
        </div>
    </div>
  )
}

export default BalanceCard
