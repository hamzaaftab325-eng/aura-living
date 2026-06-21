// Barrel export for UI primitives
// All reusable UI components are exported from here for clean imports:
//   import { PremiumButton, Input, Card } from '@/components/ui';

// ─── Button System (3 variants only) ───
export { default as PremiumButton } from './PremiumButton';
export { default as SaveButton } from './SaveButton';

// ─── Form Primitives ───
export { default as Input } from './Input';
export { default as Select } from './Select';
export { default as Textarea } from './Textarea';
export { default as Checkbox } from './Checkbox';
export { default as RadioGroup } from './RadioGroup';
export { default as FormRow } from './FormRow';

// ─── Layout Primitives ───
export { default as Card } from './Card';
export { default as Badge } from './Badge';
export { default as Breadcrumb } from './Breadcrumb';
export { default as Tabs } from './Tabs';
export { default as Modal } from './Modal';
export { default as Pagination } from './Pagination';

// ─── Content Primitives ───
export { default as SectionHeader } from './SectionHeader';
export { default as SectionDivider } from './SectionDivider';
export { default as EmptyState } from './EmptyState';
export { default as ErrorState } from './ErrorState';

// ─── Product Primitives ───
export { default as PriceTag } from './PriceTag';
export { default as RatingStars } from './RatingStars';

// ─── Trust Primitives ───
export { default as TrustBadge } from './TrustBadge';

// ─── Feedback Primitives ───
export { ProductCardSkeleton, ProductGridSkeleton, CardSkeleton, HeroSkeleton } from './Skeletons';
