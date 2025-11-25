'use client';

import { useState } from 'react';
import { getToken } from '@/lib/auth';

export default function OperationForm({
  parentId,
  onSuccess,
}: {
  parentId: string;
  onSuccess: () => void;
}) {
  const [right, setRight] = useState<string>(''); // store as string
  const [op, setOp] = useState<'+' | '-' | '*' | '/'>('+');

  async function submit() {
    const numericRight = Number(right);

    if (isNaN(numericRight)) return;

    const res = await fetch('/api/calc', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ parentId, op, right: numericRight }),
    });

    if (res.ok) {
      setRight('');
      onSuccess();
    }
  }

  return (
    <div className="flex gap-2 mt-2 items-center">
      {/* Operator */}
      <select
        className="border rounded-lg px-2 py-1 text-gray-700 bg-white shadow-sm 
                   focus:ring-2 focus:ring-blue-300 outline-none transition"
        value={op}
        onChange={(e) => setOp(e.target.value as '+' | '-' | '*' | '/')}
      >
        <option value="+">+</option>
        <option value="-">−</option>
        <option value="*">×</option>
        <option value="/">÷</option>
      </select>

      {/* Right number input */}
      <input
        type="number"
        className="border rounded-lg px-2 py-1 text-gray-700 shadow-sm
                   focus:ring-2 focus:ring-blue-300 outline-none transition"
        value={right}
        onChange={(e) => setRight(e.target.value)}
        placeholder="Enter number"
      />

      {/* Apply button */}
      <button
        disabled={right === ''}
        className={`px-4 py-1.5 rounded-lg text-white font-medium transition 
          ${
            right === ''
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-500'
          }
        `}
        onClick={submit}
      >
        Apply
      </button>
    </div>
  );
}
