
'use client'

import { useState } from 'react'
import { useSendTransaction } from 'wagmi'
import { parseEther } from 'viem'

export function SendForm() {
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const { sendTransaction, isLoading, isSuccess, isError } = useSendTransaction()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    sendTransaction({ to: to as `0x${string}`, value: parseEther(amount) })
  }

  return (
    <div className="p-4 bg-gray-100 rounded-md dark:bg-gray-800">
      <h3 className="text-lg font-bold">Send Native Token</h3>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="to" className="block text-sm font-medium">
            Recipient Address
          </label>
          <input
            id="to"
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium">
            Amount
          </label>
          <input
            id="amount"
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
        {isSuccess && <p className="text-sm text-green-500">Transaction successful!</p>}
        {isError && <p className="text-sm text-red-500">Transaction failed.</p>}
      </form>
    </div>
  )
}
