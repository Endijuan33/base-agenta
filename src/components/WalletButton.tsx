'use client'

import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'
import { toast } from 'react-hot-toast'

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
      <div className="flex items-center gap-4">
        <div 
          className="bg-[rgba(var(--card-background),0.7)] border border-[rgba(var(--card-border),0.7)] backdrop-blur-sm rounded-lg px-4 py-2 text-white font-semibold cursor-pointer hover:border-blue-500 transition-colors"
          onClick={handleCopyToClipboard}
        >
          <p>{`${address.slice(0, 6)}...${address.slice(-4)}`}</p>
          <p className="text-xs text-gray-400">{chain?.name}</p>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
    >
      Connect Wallet
    </button>
  )
}

export default WalletButton
