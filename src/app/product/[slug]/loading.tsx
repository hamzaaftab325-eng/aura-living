import { ProductGridSkeleton, HeroSkeleton } from '@/components/ui/Skeletons';

export default function ProductLoading() {
  return (
    <div className="w-full" >
      <HeroSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  );
}
