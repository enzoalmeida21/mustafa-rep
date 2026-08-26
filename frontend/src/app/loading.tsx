import { SkeletonLine } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div
      role="status"
      aria-label="Carregando página inicial"
      className="container grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-24"
    >
      <div className="max-w-xl">
        <SkeletonLine className="h-2.5 w-40" />
        <SkeletonLine className="mt-6 h-14 w-full" />
        <SkeletonLine className="mt-3 h-14 w-3/5" />
        <SkeletonLine className="mt-7 w-full" />
        <SkeletonLine className="mt-2 w-4/5" />

        <div className="mt-9 flex gap-3">
          <SkeletonLine className="h-11 w-48 rounded-full" />
          <SkeletonLine className="h-11 w-52 rounded-full" />
        </div>

        <div className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-[var(--line)] pt-7">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index}>
              <SkeletonLine className="h-8 w-14" />
              <SkeletonLine className="mt-2 h-2.5 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="skeleton mx-auto aspect-[3/4] w-full max-w-[26rem] rounded-[var(--radius)] lg:justify-self-end" />
    </div>
  );
}
