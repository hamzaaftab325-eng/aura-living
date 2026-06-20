'use client';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Use aura-card or aura-card-flat preset, or pass 'none' to opt-out */
  preset?: 'card' | 'flat' | 'none';
  onClick?: () => void;
  /** ARIA role when card is interactive */
  role?: 'button' | 'article' | 'group';
  ariaLabel?: string;
  style?: React.CSSProperties;
}

/**
 * Reusable card. Uses .aura-card CSS class for tokens + shadows.
 * When onClick is provided and role='button', adds keyboard handler.
 */
export default function Card({
  children,
  className = '',
  preset = 'card',
  onClick,
  role,
  ariaLabel,
  style }: CardProps) {
  const presetClass =
    preset === 'card' ? 'aura-card' : preset === 'flat' ? 'aura-card-flat' : '';

  const isInteractive = onClick && role === 'button';

  return (
    <div
      className={`${presetClass} ${className}`}
      onClick={onClick}
      role={isInteractive ? 'button' : role}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={ariaLabel}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      style={style}
    >
      {children}
    </div>
  );
}
