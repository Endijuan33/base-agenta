# Blueprint: Base Agenta

## Overview

This document outlines the architecture, features, and design of "Base Agenta". The application provides a seamless and intuitive interface for common cryptocurrency operations, including viewing token balances, sending tokens, and swapping tokens on various EVM-compatible chains.

## Core Features

- **Multi-Chain Connectivity:** Connects to multiple blockchains (Mainnet, Base, Polygon, Arbitrum) using WalletConnect and wagmi.
- **Token Balance Display:** Fetches and displays the user's token balances from the Zapper API.
- **Token Transfers:** Allows users to send any ERC20 token to another address.
- **Token Swaps:** Integrates with the 0x Protocol API to provide token swap functionality with price quoting.
- **Modern, Responsive UI:** Built with Next.js and Tailwind CSS for a clean, responsive, and user-friendly experience.
- **Real-time Notifications:** Uses `react-hot-toast` to provide instant feedback for all user actions (e.g., transactions, approvals, errors).

## Design and Styling

- **Theme:** Dark mode aesthetic with a blurred, glass-like effect (`backdrop-blur-sm`) on form containers for a modern look.
- **Color Palette:**
  - **Primary Action:** Indigo (`bg-indigo-600`, `hover:bg-indigo-700`)
  - **Background:** Dark gray/black gradients (`bg-gray-800`, `bg-black/20`)
  - **Text:** White and light grays (`text-white`, `text-gray-300`)
  - **Borders & Accents:** Subtle white/gray borders (`border-white/20`, `border-gray-600`)
- **Typography:** Uses system default fonts. Text sizes are scaled for readability, with larger fonts for input fields (`text-3xl`) and prominent headers (`text-2xl`).
- **Components:**
  - **Buttons:** Rounded corners, clear hover and disabled states.
  - **Forms:** Clean, well-spaced layouts within rounded, semi-transparent containers.
  - **Modals & Dropdowns:** Consistent dark-theme styling for all interactive elements, including the chain switcher and token selectors.
- **Iconography:** Uses token logos from CoinGecko and custom SVG icons for UI elements.

## Project Structure (App Router)

- `/src/app/page.tsx`: The main entry point and layout for the application.
- `/src/app/api/zapper/route.ts`: API route to fetch token balances from the Zapper API.
- `/src/components/`: Contains all reusable React components:
  - `ChainSwitcher.tsx`: Dropdown for selecting the active blockchain.
  - `ConnectButton.tsx`: The primary button for wallet connection.
  - `SendForm.tsx`: Form for sending ERC20 tokens.
  - `SwapForm.tsx`: Form for swapping tokens via 0x API.
  - `TokenBalances.tsx`: Component to display a list of token balances.
- `/src/lib/`: Contains core configuration and utility files:
  - `erc20Abi.ts`: The standard ABI for ERC20 token interactions.
  - `wagmi.tsx`: Configuration for wagmi and Web3Modal.
- `next.config.ts`: Next.js configuration, including image domain whitelisting.
- `tsconfig.json`: TypeScript configuration, set to target `ES2020` to support modern JavaScript features like BigInt literals.

## Current Plan & Steps (Completed)

This section outlines the steps taken to implement the latest set of features and fixes.

**1. Add New Functionality:**
   - **Token Balances:** Created `TokenBalances.tsx` and a supporting API route (`/api/zapper`) to fetch and display token holdings.
   - **Send Tokens:** Implemented `SendForm.tsx` with logic to handle ERC20 transfers using wagmi hooks.
   - **Swap Tokens:** Developed `SwapForm.tsx`, which integrates with the 0x API for price quotes and trade execution.

**2. Fix Build & Linting Issues:**
   - **Resolved Fatal Type Errors:** Corrected `any` type errors in `SendForm.tsx` and `SwapForm.tsx` by providing explicit types for error objects.
   - **Fixed `ChainSwitcher.tsx`:**
     - Replaced `<img>` tags with Next.js `<Image>` components for optimized image loading.
     - Resolved TypeScript errors by creating a new, correctly typed `chainsWithIcons` array instead of mutating the `readonly` array from wagmi.
     - Removed unused `useEffect` and `createIconUrl` function.
   - **Configured `next.config.ts`:** Added necessary `images.remotePatterns` to allow loading token icons from `assets.coingecko.com`.
   - **Cleaned up `SwapForm.tsx`:**
     - Added a `console.error` to handle the unused `error` variable in a `try...catch` block.
     - Suppressed the `react-hooks/exhaustive-deps` warning for the debounced `fetchQuote` function, as it was a false positive.
   - **Updated `tsconfig.json`:** Changed the `target` from `ES2017` to `ES2020` to enable support for BigInt literals (`100000n`).
   - **Corrected `wagmi.tsx`:** Removed the redundant `chains` property from the `createWeb3Modal` function call.

**3. Final Verification:**
   - Ran `npm run build` multiple times, fixing successive build-time errors until the build completed successfully with no errors or warnings.
