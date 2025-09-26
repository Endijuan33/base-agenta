'use client'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import * as React from 'react'
import { WagmiConfig } from 'wagmi'
// 1. Import the new chains: base and polygon
import { arbitrum, mainnet, base, polygon } from 'viem/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is not set in .env.local')
}

// 2. Create wagmiConfig
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000';

const metadata = {
  name: 'Base Agenta',
  description: 'A modern, robust dApp with a great UI',
  url: appUrl,
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// 2. Add the new chains to the array and EXPORT it
export const chains = [mainnet, base, polygon, arbitrum] as const;
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal - REMOVED redundant 'chains' property
createWeb3Modal({ wagmiConfig, projectId })

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      </QueryClientProvider>
    );
  }
