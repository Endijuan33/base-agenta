
# Project Blueprint

## Overview

This project is a Next.js starter application that provides a foundation for building decentralized applications (dApps) on EVM-compatible blockchains. It includes a pre-configured Web3 stack with wallet connection, account management, balance display, and transaction sending functionality. The user interface is built with Tailwind CSS and includes a set of reusable components.

## Phase 1: Initial Setup & Configuration Fix

*   **Initial Setup:**
    *   Created the initial project structure, installed dependencies (`@web3modal/wagmi`, `wagmi`, `viem`, `react-hot-toast`), and set up basic components.
*   **Configuration Fix:**
    *   **Problem:** The project had a hardcoded, invalid `projectId`, causing connection failures.
    *   **Solution:** Refactored `wagmi.ts` to use an environment variable (`NEXT_PUBLIC_PROJECT_ID`), created a `.env.local` file, and fixed a JSX parsing error by renaming the file to `wagmi.tsx`.

## Phase 2: UI/UX & Robustness Overhaul

*   **Objective:** Transform the basic application into a modern, visually appealing, and robust dApp with a superior user experience.
*   **Global Design System (`globals.css`):**
    *   **Modern Palette:** Implemented a professional dark-mode color scheme with vibrant accents.
    *   **Enhanced Typography:** Integrated the 'Poppins' font from Google Fonts for better readability.
    *   **Visual Depth:** Added a subtle gradient background.
*   **Layout & Structure (`layout.tsx`, `page.tsx`):**
    *   **Robust Layout:** Re-architected the main layout using Flexbox for responsive centering.
    *   **Global Notifications:** Integrated `react-hot-toast` at the root level for app-wide feedback.
    *   **Dashboard UI:** Redesigned the main page into a clean, organized dashboard layout.
*   **Component Redesign (Robust & Modern):**
    *   **`Navbar.tsx`:** Streamlined into a clean header with a clear app title and wallet button.
    *   **`WalletButton.tsx`:** Evolved into a smart status indicator, showing connection state, a truncated address, and a one-click copy-to-clipboard feature.
    *   **`BalanceCard.tsx`:** Rebuilt as a modern "card" component. Crucially, it now features a **loading skeleton** while fetching data and handles the "disconnected" state gracefully.
    *   **`SendForm.tsx`:** Overhauled the form for better aesthetics and usability. It now provides **real-time transactional feedback**, disabling the button and showing a spinner during submission, and firing toast notifications on success or failure.

## Phase 3: Build & Dependency Debugging

*   **Objective:** Resolve a series of build errors to achieve a successful production build.
*   **Key Fixes:**
    *   **Polyfill Installation:** Installed `buffer` and `process` as development dependencies to address browser-environment API shortages during the build process.
    *   **TypeScript Upgrade & Configuration:** Upgraded the TypeScript version and updated `tsconfig.json` to align with modern standards and fix type-related build failures.
    *   **Web3 Library API Updates:** Refactored the `wagmi.tsx` configuration to align with the latest API changes in `wagmi` and `@web3modal/wagmi`, including:
        *   Using `as const` for chain definitions.
        *   Removing the deprecated `chains` prop from `createWeb3Modal`.
    *   **Next.js Architecture Fixes:**
        *   **`"use client"` Directive:** Added the `"use client"` directive to `wagmi.tsx` to correctly designate it as a Client Component module, resolving a server-side rendering loop (`Maximum call stack size exceeded`).
        *   **`QueryClientProvider`:** Wrapped the application in a `QueryClientProvider` to provide the necessary context for `wagmi`'s underlying data-fetching library (TanStack Query), fixing the `No QueryClient set` error.
    *   **Type Safety:** Added an explicit `React.ReactNode` type to the `children` prop in `Web3ModalProvider` to satisfy strict TypeScript rules.

## Key Features (Post-Overhaul)

*   **Framework:** Next.js with App Router
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (with a custom modern design system)
*   **Web3 Stack:** Web3Modal, wagmi, viem
*   **Core Features:**
    *   Modern, responsive, dark-mode UI.
    *   Robust wallet connection with clear status display.
    *   Balance display with explicit loading states.
    *   Token sending with clear loading and success/error feedback.
    *   Global, non-intrusive notifications.
