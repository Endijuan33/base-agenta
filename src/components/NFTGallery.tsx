'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useChainId } from 'wagmi'; // 1. Import useChainId

interface NFTGalleryProps {
  address: `0x${string}` | undefined;
}

// Types for Covalent API response
interface NftExternalData {
  name: string;
  image: string;
}

interface NftItemData {
  external_data: NftExternalData;
}

interface CovalentApiItem {
  type: string;
  contract_name: string;
  nft_data?: NftItemData[];
}

interface NftDisplayData {
  name: string;
  collection_name: string;
  image_url: string;
}

// 2. Map chain IDs to Covalent chain names
const getCovalentChainName = (chainId: number): string => {
    switch (chainId) {
        case 1: return 'eth-mainnet';
        case 8453: return 'base-mainnet';
        case 137: return 'polygon-mainnet';
        case 42161: return 'arbitrum-mainnet';
        default: return 'eth-mainnet'; // Default to Ethereum Mainnet
    }
};

const NFTGallery = ({ address }: NFTGalleryProps) => {
  const [nfts, setNfts] = useState<NftDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chainId = useChainId(); // 3. Get the active chain ID

  useEffect(() => {
    if (!address) {
      setNfts([]);
      return;
    }

    const fetchNfts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const covalentChainName = getCovalentChainName(chainId);
        const apiKey = process.env.NEXT_PUBLIC_COVALENT_API_KEY;
        if (!apiKey) {
          throw new Error("Covalent API key is not configured.");
        }

        // 4. Use the dynamic chain name in the URL
        const url = `https://api.covalenthq.com/v1/${covalentChainName}/address/${address}/balances_v2/?key=${apiKey}&nft=true`;
        
        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error_message || 'Failed to fetch NFT data');
        }
        const data = await response.json();
        
        const nftItems = data.data.items
          .filter((item: CovalentApiItem) => item.type === 'nft' && item.nft_data?.[0]?.external_data?.image)
          .map((item: CovalentApiItem) => ({
            name: item.nft_data![0].external_data.name || 'No Name',
            collection_name: item.contract_name,
            // Replace ipfs:// protocol with a public gateway
            image_url: item.nft_data![0].external_data.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
          }));

        setNfts(nftItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error("Error fetching NFTs:", err);
      }
      setIsLoading(false);
    };

    fetchNfts();
  }, [address, chainId]); // 5. Add chainId to dependency array

  const renderContent = () => {
    if (!address) {
       return <p className="text-center text-gray-300">Connect your wallet to see your NFTs.</p>;
    }
    if (isLoading) {
        return <p className="text-center text-gray-300 animate-pulse">Loading your digital collectibles...</p>;
    }
    if (error) {
        return <p className="text-center text-red-400">Error: {error}</p>;
    }
    if (nfts.length === 0) {
        return <p className="text-center text-gray-400 col-span-full">No NFTs found on this network.</p>;
    }
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {nfts.map((nft, index) => (
                <div key={index} className="bg-white/10 rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
                <div className="relative w-full h-40">
                  <Image 
                    src={nft.image_url} 
                    alt={nft.name}
                    layout="fill" 
                    objectFit="cover" 
                    className="rounded-t-lg"
                    unoptimized={true} // Good for external URLs
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} // Hide image on error
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-white truncate" title={nft.name}>{nft.name}</h3>
                  <p className="text-xs text-gray-400 truncate" title={nft.collection_name}>{nft.collection_name}</p>
                </div>
              </div>
            ))}
        </div>
    );
  };

  return (
    <div className="w-full max-w-4xl bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mt-8">
      <h2 className="text-2xl font-bold text-white mb-6">NFT Gallery</h2>
      {renderContent()}
    </div>
  );
};

export default NFTGallery;
