import WalletButton from "./WalletButton";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-transparent">
      <div className="text-2xl font-bold text-white">dApp</div>
      <WalletButton />
    </nav>
  );
};

export default Navbar;
