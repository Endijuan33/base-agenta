'use client'

import WalletButton from "./WalletButton";
import ChainSwitcher from "./ChainSwitcher"; // 1. Import the new component

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-transparent text-white">
      <div className="text-2xl font-bold">
        Base Agenta
      </div>
      {/* 2. Group wallet-related controls together */}
      <div className="flex items-center space-x-4">
        <ChainSwitcher />
        <WalletButton />
      </div>
    </nav>
  );
};

export default Navbar;
