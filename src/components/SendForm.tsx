'use client'

import React, { useState } from 'react';
import { useSendTransaction, useWriteContract } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import { erc20ABI } from '../lib/contracts';

const SendForm = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [sendType, setSendType] = useState('native'); // 'native' or 'erc20'

  // Hook for sending native asset
  const { data: nativeHash, isPending: isNativePending, sendTransaction, error: nativeError } = useSendTransaction();

  // Hook for sending ERC20 token
  const { data: erc20Hash, isPending: isErc20Pending, writeContract, error: erc20Error } = useWriteContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return;

    if (sendType === 'native') {
      sendTransaction({ to: recipient as `0x${string}`, value: parseEther(amount) });
    } else if (sendType === 'erc20') {
      if (!tokenAddress) return;
      // For ERC20, we need to know the decimals. We'll assume 18 for simplicity here.
      // A robust implementation would fetch the token's decimals.
      writeContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20ABI,
        functionName: 'transfer',
        args: [recipient as `0x${string}`, parseUnits(amount, 18)],
      });
    }
  };

  const isPending = isNativePending || isErc20Pending;
  const hash = nativeHash || erc20Hash;
  const error = nativeError || erc20Error;

  return (
    <div className="w-full max-w-4xl bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">Send Assets</h2>
      
      {/* Send Type Toggle */}
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
        {/* ERC20 Token Address Input */}
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

        {/* Recipient and Amount Inputs */}
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
          disabled={isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Confirming...' : 'Send'}
        </button>

        {hash && <div className="mt-4 text-green-400 text-center break-words">Transaction sent! Hash: {hash}</div>}
        {error && <div className="mt-4 text-red-400 text-center">Error: {error.shortMessage}</div>}
      </form>
    </div>
  );
};

export default SendForm;
