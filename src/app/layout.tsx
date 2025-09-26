import type { Metadata } from "next";
import { Web3ModalProvider } from "@/lib/wagmi";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Modern dApp",
  description: "A modern, robust dApp with a great UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Web3ModalProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Toaster position="bottom-right" />
          </div>
        </Web3ModalProvider>
      </body>
    </html>
  );
}
