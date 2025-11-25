'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveAuth } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { setToken } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Registration failed');
      return;
    }

    saveAuth(data.token);
    setToken(data.token);
    router.push('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Create Account
        </h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="border rounded-lg p-2.5 text-gray-700 shadow-sm 
                       focus:ring-2 focus:ring-green-300 outline-none transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border rounded-lg p-2.5 text-gray-700 shadow-sm 
                       focus:ring-2 focus:ring-green-300 outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="bg-green-600 text-white p-2.5 rounded-lg font-medium shadow 
                       hover:bg-green-500 transition"
          >
            Register
          </button>
        </form>

        {error && (
          <p className="mt-3 text-center text-red-500 text-sm font-medium">
            {error}
          </p>
        )}

        <p className="mt-5 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
