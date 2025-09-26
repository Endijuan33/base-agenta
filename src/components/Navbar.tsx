'use client'

import WalletButton from "./WalletButton";
import ChainSwitcher from "./ChainSwitcher";

const Navbar = () => {
  return (
    <header className="w-full sticky top-0 z-50">
      <nav 
        className="container mx-auto flex items-center justify-between p-4 
                   bg-dark-slate/60 backdrop-blur-lg 
                   border-b border-white/10"
      >
        {/* Logo/Branding */}
        <div className="text-2xl font-bold tracking-wider text-white">
          Base Agenta
        </div>

        {/* Wallet Controls Section */}
        <div className="flex items-center gap-4">
          <ChainSwitcher />
          <WalletButton />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
