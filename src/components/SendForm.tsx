'use client'

import { useAccount, useBalance, useSendTransaction } from 'wagmi'
import { useState } from 'react'
import { parseEther } from 'viem'
import { toast } from 'react-hot-toast'

const SendForm = () => {
  const { isConnected } = useAccount()
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')

  const { data: balance } = useBalance({ address: useAccount().address })
  const { sendTransaction, isPending } = useSendTransaction()

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!to || !amount) {
      toast.error('Please fill in both fields.')
      return
    }
    sendTransaction({ to: to as `0x${string}`, value: parseEther(amount as `${number}`) }, {
      onSuccess(data) {
        toast.success('Transaction sent successfully!\nHash: ' + data)
        setTo('')
        setAmount('')
      },
      onError(error) {
        toast.error('Transaction failed: \n' + error.message)
      }
    })
  }

  const getFormattedMaxAmount = () => {
    if (balance) {
        // Subtract a small amount for gas fees
        const max = parseFloat(balance.formatted) - 0.001;
        return max > 0 ? max.toFixed(6) : '0';
    }
    return '0';
  }

  if (!isConnected) {
    return (
      <div className="p-6 rounded-lg bg-[rgba(var(--card-background),0.7)] border border-[rgba(var(--card-border),0.7)] backdrop-blur-sm shadow-lg">
        <p className="text-gray-400">Please connect your wallet to send funds.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSend} className="p-6 rounded-lg bg-[rgba(var(--card-background),0.7)] border border-[rgba(var(--card-border),0.7)] backdrop-blur-sm shadow-lg space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text text-gray-300">Recipient Address</span>
        </label>
        <input 
          type="text" 
          placeholder="0x..." 
          className="input input-bordered w-full bg-gray-800 text-white focus:ring-2 focus:ring-blue-500" 
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text text-gray-300">Amount (ETH)</span>
        </label>
        <div className="relative">
            <input 
              type="number" 
              placeholder="0.05" 
              className="input input-bordered w-full bg-gray-800 text-white focus:ring-2 focus:ring-blue-500" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button type="button" className="absolute inset-y-0 right-0 px-3 text-sm text-blue-400 hover:text-blue-300" onClick={() => setAmount(getFormattedMaxAmount())}>
              Max
            </button>
        </div>
      </div>
      <button type="submit" className="btn btn-primary w-full bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50" disabled={isPending}>
        {isPending ? (
          <span className="loading loading-spinner"></span>
        ) : 'Send'}
      </button>
    </form>
  )
}

export default SendForm
