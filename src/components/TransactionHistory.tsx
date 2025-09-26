'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useChainId } from 'wagmi';
import { chains } from '@/lib/wagmi'; // CORRECTED: Removed .tsx extension
import { formatUnits } from 'viem';

// 1. Utility function to truncate addresses
const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

// 2. Safer and more robust value formatting function
const formatTxValue = (value: string, decimals = 18) => {
    if (!value || value === '0') return '0.00';
    try {
        const formatted = parseFloat(formatUnits(BigInt(value), decimals));
        return new Intl.NumberFormat('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 6 
        }).format(formatted);
    } catch (error) {
        console.error("Error formatting value:", { value, decimals }, error);
        return '0.00';
    }
};

// --- Sub-components for cleaner structure ---

const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

// 3. Skeleton component for loading state
const TransactionRowSkeleton = () => (
    <li className="bg-white/5 p-4 rounded-lg flex items-center justify-between animate-pulse">
        <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-600"></div>
            <div>
                <div className="h-4 bg-gray-600 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-24"></div>
            </div>
        </div>
        <div className="text-right">
            <div className="h-4 bg-gray-600 rounded w-28 mb-2"></div>
            <div className="h-3 bg-gray-600 rounded w-20"></div>
        </div>
    </li>
);

// --- Main Component ---

interface Transaction {
  block_signed_at: string;
  from_address: string;
  to_address: string;
  value: string;
  tx_hash: string;
  successful: boolean;
}

interface TransactionHistoryProps {
    address: `0x${string}` | undefined;
}

const TransactionHistory = ({ address }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chainId = useChainId();

  const activeChain = useMemo(() => chains.find(c => c.id === chainId), [chainId]);

  useEffect(() => {
    if (!address) {
      setTransactions([]);
      return;
    }

    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      // 4. Fetch from our secure, server-side API route
      const url = `/api/transactions?address=${address}&chainId=${chainId}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch transaction history');
        }
        setTransactions(data.data.items || []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [address, chainId]);

  const renderContent = () => {
    if (!address) {
      return <p className="text-center text-gray-400 py-8">Connect wallet to see transactions.</p>;
    }
    if (isLoading) {
      // 5. Use the new skeleton loader
      return (
        <ul className="space-y-4">
            {[...Array(4)].map((_, i) => <TransactionRowSkeleton key={i} />)}
        </ul>
      );
    }
    if (error) {
      return <p className="text-center text-red-400 py-8">Error: {error}</p>;
    }
    if (transactions.length === 0) {
      return <p className="text-center text-gray-400 py-8">No transactions found on this network.</p>;
    }

    const explorerUrl = activeChain?.blockExplorers?.default.url;

    return (
      <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {transactions.map((tx) => {
          const isSender = tx.from_address.toLowerCase() === address?.toLowerCase();
          return (
            <li key={tx.tx_hash} className="bg-white/5 p-3 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                 {/* 6. Visual indicator for transaction status */}
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold ${isSender ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
                  {tx.successful ? (isSender ? '↑' : '↓') : '!'}
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {isSender ? `To: ${truncateAddress(tx.to_address)}` : `From: ${truncateAddress(tx.from_address)}`}
                  </p>
                  <p className="text-sm text-gray-400">{new Date(tx.block_signed_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold text-lg ${tx.successful ? (isSender ? 'text-red-400' : 'text-green-400') : 'text-gray-500'}`}>
                  {isSender ? '-' : '+'} {formatTxValue(tx.value, activeChain?.nativeCurrency.decimals)} {activeChain?.nativeCurrency.symbol}
                </p>
                {explorerUrl && (
                    <a href={`${explorerUrl}/tx/${tx.tx_hash}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm">
                        View Details <ExternalLinkIcon />
                    </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    // 7. Use the reusable card class
    <div className="card mt-8 w-full max-w-4xl">
      <h2 className="text-2xl font-bold text-white mb-6">Transaction History</h2>
      {renderContent()}
    </div>
  );
};

export default TransactionHistory;
