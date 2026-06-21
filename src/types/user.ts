/**
 * User and account-related type definitions.
 */

export interface User {
  name: string;
  email: string;
  memberSince: string;
  rewardsPoints: number;
}

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postal: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled';
  total: string;
  items: OrderItem[];
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface TrackedOrder {
  id: string;
  status: 'Delivered' | 'Shipped' | 'Processing';
  date: string;
  total: number;
  items: { name: string; qty: number; image: string }[];
  trackingSteps: {
    label: string;
    date: string;
    done: boolean;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}
