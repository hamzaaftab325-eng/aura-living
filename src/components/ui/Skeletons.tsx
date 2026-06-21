'use client';

export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden" >
      <div className="w-full aspect-[3/4] animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-3 rounded animate-pulse" style={{  width: '60%' }} />
        <div className="h-3 rounded animate-pulse" style={{  width: '40%' }} />
        <div className="h-4 rounded animate-pulse" style={{  width: '30%' }} />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg p-6 space-y-3" >
      <div className="h-5 rounded animate-pulse" style={{  width: '50%' }} />
      <div className="h-3 rounded animate-pulse" style={{  width: '80%' }} />
      <div className="h-3 rounded animate-pulse" style={{  width: '70%' }} />
      <div className="h-3 rounded animate-pulse" style={{  width: '60%' }} />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="w-full h-[60vh] sm:h-[70vh] md:h-[80vh] animate-pulse" >
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="h-4 rounded animate-pulse" style={{  width: '200px' }} />
        <div className="h-12 rounded animate-pulse" style={{  width: '400px' }} />
        <div className="h-4 rounded animate-pulse" style={{  width: '300px' }} />
      </div>
    </div>
  );
}
