"use client";

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import Image from 'next/image';

// Define the structure of a token balance item
interface TokenBalance {
  logo_url: string;
  contract_name: string;
  contract_ticker_symbol: string;
  balance: string;
  quote: number;
  contract_decimals: number;
}

// Helper to format balance
const formatBalance = (balance: string, decimals: number) => {
  const numericValue = BigInt(balance);
  const divisor = BigInt(10) ** BigInt(decimals);
  const result = Number(numericValue) / Number(divisor);
  return result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 5 });
};

const TokenBalances = () => {
  const { address, isConnected } = useAccount();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      setBalances([]);
      return;
    }

    const fetchBalances = async () => {
      setIsLoading(true);
      setError(null);

      const apiKey = process.env.NEXT_PUBLIC_COVALENT_API_KEY;
      if (!apiKey) {
        setError("Covalent API key is not configured.");
        setIsLoading(false);
        return;
      }

      const chainId = '8453'; // Base Mainnet
      const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?key=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch balances: ${response.statusText}`);
        }
        const data = await response.json();
        setBalances(data.data.items || []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, [address, isConnected]);

  const renderContent = () => {
    if (!isConnected) {
      return <p className="text-center text-gray-400">Please connect your wallet to view token balances.</p>;
    }
    if (isLoading) {
      return <p className="text-center text-gray-400 animate-pulse">Loading token balances...</p>;
    }
    if (error) {
      return <p className="text-center text-red-400">{error}</p>;
    }
    if (balances.length === 0) {
      return <p className="text-center text-gray-400">No token balances found for this address.</p>;
    }

    return (
      <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {balances.map((token) => (
          <li key={token.contract_ticker_symbol} className="bg-white/5 p-4 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors duration-200">
            <div className="flex items-center space-x-4">
              <Image src={token.logo_url} alt={`${token.contract_name} logo`} width={40} height={40} className="rounded-full bg-white" />
              <div>
                <p className="font-bold text-white">{token.contract_name}</p>
                <p className="text-sm text-gray-400">{token.contract_ticker_symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">{formatBalance(token.balance, token.contract_decimals)}</p>
              <p className="text-sm text-green-400">${token.quote.toFixed(2)}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full max-w-4xl bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Token Balances</h2>
      {renderContent()}
    </div>
  );
};

export default TokenBalances;
