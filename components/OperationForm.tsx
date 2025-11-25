'use client';

import { useState } from 'react';
import { getToken } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { PostTree } from '@/types/post';

export default function OperationForm({
  parent,
  onSuccess,
  disabled = false,
  refreshing,
}: {
  parent: PostTree;
  onSuccess: () => void;
  disabled?: boolean;
  refreshing: boolean;
}) {
  const { user } = useAuth();
  const [right, setRight] = useState<string>('');
  const [op, setOp] = useState<'+' | '-' | '*' | '/'>('+');
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  async function submit() {
    const numericRight = Number(right);
    if (isNaN(numericRight)) return;

    setLoading(true);

    const res = await fetch('/api/calc', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ parentId: parent.id, op, right: numericRight }),
    });

    if (res.ok) {
      setRight('');
      await onSuccess();
    }

    setLoading(false);
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return;

    setLoadingDelete(true);

    const res = await fetch('/api/posts', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      await onSuccess();
    }

    setLoadingDelete(false);
  }

  const isDisabled = right === '' || disabled || loading || refreshing;

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="w-full flex flex-col sm:flex-row gap-2 items-center sm:items-end">
        <select
          disabled={loading}
          className="w-full sm:w-auto border rounded-lg px-2 py-2 text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-300 outline-none transition disabled:bg-gray-200"
          value={op}
          onChange={(e) => setOp(e.target.value as '+' | '-' | '*' | '/')}
        >
          <option value="+">+</option>
          <option value="-">−</option>
          <option value="*">×</option>
          <option value="/">÷</option>
        </select>

        <input
          type="number"
          disabled={loading}
          className="w-full border rounded-lg px-2 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none transition disabled:bg-gray-200"
          value={right}
          onChange={(e) => setRight(e.target.value)}
          placeholder="Enter number"
        />

        <button
          disabled={isDisabled}
          onClick={submit}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white font-medium transition ${
            isDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-500'
          }`}
        >
          {loading ? 'Applying…' : 'Apply'}
        </button>
      </div>
      {/* Delete button (only owner) */}
      {user?.id === parent.userId && (
        <button
          className="text-red-500 text-sm hover:text-red-700 disabled:opacity-50"
          disabled={loadingDelete}
          onClick={() => deletePost(parent.id)}
        >
          {loadingDelete ? 'Deleting…' : 'Delete'}
        </button>
      )}
    </div>
  );
}
