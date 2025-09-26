# **Project Blueprint: The Multi-Chain DeFi Dashboard**

This document serves as the single source of truth for the project's architecture, features, and future development roadmap. Its purpose is to facilitate efficient management and future development.

---

## **1. Project Overview & Core Purpose**

This is a full-fledged Web3 dApp (decentralized application) built with a modern tech stack. It serves as a multi-chain decentralized finance (DeFi) dashboard.

**Core user capabilities:**
- Connect a Web3 wallet (e.g., MetaMask).
- View asset balances (native and ERC-20 tokens) across multiple supported chains.
- Send native assets and ERC-20 tokens to other addresses.
- View transaction history for the connected wallet on the selected chain.

The application prioritizes a clean, responsive, and intuitive user interface to provide a clear and organized overview of a user's digital assets.

---

## **2. Architecture & Core Technologies**

This section details the foundational technologies and the structural design of the application.

### **Technology Stack**
- **Framework:** Next.js 14 (with App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Web3 Connectivity:** `wagmi` & `viem`
- **External Data:** Covalent API (for token balances and transaction history)

### **Project Structure (`/src` directory)**
- **`/app`**: Handles page routing and global layout.
- **`/components`**: Contains all reusable React components.
- **`/lib`**: Houses core logic, configurations, and client initializations.

---

## **3. Detailed Feature & Component Breakdown**

This section documents each key component and its specific role in the application.

### **Core Infrastructure & Connectivity**
- **`WalletButton.tsx`**: Manages the user's wallet connection state.
- **`Navbar.tsx`**: The top navigation bar of the application.

### **Data Display Components**
- **`BalanceCard.tsx`**: Displays the user's balance of the native network asset.
- **`TokenBalances.tsx`**: Fetches and displays a list of all ERC-20 tokens a user owns using the Covalent API.
- **`TransactionHistory.tsx`**: Fetches and displays a list of recent transactions using the Covalent API.

### **User Interaction Components**
- **`SendForm.tsx`**: Provides a fully functional form for users to send native assets (ETH) and ERC-20 tokens. It integrates `wagmi`'s `useSendTransaction` and `useWriteContract` hooks to perform the transactions.

---

## **4. Future Development Roadmap**

This section outlines a clear, phased plan for introducing new features and enhancements.

### **Phase 1: Expand Asset Coverage with NFTs**
- **Goal:** Create an NFT Portfolio Gallery.
- **Tasks:**
  1. Update the Covalent API call in a new or existing component to include the `nft=true` parameter.
  2. Design and build a visually appealing gallery component to display NFT images, names, and collections.
  3. Provide links to popular NFT marketplaces like OpenSea for each asset.

### **Phase 2: Introduce Advanced DeFi Actions**
- **Goal:** Integrate a token swap/exchange feature.
- **Tasks:**
  1. Research and select a DEX aggregator API (e.g., 0x, 1inch).
  2. Build a swap interface where users can select input and output tokens.
  3. Integrate the chosen API to fetch quotes and transaction data.
  4. Use `wagmi` hooks to prompt the user to sign and send the swap transaction.

### **Phase 3: Achieve Full Portfolio Insight**
- **Goal:** Build a comprehensive DeFi Positions Dashboard.
- **Tasks:**
  1. Integrate a specialized DeFi data API (e.g., Zapper, Zerion).
  2. Fetch and display a user's positions across various protocols (e.g., staked assets, liquidity pools, lending positions).
  3. Organize this data into an intuitive UI that provides a true net worth overview.
