'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';

// 1. Define an interface for the component's props
interface NFTGalleryProps {
  address: `0x${string}` | undefined;
}

// Define specific types for the Covalent API response
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

// 2. Accept the 'address' prop
const NFTGallery = ({ address }: NFTGalleryProps) => {
  const [nfts, setNfts] = useState<NftDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 3. Use the address from props. If no address, do nothing.
    if (!address) {
      setNfts([]);
      return;
    }

    const fetchNfts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.covalenthq.com/v1/base-mainnet/address/${address}/balances_v2/?key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}&nft=true`);
        if (!response.ok) {
          throw new Error('Failed to fetch NFT data from Covalent API');
        }
        const data = await response.json();
        
        const nftItems = data.data.items
          .filter((item: CovalentApiItem) => item.type === 'nft' && item.nft_data?.[0]?.external_data?.image)
          .map((item: CovalentApiItem) => ({
            name: item.nft_data![0].external_data.name || 'No Name',
            collection_name: item.contract_name,
            image_url: item.nft_data![0].external_data.image,
          }));

        setNfts(nftItems);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred');
        }
        console.error("Error fetching NFTs:", err);
      }
      setIsLoading(false);
    };

    fetchNfts();
  }, [address]); // 4. useEffect dependency is now the address prop

  if (!address) {
     return (
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">NFT Gallery</h2>
            <p className="text-center text-gray-300">Connect your wallet to see your NFTs.</p>
        </div>
    );
  }

  return (
    <div className="w-full max-w-4xl bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mt-8">
      <h2 className="text-2xl font-bold text-white mb-6">NFT Gallery</h2>
      {isLoading && <p className="text-center text-gray-300">Loading your digital collectibles...</p>}
      {error && <p className="text-center text-red-400">Error: {error}</p>}
      {!isLoading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {nfts.length > 0 ? (
            nfts.map((nft, index) => (
              <div key={index} className="bg-white/10 rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
                <div className="relative w-full h-40">
                  <Image 
                    src={nft.image_url} 
                    alt={nft.name} 
                    layout="fill" 
                    objectFit="cover" 
                    className="rounded-t-lg"
                    unoptimized={true}
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-white truncate" title={nft.name}>{nft.name}</h3>
                  <p className="text-xs text-gray-400 truncate" title={nft.collection_name}>{nft.collection_name}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full">No NFTs found in this wallet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NFTGallery;