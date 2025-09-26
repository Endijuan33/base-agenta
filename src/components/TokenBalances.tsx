'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useChainId } from 'wagmi';
import { formatUnits } from 'viem';

// Define the structure of a token balance item from Covalent API
interface TokenBalance {
  logo_url: string;
  contract_name: string;
  contract_ticker_symbol: string;
  balance: string;
  quote: number;
  contract_decimals: number;
}

// Helper to format balance safely and effectively
const formatTokenBalance = (balance: string, decimals: number): string => {
  try {
    const formattedValue = parseFloat(formatUnits(BigInt(balance), decimals));
    if (formattedValue === 0) return '0.00';

    // Use smart formatting for readability
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: formattedValue < 1 ? 6 : 4, // More precision for small numbers
    }).format(formattedValue);

  } catch (error) {
    console.error("Error formatting balance:", { balance, decimals }, error);
    return '0.00';
  }
};

// Skeleton component for loading state
const TokenRowSkeleton = () => (
  <li className="bg-white/5 p-4 rounded-lg flex items-center justify-between animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 rounded-full bg-gray-600"></div>
      <div>
        <div className="h-4 bg-gray-600 rounded w-24 mb-2"></div>
        <div className="h-3 bg-gray-600 rounded w-16"></div>
      </div>
    </div>
    <div className="text-right">
      <div className="h-4 bg-gray-600 rounded w-20 mb-2"></div>
      <div className="h-3 bg-gray-600 rounded w-12"></div>
    </div>
  </li>
);

interface TokenBalancesProps {
  address: `0x${string}` | undefined;
}

const TokenBalances = ({ address }: TokenBalancesProps) => {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chainId = useChainId();

  useEffect(() => {
    if (!address) {
      setBalances([]);
      return;
    }

    const fetchBalances = async () => {
      setIsLoading(true);
      setError(null);

      // Fetch from our own secure API route
      const url = `/api/balances?address=${address}&chainId=${chainId}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed to fetch balances: ${response.statusText}`);
        }

        setBalances(data.data.items || []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, [address, chainId]);

  const renderContent = () => {
    if (!address) {
      return <p className="text-center text-gray-400 py-8">Please connect your wallet.</p>;
    }
    if (isLoading) {
      // Render skeleton loaders
      return (
        <ul className="space-y-3">
          {[...Array(3)].map((_, i) => <TokenRowSkeleton key={i} />)}
        </ul>
      );
    }
    if (error) {
      return <p className="text-center text-red-400 py-8">Error: {error}</p>;
    }
    if (balances.length === 0) {
      return <p className="text-center text-gray-400 py-8">No token balances found on this network.</p>;
    }

    return (
      <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {balances.map((token) => (
          <li key={`${token.contract_ticker_symbol}-${token.contract_name}`} className="bg-white/5 p-4 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors duration-200">
            <div className="flex items-center space-x-4">
              {token.logo_url ? 
                <Image src={token.logo_url} alt={`${token.contract_name} logo`} width={40} height={40} className="rounded-full bg-white" /> 
                : <div className='w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold text-white'>{token.contract_ticker_symbol?.[0] || '?'}</div>
              }
              <div>
                <p className="font-bold text-white">{token.contract_name}</p>
                <p className="text-sm text-gray-400">{token.contract_ticker_symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">{formatTokenBalance(token.balance, token.contract_decimals)}</p>
              <p className="text-sm text-green-400">${token.quote?.toFixed(2) ?? '0.00'}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    // Use the reusable card class for consistent styling
    <div className="card w-full max-w-4xl">
      <h2 className="text-2xl font-bold text-white mb-6">Token Balances</h2>
      {renderContent()}
    </div>
  );
};

export default TokenBalances;
