import BalanceCard from "@/components/BalanceCard";
import Navbar from "@/components/Navbar";
import SendForm from "@/components/SendForm";
import TokenBalances from "@/components/TokenBalances";
import TransactionHistory from "@/components/TransactionHistory";

export default function Home() {
  return (
    <div className="space-y-12">
      <Navbar />
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Modern Web3 dApp</h1>
        <p className="mt-4 text-lg leading-8 text-gray-300">Your new home for decentralized finance.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-white">Account Balance</h2>
          <BalanceCard />
        </div>
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-white">Send Funds</h2>
          <SendForm />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <TransactionHistory />
        <TokenBalances />
      </div>
    </div>
  );
}
