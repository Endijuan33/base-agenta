import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Web3ModalProvider } from '@/lib/wagmi';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter', // Assign it to a CSS variable
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Base Agenta - Your Premier DeFi Hub',
  description: 'Seamlessly manage, swap, and send crypto assets with the Base Agenta multi-chain dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Web3ModalProvider>
            {/* The main container for the entire app */}
            <div className="min-h-screen w-full flex flex-col items-center">
              <Navbar />
              {/* Main content area centers the children */}
              <main className="w-full flex-grow container mx-auto px-4 py-10 md:py-16">
                {children}
              </main>
              {/* A more subtle, styled footer */}
              <footer className="w-full text-center p-6 mt-auto text-sm text-gray-400 border-t border-white/10">
                <p>&copy; {new Date().getFullYear()} Base Agenta. All rights reserved.</p>
              </footer>
            </div>
            <Toaster 
              position="bottom-right" 
              toastOptions={{
                style: {
                  background: '#1f2937', // dark-blue-gray
                  color: '#e5e7eb', // gray-200
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                },
              }}
            />
        </Web3ModalProvider>
      </body>
    </html>
  );
}
