'use client'

import { useAccount } from 'wagmi';
import Navbar from '../components/Navbar';
import BalanceCard from '../components/BalanceCard';
import TokenBalances from '../components/TokenBalances';
import TransactionHistory from '../components/TransactionHistory';
import SendForm from '../components/SendForm'; // Import the new component
import { Toaster } from 'react-hot-toast';

const Home = () => {
  const { address, isConnected } = useAccount();

  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
      <Toaster />
      <Navbar />
      <div className="max-w-7xl mx-auto mt-8">
        {isConnected && address ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <BalanceCard address={address} />
            </div>
            <div className="md:col-span-2 space-y-6">
              <TokenBalances address={address} />
              <TransactionHistory address={address} />
              <SendForm /> {/* Render the component here */}
            </div>
          </div>
        ) : (
          <div className="text-center mt-20">
            <h1 className="text-3xl font-bold">Welcome to Your DeFi Dashboard</h1>
            <p className="mt-4 text-lg text-gray-400">Please connect your wallet to view your assets and activity.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
