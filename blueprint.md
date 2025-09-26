# **Project Blueprint: The Multi-Chain DeFi Dashboard**

This document serves as the single source of truth for the project's architecture, features, and future development roadmap. Its purpose is to facilitate efficient management and future development.

---

## **1. Project Overview & Core Purpose**

This is a full-fledged Web3 dApp (decentralized application) built with a modern tech stack. It serves as a multi-chain decentralized finance (DeFi) dashboard.

**Core user capabilities:**
- Connect a Web3 wallet (e.g., MetaMask).
- View asset balances (native and ERC-20 tokens) across multiple supported chains.
- View a gallery of owned NFTs.
- Send native assets and ERC-20 tokens to other addresses.
- Swap tokens using a DEX aggregator for the best prices.

The application prioritizes a clean, responsive, and intuitive user interface to provide a clear and organized overview of a user's digital assets and actions.

---

## **2. Architecture & Core Technologies**

This section details the foundational technologies and the structural design of the application.

### **Technology Stack**
- **Framework:** Next.js 14 (with App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Web3 Connectivity:** `wagmi` & `viem`
- **External Data APIs:**
  - **Covalent:** For token balances, transaction history, and NFT data.
  - **0x API:** For DEX aggregation to find the best swap prices.

### **Project Structure (`/src` directory)**
- **`/app`**: Handles page routing and global layout.
- **`/components`**: Contains all reusable React components.
- **`/lib`**: Houses core logic, configurations (like ABIs), and client initializations.

---

## **3. Detailed Feature & Component Breakdown**

This section documents each key component and its specific role in the application.

### **Core Infrastructure & Connectivity**
- **`WalletButton.tsx`**: Manages the user's wallet connection state.
- **`Navbar.tsx`**: The top navigation bar of the application.

### **Data Display Components**
- **`BalanceCard.tsx`**: Displays the user's balance of the native network asset.
- **`TokenBalances.tsx`**: Fetches and displays a list of all ERC-20 tokens a user owns.
- **`TransactionHistory.tsx`**: Fetches and displays a list of recent transactions.
- **`NFTGallery.tsx`**: Fetches and displays a user's NFT portfolio from the Covalent API.

### **User Interaction Components**
- **`SendForm.tsx`**: Provides a form for users to send native assets (ETH) and ERC-20 tokens. It integrates `wagmi`'s `useSendTransaction` and `useWriteContract` hooks.
- **`SwapForm.tsx`**: **(Phase 2 Complete)** Provides a full-featured token swap interface. It uses the **0x API** to fetch quotes and handles the entire transaction lifecycle, including ERC-20 `approve` checks and execution, by leveraging `wagmi` hooks.

---

## **4. Future Development Roadmap**

This section outlines a clear, phased plan for introducing new features and enhancements.

### **Phase 3: Achieve Full Portfolio Insight**
- **Goal:** Build a comprehensive DeFi Positions Dashboard.
- **Tasks:**
  1. Integrate a specialized DeFi data API (e.g., Zapper, Zerion).
  2. Fetch and display a user's positions across various protocols (e.g., staked assets, liquidity pools, lending positions).
  3. Organize this data into an intuitive UI that provides a true net worth overview.
