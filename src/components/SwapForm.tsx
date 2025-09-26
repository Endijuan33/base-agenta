'use client'

import { useState, useEffect, Dispatch, SetStateAction, useMemo } from 'react';
import { useAccount, useSendTransaction, useWriteContract, useBalance } from 'wagmi'; 
import { parseUnits, formatUnits } from 'viem';
import { erc20Abi } from '../lib/erc20Abi';
import toast from 'react-hot-toast';
import debounce from 'lodash.debounce';
import Image from 'next/image';
import { ArrowDownUp, ChevronDown, Search } from 'lucide-react';

// --- TYPES AND CONSTANTS ---

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
}

const tokens: Token[] = [
  { symbol: 'ETH', address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { symbol: 'USDC', address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', decimals: 6, logoURI: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
  { symbol: 'DEGEN', address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed', decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/34530/small/degen.jpg' },
  { symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png' },
];

// --- SUB-COMPONENTS ---

const TokenSelectModal = ({ isOpen, onClose, setToken, otherToken }: { isOpen: boolean, onClose: () => void, setToken: (token: Token) => void, otherToken: Token }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    if (!isOpen) return null;
    
    const filteredTokens = tokens.filter(t => t.symbol.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="w-full max-w-md m-4 p-4 rounded-xl shadow-card-lifted border border-[rgba(255,255,255,0.05)] bg-[rgba(15,23,42,0.75)] backdrop-blur-[8px]" onClick={e => e.stopPropagation()}>
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                    <input 
                        type="text"
                        placeholder="Search by symbol..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-dark-slate border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-vibrant-purple/50"
                    />
                </div>
                <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto">
                    {filteredTokens.map(token => (
                        <button key={token.address} onClick={() => { setToken(token); onClose(); }} className="flex items-center gap-3 p-3 rounded-lg text-left hover:bg-white/5 transition-colors">
                            <Image src={token.logoURI} alt={token.symbol} width={40} height={40} className="rounded-full"/>
                            <div>
                                <p className="font-bold text-lg text-white">{token.symbol}</p>
                                {token.address === otherToken.address && <p className="text-sm text-gray-400">Already selected</p>}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface SwapInputProps {
    amount: string;
    setAmount?: Dispatch<SetStateAction<string>>;
    token: Token;
    setToken: Dispatch<SetStateAction<Token>>;
    otherToken: Token;
    label: string;
    balance?: string;
}

const SwapInput = ({ amount, setAmount, token, setToken, otherToken, label, balance }: SwapInputProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div className="bg-dark-slate/50 border border-white/10 rounded-xl p-4">
            <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-400">{label}</label>
                <span className="text-xs text-gray-400">Balance: {balance ? parseFloat(balance).toFixed(4) : '0.00'}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount && setAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-transparent text-4xl font-mono text-white focus:outline-none appearance-none disabled:cursor-not-allowed"
                  disabled={!setAmount}
                />
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-dark-blue-gray/50 border border-white/10 rounded-full py-2 px-4 transition-colors hover:bg-white/5">
                    <Image src={token.logoURI} alt={token.symbol} width={28} height={28} className="rounded-full"/>
                    <span className="font-bold text-xl text-white">{token.symbol}</span>
                    <ChevronDown className="h-5 w-5 text-gray-400"/>
                </button>
            </div>
            <TokenSelectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} setToken={setToken} otherToken={otherToken} />
        </div>
    );
};

// --- MAIN COMPONENT ---

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

  const { data: sellTokenBalance } = useBalance({ address, token: sellToken.address === tokens[0].address ? undefined : sellToken.address });

  const debouncedFetchQuote = useMemo(
    () => 
      debounce(async (currentSellAmount: string, currentSellToken: Token, currentBuyToken: Token, currentAddress: `0x${string}` | undefined) => {
        if (!currentAddress || !currentSellAmount || parseFloat(currentSellAmount) <= 0 || currentSellToken.address === currentBuyToken.address) {
          setBuyAmount(''); setQuote(null); return;
        }
        const params = new URLSearchParams({ sellToken: currentSellToken.address, buyToken: currentBuyToken.address, sellAmount: parseUnits(currentSellAmount, currentSellToken.decimals).toString(), takerAddress: currentAddress });
        const toastId = toast.loading('Fetching best price...');
        try {
          const response = await fetch(`https://base.api.0x.org/swap/v1/quote?${params}`);
          if (!response.ok) throw new Error('Could not fetch quote');
          const quoteData: Quote = await response.json();
          setBuyAmount(formatUnits(BigInt(quoteData.buyAmount), currentBuyToken.decimals));
          setQuote(quoteData);
          toast.success('Quote updated!', { id: toastId });
        } catch (error) { console.error("Failed to fetch quote:", error); setBuyAmount(''); setQuote(null); toast.error('Error fetching quote', { id: toastId }); }
      }, 500),
    [setBuyAmount, setQuote] // State setters are stable and won't cause re-creation
  );

  useEffect(() => {
      debouncedFetchQuote(sellAmount, sellToken, buyToken, address);
      return () => {
        debouncedFetchQuote.cancel();
      }
  }, [sellAmount, sellToken, buyToken, address, debouncedFetchQuote]);

  const handleSwap = async () => {
    if (!isConnected || !address || !quote) return;
    setIsExecuting(true);
    try {
        if (sellToken.address !== tokens[0].address) { // Check for allowance if not ETH
            const allowanceRes = await fetch(`https://base.api.0x.org/swap/v1/allowance?tokenAddress=${sellToken.address}&takerAddress=${address}`);
            const { allowance } = await allowanceRes.json();
            if (BigInt(allowance) < BigInt(quote.sellAmount)) {
                await toast.promise(writeContractAsync({ abi: erc20Abi, address: sellToken.address, functionName: 'approve', args: [quote.allowanceTarget, BigInt(quote.sellAmount)] }), {
                    loading: `Requesting approval for ${sellToken.symbol}...`, success: 'Token approval successful!', error: 'Failed to approve token',
                });
            }
        }
        const txHash = await sendTransactionAsync({ to: quote.to, data: quote.data, value: BigInt(quote.value) });
        toast.promise(Promise.resolve(txHash), {
          loading: 'Sending swap transaction...',
          success: (hash) => <div>Swap successful! <a href={`https://basescan.org/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-vibrant-purple underline">View on Basescan</a></div>,
          error: (err) => `Swap failed: ${err.message}`,
        });
        setSellAmount(''); setBuyAmount(''); setQuote(null);
    } catch (err) { console.error("Swap execution failed:", err); } finally { setIsExecuting(false); }
  };

  const handleTokenSwitch = () => { const temp = sellToken; setSellToken(buyToken); setBuyToken(temp); };

  const buttonText = isExecuting ? 'Processing...' : (quote ? 'Swap' : 'Enter an amount');
  const isButtonDisabled = isExecuting || !quote || !isConnected || parseFloat(sellAmount) <= 0;

  return (
    <div className="w-full max-w-lg mx-auto p-6 relative overflow-hidden rounded-xl shadow-card-lifted border border-[rgba(255,255,255,0.05)] bg-[rgba(15,23,42,0.75)] backdrop-blur-[8px]">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-80 h-80 bg-vibrant-purple/20 rounded-full blur-3xl opacity-60" />
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Token Swap</h2>
        <div className="flex flex-col gap-2 relative">
            <SwapInput label="You Sell" amount={sellAmount} setAmount={setSellAmount} token={sellToken} setToken={setSellToken} otherToken={buyToken} balance={sellTokenBalance?.formatted} />
            <div className="flex justify-center items-center my-[-10px] z-20">
                <button onClick={handleTokenSwitch} className="bg-dark-slate border-4 border-dark-blue-gray rounded-full p-2 transition-transform duration-300 hover:rotate-180 hover:scale-110">
                    <ArrowDownUp className="h-5 w-5 text-gray-300"/>
                </button>
            </div>
            <SwapInput label="You Buy (Estimated)" amount={buyAmount} token={buyToken} setToken={setBuyToken} otherToken={sellToken} />
        </div>
        <button
          onClick={handleSwap}
          disabled={isButtonDisabled}
          className="w-full mt-6 py-4 px-4 rounded-xl text-lg font-bold text-white bg-vibrant-purple shadow-purple-glow transition-all duration-300 transform hover:brightness-110 hover:shadow-purple-glow-soft animate-glow disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed disabled:animate-none"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SwapForm;
