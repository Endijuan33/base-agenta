'use client'

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Image from 'next/image';

// 1. Define TypeScript interfaces for the Zapper API response
interface DisplayProps {
    label: string;
    images: string[];
}

interface Asset {
    balanceUSD: number;
    displayProps: DisplayProps;
}

interface Position {
    key: string;
    address: string;
    appId: string;
    appName: string;
    balanceUSD: number;
    displayProps: DisplayProps;
    assets: Asset[];
}

const DeFiPositions = () => {
    const { address, isConnected } = useAccount();
    const [positions, setPositions] = useState<Position[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isConnected || !address) {
            setPositions([]);
            return;
        }

        const fetchPositions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 2. Fetch data from our own API proxy route
                const response = await fetch(`/api/zapper?address=${address}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch DeFi positions.');
                }
                const data: Position[] = await response.json();

                // Filter for positions with a balance and sort by value
                const filteredAndSortedData = data
                    .filter(p => p.balanceUSD > 1) 
                    .sort((a, b) => b.balanceUSD - a.balanceUSD);

                setPositions(filteredAndSortedData);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                setError(errorMessage);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPositions();
    }, [address, isConnected]);

    if (!isConnected) {
        return (
            <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mt-6">
                <p className="text-center text-gray-300">Please connect your wallet to view your DeFi positions.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mt-6">
                <p className="text-center text-gray-300">Loading DeFi positions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mt-6">
                <p className="text-center text-red-400">Error: {error}</p>
            </div>
        );
    }

    if (positions.length === 0) {
        return (
            <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mt-6">
                <h3 className="text-xl font-bold text-white mb-4">DeFi Positions</h3>
                <p className="text-center text-gray-300">No DeFi positions with a balance over $1.00 found.</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mt-6">
            <h3 className="text-xl font-bold text-white mb-4">DeFi Positions</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {positions.map((position) => (
                    <div key={position.key} className="bg-black/20 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Image src={position.displayProps.images[0]} alt={position.appName} width={40} height={40} className="rounded-full" />
                            <div>
                                <p className="font-bold text-white">{position.appName}</p>
                                <p className="text-sm text-gray-400">{position.displayProps.label}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-white">${position.balanceUSD.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeFiPositions;
