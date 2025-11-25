'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import CalculationTree from '@/components/CalculationTree';
import StartNumberForm from '@/components/StartNumberForm';
import SkeletonTree from '@/components/SkeletonTree';
import type { PostTree } from '@/types/post';

export default function Home() {
  const [posts, setPosts] = useState<PostTree[]>([]);
  const [loading, setLoading] = useState(true); // only for first load
  const [refreshing, setRefreshing] = useState(false); // for add/delete refresh
  const { token, logoutUser } = useAuth();

  const loadPosts = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setRefreshing(true); // refresh state (no skeleton)
    }

    const res = await fetch('/api/posts');
    const data = await res.json();

    setPosts(data);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPosts(true); // first load
  }, [loadPosts]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      {/* Top Bar */}
      <header className="flex items-center justify-between max-w-2xl w-full mx-auto mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Calculation Tree
        </h1>

        {token ? (
          <button
            onClick={logoutUser}
            className="px-4 py-1.5 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <a
            href="/login"
            className="px-4 py-1.5 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Login
          </a>
        )}
      </header>

      {/* Content */}
      <main className="max-w-2xl w-full mx-auto bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        {token && (
          <div className="mb-4">
            <StartNumberForm
              onSuccess={() => loadPosts(false)}
              refreshing={refreshing}
            />
          </div>
        )}

        <div className="mt-3">
          {loading ? (
            <SkeletonTree /> // only first load
          ) : (
            <CalculationTree
              posts={posts}
              onRefresh={() => loadPosts(false)}
              refreshing={refreshing}
            />
          )}
        </div>
      </main>
    </div>
  );
}
