import Container from './Container';

/**
 * Section — Standardized page section with responsive padding + container.
 *
 * Combines section padding (vertical rhythm) with Container (max-width + horizontal padding).
 * Replaces inline `<section className="py-16 px-4 sm:px-6 lg:px-8"><div className="max-w-7xl mx-auto">` patterns.
 *
 * @param padding - Vertical padding variant ('sm' | 'default' | 'lg' | 'cta')
 * @param maxWidth - Container width variant ('narrow' | 'default' | 'wide' | 'full')
 * @param bg - Background color variant ('page' | 'card' | 'accent' | 'dark' | 'none')
 *
 * @example
 * <Section padding="lg" maxWidth="wide" bg="accent">
 *   <Grid cols={4}>{products}</Grid>
 * </Section>
 */
export default function Section({
  children,
  padding = 'default',
  maxWidth = 'default',
  bg = 'none',
  className = '',
  id,
}: {
  children: React.ReactNode;
  padding?: 'sm' | 'default' | 'lg' | 'cta';
  maxWidth?: 'narrow' | 'default' | 'wide' | 'full';
  bg?: 'page' | 'card' | 'accent' | 'dark' | 'none';
  className?: string;
  id?: string;
}) {
  const paddingClasses = {
    sm: 'aura-section-sm',
    default: 'aura-section',
    lg: 'aura-section-lg',
    cta: 'aura-section-cta',
  };

  const bgClasses = {
    page: 'aura-surface-page',
    card: 'aura-surface-card',
    accent: 'aura-surface-accent',
    dark: 'aura-surface-dark',
    none: '',
  };

  return (
    <section id={id} className={`${paddingClasses[padding]} ${bgClasses[bg]} ${className}`}>
      <Container maxWidth={maxWidth}>{children}</Container>
    </section>
  );
}
