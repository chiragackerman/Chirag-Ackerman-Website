import React from 'react';

function SkeletonBar({ className = '' }) {
  return <div aria-hidden="true" className={`rounded bg-purple-500/15 animate-pulse ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-purple-500/15 bg-[#120D1A]" aria-hidden="true">
      <SkeletonBar className="aspect-4/3 w-full rounded-none bg-[#171020]" />
      <div className="p-5 space-y-4">
        <SkeletonBar className="h-3 w-2/3" />
        <div className="space-y-2">
          <SkeletonBar className="h-5 w-full" />
          <SkeletonBar className="h-5 w-4/5" />
        </div>
        <SkeletonBar className="h-8 w-full" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="flex min-h-56 flex-col justify-between rounded-2xl border border-purple-500/15 bg-[#120D1A] p-6" aria-hidden="true">
      <div className="space-y-4">
        <SkeletonBar className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <SkeletonBar className="h-5 w-2/3" />
          <SkeletonBar className="h-3 w-full" />
          <SkeletonBar className="h-3 w-4/5" />
        </div>
      </div>
      <SkeletonBar className="mt-5 h-4 w-1/2" />
    </div>
  );
}

export function SetupItemSkeleton() {
  return (
    <div className="grid grid-cols-1 items-center gap-8 border-b border-purple-900/20 py-12 lg:grid-cols-12 lg:gap-12" aria-hidden="true">
      <div className="lg:col-span-6">
        <SkeletonBar className="aspect-4/3 w-full rounded-2xl border border-purple-500/20 bg-[#120D1A]" />
      </div>
      <div className="space-y-5 lg:col-span-6">
        <div className="space-y-3">
          <SkeletonBar className="h-3 w-1/4" />
          <SkeletonBar className="h-8 w-4/5" />
          <SkeletonBar className="h-4 w-3/5" />
        </div>
        <SkeletonBar className="h-24 w-full rounded-xl" />
        <SkeletonBar className="h-10 w-40 rounded-xl" />
      </div>
    </div>
  );
}

export function CatalogErrorNotice({ onRetry }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-amber-500/20 bg-[#171020] p-4 text-sm text-[#A8A0B8] sm:flex-row sm:items-center sm:justify-between" role="alert">
      <span>Some catalog data could not be loaded. Showing any available saved items.</span>
      <button
        onClick={onRetry}
        className="shrink-0 self-start rounded-lg border border-purple-500/25 px-3 py-2 text-xs font-semibold text-purple-200 transition-colors hover:bg-purple-950/40 sm:self-auto"
      >
        Try Again
      </button>
    </div>
  );
}