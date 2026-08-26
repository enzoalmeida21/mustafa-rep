import { SkeletonLine, SkeletonProductGrid } from "@/components/Skeleton";

export default function CatalogLoading() {
  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-2xl">
        <SkeletonLine className="h-2.5 w-28" />
        <SkeletonLine className="mt-5 h-12 w-4/5" />
        <SkeletonLine className="mt-5 w-full" />
        <SkeletonLine className="mt-2 w-3/5" />
      </div>

      <div className="mt-10 flex gap-3">
        <SkeletonLine className="h-11 w-full max-w-md rounded-full" />
        <SkeletonLine className="h-11 w-28 rounded-full" />
      </div>

      <div className="mt-6 flex gap-2 overflow-hidden">
        {Array.from({ length: 8 }, (_, index) => (
          <SkeletonLine key={index} className="h-9 w-24 shrink-0 rounded-full" />
        ))}
      </div>

      <div className="mt-8 border-t border-[var(--line)] pt-5">
        <SkeletonLine className="h-2.5 w-32" />
      </div>

      <div className="mt-6">
        <SkeletonProductGrid count={10} />
      </div>
    </div>
  );
}
