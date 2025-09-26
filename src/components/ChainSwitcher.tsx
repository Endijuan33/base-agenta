'use client'

import { useSwitchChain, useChainId } from 'wagmi'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { chains } from '@/lib/wagmi';
import { toast } from 'react-hot-toast';
import { Check, ChevronDown } from 'lucide-react';

const ChainSwitcher = () => {
  const { switchChain, isPending, error } = useSwitchChain();
  const chainId = useChainId();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeChain = chains.find((chain) => chain.id === chainId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main button styled as a mini 'lifted' card */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="card flex items-center justify-between w-full min-w-[180px] px-4 py-2 text-white font-semibold transition-all duration-300 hover:border-vibrant-purple/50 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Switching...</span>
          </div>
        ) : activeChain && activeChain.iconUrl ? (
          <div className="flex items-center gap-2">
            <Image src={activeChain.iconUrl} alt={`${activeChain.name} logo`} width={24} height={24} className="rounded-full bg-white/10"/>
            <span>{activeChain.name}</span>
          </div>
        ) : (
          <span>{activeChain?.name || 'Select Network'}</span>
        )}
        <ChevronDown className={`w-5 h-5 ml-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu - also styled as a lifted card */}
      {isOpen && (
        <div className="card absolute right-0 w-full mt-2 origin-top-right z-10 p-2">
          <div className="flex flex-col gap-1">
            {chains.map((chain) => (
              <button
                key={chain.id}
                onClick={() => {
                  if (chain.id !== chainId) {
                    switchChain({ chainId: chain.id });
                  }
                  setIsOpen(false);
                }}
                disabled={chainId === chain.id}
                className="flex items-center w-full px-3 py-2 text-sm text-left text-white rounded-md transition-colors hover:bg-white/5 disabled:bg-vibrant-purple/20 disabled:cursor-not-allowed"
              >
                <Image src={chain.iconUrl} alt={`${chain.name} logo`} width={20} height={20} className="mr-3 rounded-full bg-white/10"/>
                <span className="flex-grow">{chain.name}</span>
                {chainId === chain.id && <Check className="h-4 w-4 text-vibrant-purple"/>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ChainSwitcher;
