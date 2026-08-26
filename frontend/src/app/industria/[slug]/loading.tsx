import { SkeletonLine } from "@/components/Skeleton";

export default function IndustryLoading() {
  return (
    <div className="pb-20">
      <section className="container pt-8 pb-4 md:pt-12">
        <SkeletonLine className="h-3 w-40" />

        <div className="mt-6 grid items-center gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-14">
          <div>
            <SkeletonLine className="h-2.5 w-28" />
            <SkeletonLine className="mt-5 h-14 w-3/5" />
            <SkeletonLine className="mt-6 w-full" />
            <SkeletonLine className="mt-2 w-4/5" />
            <SkeletonLine className="mt-8 h-11 w-48 rounded-full" />
          </div>
          <div className="skeleton aspect-[4/3] w-full max-w-[26rem] justify-self-center rounded-[var(--radius)] md:justify-self-end" />
        </div>

        <div className="divider-hair mt-12" />
      </section>

      <section className="container py-10 md:py-14">
        <SkeletonLine className="h-2.5 w-24" />
        <SkeletonLine className="mt-4 h-9 w-64" />

        <div
          role="status"
          aria-label="Carregando produtos"
          className="surface mt-8 divide-y divide-[var(--line)] overflow-hidden rounded-[var(--radius)]"
        >
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="flex items-center gap-4 px-5 py-5">
              <div className="skeleton h-[4.5rem] w-[4.5rem] shrink-0" />
              <div className="flex-1">
                <SkeletonLine className="h-2.5 w-24" />
                <SkeletonLine className="mt-2.5 w-3/4" />
              </div>
              <SkeletonLine className="hidden h-5 w-24 md:block" />
              <SkeletonLine className="hidden h-10 w-24 rounded-full md:block" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
