# **Project Blueprint: The Multi-Chain DeFi Dashboard**

This document serves as the single source of truth for the project's architecture, features, and future development roadmap. Its purpose is to facilitate efficient management and future development.

---

## **1. Project Overview & Core Purpose**

This is a full-fledged Web3 dApp (decentralized application) built with a modern tech stack. It serves as a multi-chain decentralized finance (DeFi) dashboard.

**Core user capabilities:**
- Connect a Web3 wallet (e.g., MetaMask).
- View asset balances (native and ERC-20 tokens).
- View a gallery of owned NFTs.
- View a comprehensive breakdown of DeFi positions (staking, liquidity pools).
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
  - **Zapper API:** For fetching and displaying complex DeFi positions.

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
- **`DeFiPositions.tsx`**: **(Phase 3 Complete)** Fetches and displays a user's complex DeFi positions (e.g., staking, liquidity pools) from the Zapper API, providing a true net worth overview.

### **User Interaction Components**
- **`SendForm.tsx`**: Provides a form for users to send native assets (ETH) and ERC-20 tokens.
- **`SwapForm.tsx`**: Provides a full-featured token swap interface using the 0x API.

---

## **4. Future Development Roadmap**

This section outlines a clear, phased plan for introducing new features and enhancements.

### **Phase 3: Achieve Full Portfolio Insight (Completed)**
- **Goal:** Build a comprehensive DeFi Positions Dashboard.
- **Status:** **Done.** Integrated the Zapper API to provide users with a detailed view of their staked assets and liquidity pool positions.

### **Phase 4: Multi-Chain Integration & Enhanced UX**
- **Goal:** Evolve from a Base-centric to a true multi-chain dashboard and refine the user experience.
- **Key Tasks:**
  1.  **Chain Switcher UI:** Implement a seamless UI for users to switch between different supported networks (e.g., Ethereum Mainnet, Polygon, Arbitrum).
  2.  **Abstract API Calls:** Refactor all API-calling components (`TokenBalances`, `NFTGallery`, `DeFiPositions`, etc.) to be chain-aware. When the user switches networks, these components must re-fetch data for the newly selected chain.
  3.  **Notification System:** Add a real-time notification system (e.g., using toast messages) to give users feedback on their actions (e.g., "Transaction Submitted," "Swap Successful," "API Error").
  4.  **Advanced UI Polish:** Conduct a full review of the UI/UX, adding more sophisticated animations, loading states, and responsive design improvements to further enhance the professional feel of the application.
