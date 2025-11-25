'use client';

import { useState } from 'react';
import { getToken } from '@/lib/auth';

export default function StartNumberForm({
  onSuccess,
  refreshing,
}: {
  onSuccess: () => void;
  refreshing: boolean;
}) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    const numericValue = Number(value);
    if (isNaN(numericValue)) return;

    setLoading(true);

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ value: numericValue }),
    });

    if (res.ok) {
      setValue('');
      await onSuccess(); // this triggers loadPosts
    }

    // We keep loading UNTIL parent refreshing is false
    // Parent will control refresh; this ensures button only resets after data refresh
    setLoading(false);
  }

  const disabled = value.trim() === '' || loading || refreshing;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col sm:flex-row items-center gap-3 bg-gray-100 p-4 rounded-lg border border-gray-200">
      <input
        type="number"
        placeholder="Enter starting number..."
        className="w-full flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button
        disabled={disabled}
        onClick={submit}
        className={`w-full sm:w-auto px-5 py-2 rounded-lg font-medium text-white transition-all ${
          disabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 cursor-pointer shadow-sm'
        }`}
      >
        {loading ? 'Loading...' : 'Start'}
      </button>
    </div>
  );
}
