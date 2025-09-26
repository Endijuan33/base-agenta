import { NextRequest, NextResponse } from 'next/server';

// Mapping from standard chain IDs to Covalent's chain names
const getCovalentChainName = (chainId: string): string => {
    const chainIdMap: { [key: string]: string } = {
        '1': 'eth-mainnet',
        '8453': 'base-mainnet',
        '137': 'polygon-mainnet',
        '42161': 'arbitrum-mainnet',
    };
    return chainIdMap[chainId] || 'eth-mainnet'; // Default to Ethereum Mainnet
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const chainId = searchParams.get('chainId');

  if (!address || !chainId) {
    return NextResponse.json({ error: 'Address and chainId are required' }, { status: 400 });
  }

  const apiKey = process.env.COVALENT_API_KEY;
  if (!apiKey) {
    console.error('COVALENT_API_KEY is not set in server environment variables.');
    return NextResponse.json({ error: 'Server configuration error: API key not found.' }, { status: 500 });
  }

  // The server now handles the mapping from chainId to Covalent's required chain name
  const covalentChainName = getCovalentChainName(chainId);
  const url = `https://api.covalenthq.com/v1/${covalentChainName}/address/${address}/transactions_v3/?key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Covalent API Error:', errorData);
      return NextResponse.json({ error: errorData.error_message || 'Failed to fetch transactions' }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Internal API Route Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
