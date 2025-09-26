'use client'

import React, { useState, useCallback } from 'react';
import { useSendTransaction, useWriteContract } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import { erc20Abi } from '../lib/erc20Abi';
import toast from 'react-hot-toast';

const SendForm = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [sendType, setSendType] = useState('native'); // 'native' or 'erc20'
  const [isSending, setIsSending] = useState(false);

  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) {
        toast.error('Please fill in all fields.');
        return;
    }

    setIsSending(true);
    let txPromise: Promise<`0x${string}`>;

    if (sendType === 'native') {
      txPromise = sendTransactionAsync({ to: recipient as `0x${string}`, value: parseEther(amount) });
    } else {
      if (!tokenAddress) {
        toast.error('Please provide the ERC20 token address.');
        setIsSending(false);
        return;
      }
      // Note: This assumes 18 decimals for simplicity. A robust app would fetch this.
      txPromise = writeContractAsync({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipient as `0x${string}`, parseUnits(amount, 18)],
      });
    }

    await toast.promise(txPromise, {
        loading: `Sending ${sendType === 'native' ? 'ETH' : 'token'}...`,
        success: (txHash) => (
            <div>
                Transaction sent!
                <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 ml-2 underline">View on Basescan</a>
            </div>
        ),
        error: (err: { shortMessage?: string; message: string }) => `Transaction failed: ${err.shortMessage || err.message}`,
    });
    
    // Reset form on success
    setRecipient('');
    setAmount('');
    // Don't reset token address, user might want to send again
    setIsSending(false);

  }, [recipient, amount, sendType, tokenAddress, sendTransactionAsync, writeContractAsync]);

  return (
    <div className="w-full max-w-4xl bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">Send Assets</h2>
      
      <div className="flex items-center space-x-4 mb-6">
        <label className="flex items-center text-white cursor-pointer">
          <input type="radio" name="sendType" value="native" checked={sendType === 'native'} onChange={() => setSendType('native')} className="form-radio h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500" />
          <span className="ml-2">Native Asset (ETH)</span>
        </label>
        <label className="flex items-center text-white cursor-pointer">
          <input type="radio" name="sendType" value="erc20" checked={sendType === 'erc20'} onChange={() => setSendType('erc20')} className="form-radio h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500" />
          <span className="ml-2">ERC-20 Token</span>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {sendType === 'erc20' && (
          <div>
            <label htmlFor="tokenAddress" className="block text-sm font-medium text-gray-300">Token Contract Address</label>
            <input
              id="tokenAddress"
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x... contract address of the token"
              className="mt-1 block w-full bg-white/5 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-300">Recipient Address</label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="mt-1 block w-full bg-white/5 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount</label>
          <input
            id="amount"
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.05"
            className="mt-1 block w-full bg-white/5 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? 'Confirming...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default SendForm;
