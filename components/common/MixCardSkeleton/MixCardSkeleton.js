/**
 * Loading skeleton for mix cards
 * Shows animated placeholder while mix data is loading
 */
export function MixCardSkeleton() {
  return (
    <article
      className="mb-8 rounded-lg overflow-hidden border border-light-blue border-opacity-20 shadow-md animate-pulse"
      aria-busy="true"
      aria-label="Loading mix card"
    >
      {/* Image Skeleton */}
      <div className="w-full h-64 bg-gray-300 dark:bg-gray-700" />

      {/* Content Skeleton */}
      <div className="p-6">
        {/* Title Skeleton */}
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3" />

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
        </div>
      </div>
    </article>
  );
}

export default MixCardSkeleton;
