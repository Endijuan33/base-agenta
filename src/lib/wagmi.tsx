'use client'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import * as React from 'react'
import { WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, base, polygon } from 'viem/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Chain } from 'viem/chains';

// Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is not set in .env.local')
}

// 2. Create wagmiConfig
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000';

// Updated metadata to be consistent
const metadata = {
  name: 'Base Agenta',
  description: 'Seamlessly manage, swap, and send crypto assets with the Base Agenta multi-chain dashboard.',
  url: appUrl,
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Define a type that includes our custom icon property
export type ChainWithIcon = Chain & { iconUrl: string };

// Add iconUrl to each chain and export it for unified access
export const chains: readonly [ChainWithIcon, ...ChainWithIcon[]] = [
  { ...mainnet, iconUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { ...base, iconUrl: 'https://assets.coingecko.com/coins/images/34365/small/base_logo.png' },
  { ...polygon, iconUrl: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png' },
  { ...arbitrum, iconUrl: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg' },
];

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId })

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      </QueryClientProvider>
    );
  }
