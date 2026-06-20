'use client';

interface FormRowProps {
  children: React.ReactNode;
  className?: string;
  /** Use grid for 2-column layout on sm+ screens */
  cols?: 1 | 2 | 3;
}

/**
 * Layout wrapper for form fields. Use cols=2 for first/last name style pairs.
 */
export default function FormRow({ children, className = '', cols = 1 }: FormRowProps) {
  const gridClass = cols === 2 ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : cols === 3 ? 'grid grid-cols-1 sm:grid-cols-3 gap-4' : 'flex flex-col gap-4';
  return <div className={`${gridClass} ${className}`}>{children}</div>;
}
