import { NextRequest, NextResponse } from 'next/server';

// This is your new server-side API route.
// It safely handles the Covalent API key.

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const chainId = searchParams.get('chainId');

  if (!address || !chainId) {
    return NextResponse.json({ error: 'Address and chainId are required' }, { status: 400 });
  }

  // The API key is now securely stored on the server.
  const apiKey = process.env.COVALENT_API_KEY;
  if (!apiKey) {
    console.error('COVALENT_API_KEY is not set in server environment variables.');
    return NextResponse.json({ error: 'Server configuration error: API key not found.' }, { status: 500 });
  }

  const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Covalent API Error:', errorData);
      return NextResponse.json({ error: errorData.error_message || 'Failed to fetch balances from Covalent' }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Internal API Route Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
