# Base Agenta

This is a starter project for building decentralized applications (dApps) with Next.js, TypeScript, and a complete Web3 stack.

## Features

- **Next.js App Router:** The latest Next.js features for building modern web applications.
- **TypeScript:** Type safety for a more robust codebase.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Web3Modal:** A simple and intuitive wallet connection modal.
- **wagmi & viem:** Powerful React hooks and utilities for interacting with Ethereum.
- **Reusable Components:** A set of pre-built components for token balances, transfers, and swaps.

## Getting Started

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Set Up Environment Variables:**

    Copy the `.env.example` file to `.env.local` and fill in the required values:

    ```bash
    cp .env.example .env.local
    ```

    - `NEXT_PUBLIC_PROJECT_ID`: Your WalletConnect project ID. You can get one from [WalletConnect Cloud](https://cloud.walletconnect.com/).
    - `ZAPPER_API_KEY`: Your API key for the Zapper API. You can request one from Zapper's developer portal.

3.  **Run the Development Server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase for errors.
