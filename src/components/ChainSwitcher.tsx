'use client'

import { useSwitchChain, useChainId } from 'wagmi'
import { useState } from 'react'
import Image from 'next/image'
import { chains } from '@/lib/wagmi';
import type { Chain } from '@wagmi/core/chains';

// Define a new type that extends the wagmi Chain type with our custom property
type ChainWithIcon = Chain & { iconUrl?: string };

// Create a new array by mapping over the original `chains` array.
// This is the correct, type-safe way to add the `iconUrl` property.
const chainsWithIcons: ChainWithIcon[] = chains.map(chain => {
    const newChain: ChainWithIcon = { ...chain }; // Create a mutable copy
    switch(chain.id) {
        case 1: newChain.iconUrl = 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'; break;
        case 8453: newChain.iconUrl = 'https://assets.coingecko.com/coins/images/34365/small/base_logo.png'; break;
        case 137: newChain.iconUrl = 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png'; break;
        case 42161: newChain.iconUrl = 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg'; break;
    }
    return newChain;
});

const ChainSwitcher = () => {
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const [isOpen, setIsOpen] = useState(false);

  const activeChain = chainsWithIcons.find((chain) => chain.id === chainId);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600"
      >
        {activeChain && activeChain.iconUrl ? (
            <div className="flex items-center">
                <Image src={activeChain.iconUrl} alt={`${activeChain.name} logo`} width={24} height={24} className="mr-2 rounded-full"/>
                <span>{activeChain.name}</span>
            </div>
        ) : (
            <span>{activeChain?.name || 'Select Network'}</span>
        )}
        <svg className={`w-5 h-5 ml-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 w-full mt-2 origin-top-right bg-gray-800 border border-gray-600 rounded-md shadow-lg z-10">
          <div className="py-1">
            {chainsWithIcons.map((chain) => (
              <button
                key={chain.id}
                onClick={() => {
                  switchChain({ chainId: chain.id })
                  setIsOpen(false)
                }}
                disabled={chainId === chain.id}
                className="flex items-center w-full px-4 py-2 text-sm text-left text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {chain.iconUrl && <Image src={chain.iconUrl} alt={`${chain.name} logo`} width={20} height={20} className="mr-3 rounded-full"/>}
                {chain.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ChainSwitcher;
