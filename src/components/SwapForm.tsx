'use client'

import { useState, useEffect } from 'react';
// 1. Remove the unused useReadContract import
import { useAccount, useSendTransaction, useWriteContract } from 'wagmi'; 
import { parseUnits, formatUnits } from 'viem';
import { erc20Abi } from '../lib/erc20Abi';
import toast from 'react-hot-toast';

interface Token {
  symbol: string;
  address: `0x${string}` | '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
  decimals: number;
  logoURI: string;
}

interface Quote {
  buyAmount: string;
  sellAmount: string;
  allowanceTarget: `0x${string}`;
  to: `0x${string}`;
  data: `0x${string}`;
  value: string;
  gas: string;
}

const tokens: Token[] = [
  { symbol: 'ETH', address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { symbol: 'USDC', address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', decimals: 6, logoURI: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
  { symbol: 'DEGEN', address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed', decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/34530/small/degen.jpg' },
  { symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png' },
];

const SwapForm = () => {
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  const [sellAmount, setSellAmount] = useState('');
  const [sellToken, setSellToken] = useState<Token>(tokens[0]);
  const [buyToken, setBuyToken] = useState<Token>(tokens[1]);
  const [buyAmount, setBuyAmount] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sellAmount || parseFloat(sellAmount) <= 0 || sellToken.address === buyToken.address) {
      setBuyAmount('');
      setQuote(null);
      return;
    }

    const fetchQuote = async () => {
        setIsFetchingQuote(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                sellToken: sellToken.address,
                buyToken: buyToken.address,
                sellAmount: parseUnits(sellAmount, sellToken.decimals).toString(),
                takerAddress: address!,
            });
            
            const response = await fetch(`https://base.api.0x.org/swap/v1/quote?${params}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.validationErrors?.[0]?.reason || 'Could not fetch quote from 0x API');
            }
            const quoteData: Quote = await response.json();
            setBuyAmount(formatUnits(BigInt(quoteData.buyAmount), buyToken.decimals));
            setQuote(quoteData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            setBuyAmount('');
            console.error("Error fetching quote:", err);
        }
        setIsFetchingQuote(false);
    };

    const debounceTimer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(debounceTimer);

  }, [sellAmount, sellToken, buyToken, address]);

  const handleSwap = async () => {
    if (!isConnected || !address || !quote) {
      toast.error('Please connect your wallet and get a valid quote first.');
      return;
    }

    setIsExecuting(true);
    setError(null);
    const toastId = toast.loading('Preparing transaction...');

    try {
        if (sellToken.address !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
            const allowanceResponse = await fetch(`https://base.api.0x.org/swap/v1/allowance?tokenAddress=${sellToken.address}&takerAddress=${address}`);
            const allowanceData = await allowanceResponse.json();
            const currentAllowance = BigInt(allowanceData.allowance);

            if (currentAllowance < BigInt(quote.sellAmount)) {
                toast.loading(`Please approve ${sellToken.symbol}...`, { id: toastId });
                await writeContractAsync({
                    abi: erc20Abi,
                    address: sellToken.address as `0x${string}`,
                    functionName: 'approve',
                    args: [quote.allowanceTarget, BigInt(quote.sellAmount)],
                });
                toast.loading('Approval successful! Sending swap...', { id: toastId });
            }
        }
        
        toast.loading('Sending swap transaction...', { id: toastId });

        await sendTransactionAsync({
            to: quote.to,
            data: quote.data,
            value: BigInt(quote.value),
            gas: BigInt(quote.gas),
        });

        toast.success('Swap successful!', { id: toastId });
        setSellAmount('');
        setBuyAmount('');
        setQuote(null);
    } catch (err) {
        // 2. Safely handle wagmi/viem errors without using 'any'
        let errorMessage = 'Swap failed.';
        if (typeof err === 'object' && err !== null && 'shortMessage' in err) {
            errorMessage = (err as { shortMessage: string }).shortMessage;
        } else if (err instanceof Error) {
            errorMessage = err.message;
        }
        setError(errorMessage);
        toast.error(errorMessage, { id: toastId });
        console.error("Swap execution failed:", err);
    } finally {
        setIsExecuting(false);
    }
  };

  const TokenSelector = ({ token, setToken }: { token: Token, setToken: (token: Token) => void }) => (
    <select 
        value={token.address}
        onChange={(e) => setToken(tokens.find(t => t.address === e.target.value)!)}
        className="bg-gray-800 text-white rounded-md p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
        {tokens.map(t => (
            <option key={t.address} value={t.address}>{t.symbol}</option>
        ))}
    </select>
  );

  return (
    <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Token Swap</h2>
      <div className="space-y-4">
        <div className="bg-black/20 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-300">You Sell</label>
          </div>
          <div className="flex items-center justify-between mt-1">
            <input
              type="number"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              placeholder="0.0"
              className="w-full bg-transparent text-3xl text-white focus:outline-none appearance-none"
            />
            <TokenSelector token={sellToken} setToken={setSellToken} />
          </div>
        </div>

        <div className="bg-black/20 p-4 rounded-lg">
          <label className="text-sm font-medium text-gray-300">You Buy</label>
          <div className="flex items-center justify-between mt-1">
            <input
              type="number"
              value={buyAmount}
              disabled
              placeholder="0.0"
              className="w-full bg-transparent text-3xl text-white focus:outline-none disabled:opacity-70 appearance-none"
            />
            <TokenSelector token={buyToken} setToken={setBuyToken} />
          </div>
        </div>

        <button
          onClick={handleSwap}
          disabled={isFetchingQuote || isExecuting || !quote || !isConnected}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isExecuting ? 'Executing Swap...' : (isFetchingQuote ? 'Fetching Quote...' : (quote ? 'Swap' : 'Enter an amount'))}
        </button>

        {error && <p className="text-red-400 text-center mt-2 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default SwapForm;
