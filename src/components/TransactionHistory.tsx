"use client";

import React, { useEffect, useState } from 'react';

// Define the structure of a transaction item based on Covalent API response
interface Transaction {
  block_signed_at: string;
  from_address: string;
  to_address: string;
  value: string;
  tx_hash: string;
  successful: boolean;
  gas_spent: string;
}

// Helper to format the native asset value
const formatValue = (value: string, decimals = 18) => {
  const numericValue = BigInt(value);
  const divisor = BigInt(10) ** BigInt(decimals);
  return (Number(numericValue) / Number(divisor)).toFixed(5);
};

// Icon for external link
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

      // Using Base Mainnet (Chain ID 8453)
      const chainId = '8453';
      const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/transactions_v3/?key=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch transactions: ${response.statusText}`);
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
  }, [address]);

  const renderContent = () => {
    if (!address) {
      return <p className="text-center text-gray-400">Please connect your wallet to view transaction history.</p>;
    }
    if (isLoading) {
      return <p className="text-center text-gray-400 animate-pulse">Loading transaction history...</p>;
    }
    if (error) {
      return <p className="text-center text-red-400">{error}</p>;
    }
    if (transactions.length === 0) {
      return <p className="text-center text-gray-400">No transactions found for this address.</p>;
    }

    return (
      <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {transactions.map((tx) => {
          const isSender = tx.from_address.toLowerCase() === address?.toLowerCase();
          return (
            <li key={tx.tx_hash} className="bg-white/5 p-4 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSender ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                  {isSender ? 'O' : 'I'}
                </div>
                <div>
                  <p className="font-semibold text-white truncate max-w-[120px] md:max-w-xs">{isSender ? `To: ${tx.to_address}` : `From: ${tx.from_address}`}</p>
                  <p className="text-sm text-gray-400">{new Date(tx.block_signed_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${isSender ? 'text-red-400' : 'text-green-400'}`}>
                  {isSender ? '-' : '+'} {formatValue(tx.value)} ETH
                </p>
                <a href={`https://basescan.org/tx/${tx.tx_hash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
                  View on Basescan <ExternalLinkIcon />
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="mt-12 w-full max-w-4xl bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Transaction History</h2>
      {renderContent()}
    </div>
  );
};

export default TransactionHistory;
