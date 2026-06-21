import { HeroSkeleton, ProductGridSkeleton } from '@/components/ui/Skeletons';

export default function Loading() {
  return (
    <div className="w-full" >
      <HeroSkeleton />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 rounded animate-pulse mb-6" style={{  width: '250px' }} />
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    </div>
  );
}
