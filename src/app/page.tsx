'use client';

import { useAccount } from 'wagmi';
import BalanceCard from '../components/BalanceCard';
import SwapForm from '../components/SwapForm';

export default function Home() {
  const { address } = useAccount();

  return (
    <div className="flex flex-col items-center w-full">

      {/* 1. Hero Section */}
      <div className="text-center mb-12 md:mb-16">
        <h1 
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text 
                     bg-gradient-to-tr from-vibrant-purple to-blue-400 mb-4 animate-[fade-in-down_1s_ease-out]"
        >
          DeFi Command Center
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 animate-[fade-in-up_1s_ease-out_0.5s]">
          Seamlessly swap assets, track your portfolio, and navigate the multi-chain world with unparalleled speed and style.
        </p>
      </div>

      {/* 2. Main Dashboard Layout (Two-column) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-8 xl:gap-12">

        {/* Left/Main Column */}
        <div className="lg:col-span-3 w-full animate-[fade-in-left_1s_ease-out_1s]">
          <SwapForm />
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-2 w-full space-y-8 animate-[fade-in-right_1s_ease-out_1.2s]">
          <BalanceCard address={address} />
          {/* 
            Future components like TokenBalances or NFTGallery can be added here.
            Keeping it clean for now to highlight the main features.
          */}
        </div>

      </div>
    </div>
  );
}
