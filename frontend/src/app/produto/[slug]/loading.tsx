import { SkeletonLine } from "@/components/Skeleton";

export default function ProductLoading() {
  return (
    <div
      role="status"
      aria-label="Carregando produto"
      className="container grid gap-10 py-10 md:grid-cols-2 md:gap-14 md:py-16"
    >
      <div className="skeleton aspect-square rounded-[var(--radius)]" />

      <div className="flex flex-col justify-center">
        <SkeletonLine className="h-2.5 w-28" />
        <SkeletonLine className="mt-3 h-2.5 w-36" />
        <SkeletonLine className="mt-5 h-10 w-4/5" />
        <SkeletonLine className="mt-3 h-3 w-32" />
        <SkeletonLine className="mt-6 w-full" />
        <SkeletonLine className="mt-2 w-11/12" />
        <SkeletonLine className="mt-2 w-2/3" />

        <div className="mt-8 border-y border-[var(--line)] py-6">
          <SkeletonLine className="h-8 w-40" />
        </div>

        <div className="mt-7 flex gap-3">
          <SkeletonLine className="h-11 w-52 rounded-full" />
          <SkeletonLine className="h-11 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}
