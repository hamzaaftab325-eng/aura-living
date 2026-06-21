/**
 * Avatar — User initials avatar with brand styling.
 *
 * Displays a circular avatar with the user's first initial.
 * Used in testimonials, reviews, and account sections.
 *
 * @param name - Person's name (first letter used for initial)
 * @param size - Avatar size in pixels ('sm' | 'md' | 'lg')
 *
 * @example
 * <Avatar name="Ayesha Khan" size="md" />
 */
export default function Avatar({
  name,
  size = 'md',
  className = '',
}: {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const initial = name.charAt(0).toUpperCase();

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-11 h-11 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center aura-bg-gold-tint aura-border-gold-tint ${className}`}
      aria-hidden="true"
    >
      <span className="font-bold aura-text-gold" style={{ fontFamily: 'var(--font-playfair), serif' }}>
        {initial}
      </span>
    </div>
  );
}
