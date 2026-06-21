/**
 * Container — Standardized content width wrapper.
 *
 * Ensures consistent max-width and horizontal padding across all pages.
 * Replaces inline `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` patterns.
 *
 * @param maxWidth - Width variant ('narrow' | 'default' | 'wide' | 'full')
 * @param padding - Horizontal padding ('none' | 'sm' | 'default')
 *
 * @example
 * <Container maxWidth="wide">
 *   <Grid cols={4}>...</Grid>
 * </Container>
 */
export default function Container({
  children,
  maxWidth = 'default',
  padding = 'default',
  className = '',
}: {
  children: React.ReactNode;
  maxWidth?: 'narrow' | 'default' | 'wide' | 'full';
  padding?: 'none' | 'sm' | 'default';
  className?: string;
}) {
  const widthClasses = {
    narrow: 'max-w-3xl',
    default: 'max-w-7xl',
    wide: 'max-w-[90rem]',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-2 sm:px-4',
    default: 'px-4 sm:px-6 lg:px-8',
  };

  return (
    <div className={`${widthClasses[maxWidth]} mx-auto ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}
