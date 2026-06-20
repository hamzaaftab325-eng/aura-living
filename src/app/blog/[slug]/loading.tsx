import { ProductGridSkeleton } from '@/components/ui/Skeletons';

export default function BlogLoading() {
  return (
    <div
      className="w-full min-h-[60vh] flex items-center justify-center"
      
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="h-12 rounded animate-pulse mb-8"
          style={{ backgroundColor: 'var(--color-gold-pale)', width: '300px' }}
        />
        <ProductGridSkeleton count={6} />
      </div>
    </div>
  );
}
