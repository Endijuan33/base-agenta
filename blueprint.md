
# Project Blueprint

## Overview

This project is a Next.js starter application that provides a foundation for building decentralized applications (dApps) on EVM-compatible blockchains. It includes a pre-configured Web3 stack with wallet connection, account management, balance display, and transaction sending functionality. The user interface is built with Tailwind CSS and includes a set of reusable components.

## Key Features

*   **Framework:** Next.js with App Router
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Web3 Stack:**
    *   Wallet Modal: Web3Modal (WalletConnect v2)
    *   Wallet Connectors: WalletConnect v2, Injected (MetaMask), Coinbase Wallet
    *   Web3 Libraries: wagmi and viem
*   **Core Features:**
    *   Wallet Connection (Connect/Disconnect)
    *   Account Information Display (Address, Chain, Copy to Clipboard)
    *   Token Balances (Native and ERC-20)
    *   Send Native Token Functionality
    *   Network Switching
    *   Error Handling and Notifications

## Plan

1.  **Project Setup:**
    *   Create the `blueprint.md` file to document the project.
    *   Install all the required dependencies (`@web3modal/wagmi`, `wagmi`, `viem`, `react-hot-toast`).

2.  **Project Structure:**
    *   Create the necessary directories (`src/components`, `src/lib`, `src/styles`, `src/utils`).

3.  **UI Components:**
    *   Create the initial UI components (`Navbar.tsx`, `WalletButton.tsx`, `BalanceCard.tsx`, `SendForm.tsx`).

4.  **Web3 Integration:**
    *   Configure the wagmi client and connectors in `src/lib/wagmi.ts`.
    *   Add helper functions for viem in `src/lib/viem.ts`.
    *   Define the ERC-20 ABI in `src/lib/contracts.ts`.

5.  **Feature Implementation:**
    *   Implement the wallet connection flow using Web3Modal.
    *   Display the connected user's account information in the `Navbar`.
    *   Create a `BalanceCard` to display native and ERC-20 token balances.
    *   Build a `SendForm` to allow users to send native tokens.
    *   Implement network and error handling with toast notifications.

6.  **Documentation:**
    *   Create a `.env.example` file with placeholder environment variables.
    *   Update the `README.md` file with detailed instructions for setting up and running the project.
