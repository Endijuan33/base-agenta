'use client';

import { useAccount } from 'wagmi';
import BalanceCard from '../components/BalanceCard';
import TokenBalances from '../components/TokenBalances';
import TransactionHistory from '../components/TransactionHistory';
import SendForm from '../components/SendForm';
import NFTGallery from '../components/NFTGallery';
import SwapForm from '../components/SwapForm';
import DeFiPositions from '../components/DeFiPositions';

export default function Home() {
  const { address } = useAccount();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">
            Multi-Chain DeFi Dashboard
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Column: Core Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SendForm />
                <SwapForm />
            </div>
            <TokenBalances address={address} />
            <TransactionHistory address={address} />
          </div>

          {/* Right Sidebar: Summaries & Visuals */}
          <div className="space-y-6">
            {/* Pass address prop to BalanceCard */}
            <BalanceCard address={address} /> 
            <NFTGallery address={address} />
            <DeFiPositions />
          </div>

        </div>
      </div>
    </div>
  );
}
