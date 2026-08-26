export function SkeletonLine({ className = "" }: { className?: string }) {
  return <span className={`skeleton block h-4 ${className}`} />;
}

export function SkeletonProductCard() {
  return (
    <div className="surface overflow-hidden rounded-[var(--radius)]">
      <div className="skeleton aspect-square rounded-none" />
      <div className="grid gap-2.5 p-4">
        <SkeletonLine className="h-2.5 w-1/3" />
        <SkeletonLine className="w-11/12" />
        <SkeletonLine className="h-3 w-2/3" />
        <SkeletonLine className="mt-2 h-5 w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonProductGrid({ count = 10 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Carregando produtos"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      {Array.from({ length: count }, (_, index) => (
        <SkeletonProductCard key={index} />
      ))}
    </div>
  );
}
