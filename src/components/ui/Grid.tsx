/**
 * Grid — Responsive grid layout wrapper.
 *
 * Standardizes grid column counts and gaps across all pages.
 * Replaces inline `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6` patterns.
 *
 * @param cols - Number of columns at desktop (1-4)
 * @param gap - Gap between items ('sm' | 'md' | 'lg')
 * @param responsive - Whether to apply responsive breakpoints (default: true)
 *
 * @example
 * <Grid cols={4} gap="md">
 *   {products.map(p => <ProductCard key={p.id} product={p} />)}
 * </Grid>
 */
export default function Grid({
  children,
  cols = 3,
  gap = 'md',
  responsive = true,
  className = '',
}: {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
  className?: string;
}) {
  const colsClasses = responsive
    ? {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      }
    : {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
      };

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  return (
    <div className={`grid ${colsClasses[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}
