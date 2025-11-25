'use client';

import { useAuth } from '@/context/AuthContext';
import OperationForm from './OperationForm';
import type { PostTree } from '@/types/post';

interface CalculationTreeProps {
  posts: PostTree[];
  onRefresh: () => void;
  refreshing: boolean; // <-- add this
}

export default function CalculationTree({
  posts,
  onRefresh,
  refreshing, // <-- receive
}: CalculationTreeProps) {
  const { token } = useAuth();

  function renderNode(node: PostTree) {
    return (
      <li key={node.id} className="mb-4">
        {/* Card */}
        <div className="p-3 border rounded-lg shadow-sm bg-white hover:shadow-md transition">
          {/* Top Row */}
          <div className="flex justify-between items-center">
            <div className="font-semibold text-gray-800">
              <span className="text-gray-500">Value:</span> {node.value}
            </div>
          </div>
          {/* Add Child Operation */}
          {token && (
            <div className="mt-3">
              <OperationForm
                parent={node}
                onSuccess={onRefresh}
                // disabled={refreshing}
                refreshing={refreshing}
              />
            </div>
          )}
        </div>

        {/* Children */}
        {node.children?.length > 0 ? (
          <ul className="ml-6 mt-2 border-l-2 border-gray-200 pl-4 space-y-3">
            {node.children.map((child) => renderNode(child))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 italic ml-6 mt-1">
            No comments yet
          </p>
        )}
      </li>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-gray-500 italic py-6 border rounded">
        {token ? (
          <>No data yet. Start by adding a number above.</>
        ) : (
          <div>
            No data yet. Please{' '}
            <a href="/login" className="text-blue-600 underline">
              login first
            </a>{' '}
            to start.
          </div>
        )}
      </div>
    );
  }

  return <ul className="space-y-4">{posts.map((p) => renderNode(p))}</ul>;
}
