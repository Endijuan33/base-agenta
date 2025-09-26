'use client'

import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'
import { toast } from 'react-hot-toast'
import { Copy, LogOut } from 'lucide-react'; // Using lucide-react for sleek icons

const WalletButton = () => {
  const { open } = useWeb3Modal()
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()

  const handleConnect = () => {
    open()
  }

  const handleDisconnect = () => {
    disconnect()
    toast.success('Disconnected successfully!')
  }

  const handleCopyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success('Address copied to clipboard!')
    }
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        {/* Address Display - Styled as a mini 'lifted' card */}
        <div 
          className="card flex items-center gap-3 px-4 py-2 cursor-pointer transition-all duration-300 hover:border-vibrant-purple/50"
          onClick={handleCopyToClipboard}
        >
          <div>
            <p className="font-semibold text-white">{`${address.slice(0, 6)}...${address.slice(-4)}`}</p>
            <p className="text-xs text-gray-400 font-medium">{chain?.name || 'Unknown Network'}</p>
          </div>
          <Copy className="h-4 w-4 text-gray-400" />
        </div>

        {/* Disconnect Button - Styled as a subtle ghost button */}
        <button
          onClick={handleDisconnect}
          className="flex items-center justify-center h-10 w-10 bg-transparent border border-red-500/50 text-red-500 rounded-full transition-colors duration-300 hover:bg-red-500/10 hover:border-red-500"
          aria-label="Disconnect Wallet"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    )
  }

  return (
    // The main CTA button with the new "glow" effect
    <button
      onClick={handleConnect}
      className="px-8 py-3 bg-vibrant-purple text-white font-bold rounded-xl shadow-purple-glow transition-all duration-300 transform hover:brightness-110 hover:shadow-purple-glow-soft animate-glow"
    >
      Connect Wallet
    </button>
  )
}

export default WalletButton
