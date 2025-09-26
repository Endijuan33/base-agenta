'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useChainId } from 'wagmi';
import { chains } from '@/lib/wagmi'; // Import chains from your wagmi config

// Define the structure of a transaction item based on Covalent API response
interface Transaction {
  block_signed_at: string;
  from_address: string;
  to_address: string;
  value: string;
  tx_hash: string;
  successful: boolean;
}

// Helper to format the native asset value
const formatValue = (value: string, decimals = 18) => {
    if (!value) return '0.00';
    try {
        const numericValue = BigInt(value);
        const divisor = BigInt(10) ** BigInt(decimals);
        const result = Number(numericValue * 100000n / divisor) / 100000;
        return result.toFixed(5);
    } catch (error) {
        console.error("Error formatting value:", { value, decimals }, error);
        return '0.00';
    }
};

// Map chain IDs to Covalent chain names
const getCovalentChainName = (chainId: number): string => {
    switch (chainId) {
        case 1: return 'eth-mainnet';
        case 8453: return 'base-mainnet';
        case 137: return 'polygon-mainnet';
        case 42161: return 'arbitrum-mainnet';
        default: return 'eth-mainnet';
    }
};

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

interface TransactionHistoryProps {
    address: `0x${string}` | undefined;
}

const TransactionHistory = ({ address }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chainId = useChainId();

  // Get the current chain's details from the wagmi config
  const activeChain = useMemo(() => chains.find(c => c.id === chainId), [chainId]);

  useEffect(() => {
    if (!address) {
      setTransactions([]);
      return;
    }

    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);

      const apiKey = process.env.NEXT_PUBLIC_COVALENT_API_KEY;
      if (!apiKey) {
        setError("Covalent API key is not configured.");
        setIsLoading(false);
        return;
      }

      const covalentChainName = getCovalentChainName(chainId);
      const url = `https://api.covalenthq.com/v1/${covalentChainName}/address/${address}/transactions_v3/?key=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error_message || `Failed to fetch transactions`);
        }
        const data = await response.json();
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
      return <p className="text-center text-gray-400">Please connect your wallet to view transaction history.</p>;
    }
    if (isLoading) {
      return <p className="text-center text-gray-400 animate-pulse">Loading transaction history...</p>;
    }
    if (error) {
      return <p className="text-center text-red-400">Error: {error}</p>;
    }
    if (transactions.length === 0) {
      return <p className="text-center text-gray-400">No transactions found on this network.</p>;
    }

    const explorerUrl = activeChain?.blockExplorers?.default.url;

    return (
      <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {transactions.map((tx) => {
          const isSender = tx.from_address.toLowerCase() === address?.toLowerCase();
          return (
            <li key={tx.tx_hash} className="bg-white/5 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-white/10 transition-colors duration-200">
              <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isSender ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                  {isSender ? '↑' : '↓'}
                </div>
                <div className='flex-grow'>
                  <p className="font-semibold text-white truncate max-w-[150px] md:max-w-xs" title={isSender ? tx.to_address : tx.from_address}>
                    {isSender ? `To: ${tx.to_address}` : `From: ${tx.from_address}`}
                  </p>
                  <p className="text-sm text-gray-400">{new Date(tx.block_signed_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right self-end sm:self-center">
                <p className={`font-bold text-lg ${isSender ? 'text-red-400' : 'text-green-400'}`}>
                  {isSender ? '-' : '+'} {formatValue(tx.value, activeChain?.nativeCurrency.decimals)} {activeChain?.nativeCurrency.symbol}
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
    <div className="mt-8 w-full max-w-4xl bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Transaction History</h2>
      {renderContent()}
    </div>
  );
};

export default TransactionHistory;
