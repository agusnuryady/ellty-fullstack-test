'use client';

import { useAuth } from '@/context/AuthContext';
import OperationForm from './OperationForm';
import { PostTree } from '@/types/post';

interface CalculationTreeProps {
  posts: PostTree[];
  onRefresh: () => void;
}

export default function CalculationTree({
  posts,
  onRefresh,
}: CalculationTreeProps) {
  const { token } = useAuth();

  function renderNode(node: PostTree) {
    return (
      <li key={node.id} className="mb-4">
        {/* Card Container */}
        <div
          className="p-3 border rounded-lg shadow-sm bg-white 
          hover:shadow-md transition-shadow"
        >
          <div className="font-semibold text-gray-800">
            <span className="text-gray-500">Value:</span> {node.value}
          </div>

          {token && (
            <div className="mt-3">
              <OperationForm parentId={node.id} onSuccess={onRefresh} />
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

  // EMPTY STATE
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-gray-600 italic py-8 border rounded-lg bg-gray-50 shadow-sm">
        {token ? (
          <>No data yet. Start by adding a number above.</>
        ) : (
          <div>
            No data yet. Please{' '}
            <a
              href="/login"
              className="text-blue-600 underline hover:text-blue-400"
            >
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
