'use client'

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useSendTransaction, useWriteContract } from 'wagmi'; 
import { parseUnits, formatUnits } from 'viem';
import { erc20Abi } from '../lib/erc20Abi';
import toast from 'react-hot-toast';
import debounce from 'lodash.debounce';

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

// Token list for Base network
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
  const [isExecuting, setIsExecuting] = useState(false);

  // Debounced quote fetching function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchQuote = useCallback(debounce(async (currentSellAmount: string, currentSellToken: Token, currentBuyToken: Token) => {
    if (!address || !currentSellAmount || parseFloat(currentSellAmount) <= 0 || currentSellToken.address === currentBuyToken.address) {
      setBuyAmount('');
      setQuote(null);
      return;
    }

    const params = new URLSearchParams({
        sellToken: currentSellToken.address,
        buyToken: currentBuyToken.address,
        sellAmount: parseUnits(currentSellAmount, currentSellToken.decimals).toString(),
        takerAddress: address,
    });
    
    const quotePromise = fetch(`https://base.api.0x.org/swap/v1/quote?${params}`);

    toast.promise(quotePromise, {
      loading: 'Fetching best price...',
      success: (res) => {
        if (!res.ok) throw new Error('Could not fetch quote'); 
        return 'Quote updated!';
      },
      error: 'Error fetching quote',
    });

    try {
      const response = await quotePromise;
      if (!response.ok) {
        setBuyAmount('');
        setQuote(null);
        return;
      }
      const quoteData: Quote = await response.json();
      setBuyAmount(formatUnits(BigInt(quoteData.buyAmount), currentBuyToken.decimals));
      setQuote(quoteData);
    } catch (error) {
      console.error("Failed to fetch quote:", error);
      setBuyAmount('');
      setQuote(null);
    }
  }, 500), [address]);

  useEffect(() => {
    fetchQuote(sellAmount, sellToken, buyToken);
  }, [sellAmount, sellToken, buyToken, fetchQuote]);

  const handleSwap = async () => {
    if (!isConnected || !address || !quote) {
      toast.error('Please connect your wallet and enter an amount.');
      return;
    }

    setIsExecuting(true);

    try {
      // 1. Check for and request token allowance if needed
      if (sellToken.address !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
        const allowanceResponse = await fetch(`https://base.api.0x.org/swap/v1/allowance?tokenAddress=${sellToken.address}&takerAddress=${address}`);
        const allowanceData = await allowanceResponse.json();
        const currentAllowance = BigInt(allowanceData.allowance);

        if (currentAllowance < BigInt(quote.sellAmount)) {
          const approvePromise = writeContractAsync({
            abi: erc20Abi,
            address: sellToken.address as `0x${string}`,
            functionName: 'approve',
            args: [quote.allowanceTarget, BigInt(quote.sellAmount)],
          });

          await toast.promise(approvePromise, {
            loading: `Requesting approval for ${sellToken.symbol}...`,
            success: 'Token approval successful!',
            error: 'Failed to approve token',
          });
        }
      }
      
      // 2. Execute the swap transaction
      const swapPromise = sendTransactionAsync({
        to: quote.to,
        data: quote.data,
        value: BigInt(quote.value),
      });

      await toast.promise(swapPromise, {
        loading: 'Sending swap transaction...',
        success: (txHash) => (
            <div>
                Swap successful!
                <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 ml-2 underline">View on Basescan</a>
            </div>
        ),
        error: (err: { shortMessage?: string; message: string }) => `Swap failed: ${err.shortMessage || err.message}`,
      });

      // Reset form state after successful swap
      setSellAmount('');
      setBuyAmount('');
      setQuote(null);

    } catch (err) {
      // Errors are handled by toast.promise, so we just log them here
      console.error("Swap execution failed:", err);
    } finally {
      setIsExecuting(false);
    }
  };

  const TokenSelector = ({ token, setToken, otherToken }: { token: Token, setToken: (token: Token) => void, otherToken: Token }) => (
    <select 
        value={token.address}
        onChange={(e) => {
            if (e.target.value === otherToken.address) {
                // If selecting the same token, swap them
                setSellToken(buyToken);
                setBuyToken(sellToken);
            } else {
                setToken(tokens.find(t => t.address === e.target.value)!)
            }
        }}
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
          <label className="text-sm font-medium text-gray-300">You Sell</label>
          <div className="flex items-center justify-between mt-1">
            <input
              type="number"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              placeholder="0.0"
              className="w-full bg-transparent text-3xl text-white focus:outline-none appearance-none"
            />
            <TokenSelector token={sellToken} setToken={setSellToken} otherToken={buyToken}/>
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
            <TokenSelector token={buyToken} setToken={setBuyToken} otherToken={sellToken} />
          </div>
        </div>

        <button
          onClick={handleSwap}
          disabled={isExecuting || !quote || !isConnected || parseFloat(sellAmount) <= 0}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isExecuting ? 'Processing...' : (quote ? 'Swap' : 'Enter an amount')}
        </button>

      </div>
    </div>
  );
};

export default SwapForm;
