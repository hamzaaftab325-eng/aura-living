// Barrel export for UI primitives
// All reusable UI components are exported from here for clean imports:
//   import { PremiumButton, Input, ProductCard } from '@/components/ui';

// ─── Button System (3 variants only) ───
export { default as PremiumButton } from './PremiumButton';
export { default as SaveButton } from './SaveButton';

// ─── Form Primitives ───
export { default as Input } from './Input';
export { default as Select } from './Select';
export { default as Textarea } from './Textarea';
export { default as Checkbox } from './Checkbox';
export { default as RadioGroup } from './RadioGroup';
export { default as Switch } from './Switch';
export { default as FormField } from './FormField';
export { default as FormRow } from './FormRow';

// ─── Layout Primitives ───
export { default as Container } from './Container';
export { default as Grid } from './Grid';
export { default as Section } from './Section';
export { default as Card } from './Card';
export { default as Badge } from './Badge';
export { default as Breadcrumb } from './Breadcrumb';
export { default as Tabs } from './Tabs';
export { default as Modal } from './Modal';
export { default as Pagination } from './Pagination';
export { default as Tooltip } from './Tooltip';

// ─── Content Primitives ───
export { default as SectionHeader } from './SectionHeader';
export { default as SectionDivider } from './SectionDivider';
export { default as EmptyState } from './EmptyState';
export { default as ErrorState } from './ErrorState';
export { default as Accordion } from './Accordion';
export { default as Chip } from './Chip';

// ─── Product Primitives ───
export { default as ProductCard } from './ProductCard';
export { default as CategoryCard } from './CategoryCard';
export { default as BlogCard } from './BlogCard';
export { default as PriceTag } from './PriceTag';
export { default as PriceDisplay } from './PriceDisplay';
export { default as RatingStars } from './RatingStars';
export { default as QuantitySelector } from './QuantitySelector';

// ─── Trust + Status Primitives ───
export { default as TrustBadge } from './TrustBadge';
export { default as OrderRow } from './OrderRow';

// ─── User Primitives ───
export { default as Avatar } from './Avatar';
export { default as SearchBar } from './SearchBar';

// ─── Feedback Primitives ───
export { ProductCardSkeleton, ProductGridSkeleton, CardSkeleton, HeroSkeleton } from './Skeletons';
