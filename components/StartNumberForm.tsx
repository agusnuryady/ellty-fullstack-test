'use client';

import { useState } from 'react';
import { getToken } from '@/lib/auth';

export default function StartNumberForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [value, setValue] = useState<string>('');

  async function submit() {
    const numericValue = Number(value);

    if (isNaN(numericValue)) return;

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ value: numericValue }),
    });

    if (res.ok) {
      setValue('');
      onSuccess();
    }
  }

  const isDisabled = value.trim() === '';

  return (
    <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg border border-gray-200">
      <input
        type="number"
        placeholder="Enter starting number..."
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button
        disabled={isDisabled}
        onClick={submit}
        className={`px-5 py-2 rounded-lg font-medium text-white transition-all 
          ${
            isDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 cursor-pointer shadow-sm'
          }
        `}
      >
        Start
      </button>
    </div>
  );
}
