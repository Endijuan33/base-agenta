# **Project Blueprint: The Multi-Chain DeFi Dashboard**

This document serves as the single source of truth for the project's architecture, features, and future development roadmap. Its purpose is to facilitate efficient management and future development.

---

## **1. Project Overview & Core Purpose**

This is a full-fledged Web3 dApp (decentralized application) built with a modern tech stack. It serves as a multi-chain decentralized finance (DeFi) dashboard.

**Core user capabilities:**
- Connect a Web3 wallet (e.g., MetaMask).
- View asset balances (native and ERC-20 tokens) across multiple supported chains.
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
  - `layout.tsx`: The root layout. Initializes the `WagmiProvider` to make Web3 context available throughout the app.
  - `page.tsx`: The main entry point and homepage of the application. It composes all the primary UI components (`Navbar`, `BalanceCard`, `TokenBalances`, etc.).
- **`/components`**: Contains all reusable React components, the building blocks of the UI.
- **`/lib`**: Houses core logic, configurations, and client initializations.
  - `wagmi.tsx`: **Crucial file**. Contains the `wagmi` configuration (`createConfig`), defining supported blockchains (e.g., Base, Mainnet) and wallet connectors.

---

## **3. Detailed Feature & Component Breakdown**

This section documents each key component and its specific role in the application.

### **Core Infrastructure & Connectivity**
- **`WalletButton.tsx`**: Manages the user's wallet connection state. It displays a "Connect Wallet" button and, once connected, shows the user's address and a "Disconnect" option. It is the primary entry point for any user interaction with the blockchain.
- **`Navbar.tsx`**: The top navigation bar of the application. It provides consistent branding and houses the `WalletButton`.

### **Data Display Components**
- **`BalanceCard.tsx`**: A simple UI card dedicated to displaying the user's balance of the native network asset (e.g., ETH on Base or Ethereum). It fetches this data directly via `wagmi` hooks.
- **`TokenBalances.tsx`**: A key data-heavy component. 
  - **Function:** It fetches and displays a list of all ERC-20 (and other) tokens a user owns on the selected blockchain.
  - **Data Source:** It relies on the **Covalent API's `balances_v2` endpoint**.
  - **Details Displayed:** Shows token logo, name, symbol, formatted balance, and its current USD value.
- **`TransactionHistory.tsx`**:
  - **Function:** Fetches and displays a list of recent transactions for the connected wallet address.
  - **Data Source:** It also uses the **Covalent API's `transactions_v3` endpoint**.
  - **Details Displayed:** Shows transaction type (send/receive), destination/source address, timestamp, and provides a direct link to a block explorer (e.g., Basescan, Etherscan).

### **User Interaction Components**
- **`SendForm.tsx`**:
  - **Current Status:** Exists as a placeholder component.
  - **Intended Function:** To provide a form for users to send native assets and ERC-20 tokens to another address. This is currently an unimplemented feature.

---

## **4. Future Development Roadmap**

This section outlines a clear, phased plan for introducing new features and enhancements.

### **Phase 1: Activate Core 'Write' Functionality**
- **Goal:** Implement the `SendForm.tsx` component.
- **Tasks:**
  1. Build the UI form with inputs for recipient address, amount, and a token selector.
  2. Integrate `wagmi`'s `useSendTransaction` hook for sending native assets (ETH, MATIC).
  3. Integrate `wagmi`'s `useWriteContract` hook for sending ERC-20 tokens.

### **Phase 2: Expand Asset Coverage with NFTs**
- **Goal:** Create an NFT Portfolio Gallery.
- **Tasks:**
  1. Update the Covalent API call in a new or existing component to include the `nft=true` parameter.
  2. Design and build a visually appealing gallery component to display NFT images, names, and collections.
  3. Provide links to popular NFT marketplaces like OpenSea for each asset.

### **Phase 3: Introduce Advanced DeFi Actions**
- **Goal:** Integrate a token swap/exchange feature.
- **Tasks:**
  1. Research and select a DEX aggregator API (e.g., 0x, 1inch).
  2. Build a swap interface where users can select input and output tokens.
  3. Integrate the chosen API to fetch quotes and transaction data.
  4. Use `wagmi` hooks to prompt the user to sign and send the swap transaction.

### **Phase 4: Achieve Full Portfolio Insight**
- **Goal:** Build a comprehensive DeFi Positions Dashboard.
- **Tasks:**
  1. Integrate a specialized DeFi data API (e.g., Zapper, Zerion).
  2. Fetch and display a user's positions across various protocols (e.g., staked assets, liquidity pools, lending positions).
  3. Organize this data into an intuitive UI that provides a true net worth overview.
