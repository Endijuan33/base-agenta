'use client'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import * as React from 'react'
import { WagmiConfig } from 'wagmi'
import { arbitrum, mainnet } from 'viem/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is not set in .env.local')
}

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum] as const;
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
