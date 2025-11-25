export default function SkeletonTree() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse p-4 bg-gray-200 rounded-lg border border-gray-300"
        >
          <div className="h-4 w-32 bg-gray-300 rounded mb-3"></div>
          <div className="h-3 w-20 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  );
}
