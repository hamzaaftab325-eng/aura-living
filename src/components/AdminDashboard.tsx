'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  LayoutDashboard, Package, ShoppingCart, BarChart3, Bell, Settings as SettingsIcon,
  TrendingUp, TrendingDown, DollarSign, Users, Eye, ArrowUpRight, Search,
  Filter, Download, Plus, Edit2, Trash2, AlertTriangle, CheckCircle,
  Clock, XCircle, ChevronRight, Menu, X, Package2, Star, ShoppingCart as CartIcon,
} from 'lucide-react';
import PremiumButton from '@/components/ui/PremiumButton';
import Link from 'next/link';
import { products, formatPKR, categories } from '@/data/products';
import { useGsapFadeIn, useGsapStagger } from '@/hooks/useGsap';

type Tab = 'overview' | 'inventory' | 'orders' | 'analytics' | 'notifications' | 'settings';

// ── Mock data ──
const mockOrders = [
  { id: 'AL-2026-001', customer: 'Ayesha Khan', date: 'Jun 19, 2026', status: 'Delivered', total: 12498, items: 3 },
  { id: 'AL-2026-002', customer: 'Omar Farooq', date: 'Jun 18, 2026', status: 'Shipped', total: 8999, items: 2 },
  { id: 'AL-2026-003', customer: 'Sana Malik', date: 'Jun 18, 2026', status: 'Processing', total: 5499, items: 1 },
  { id: 'AL-2026-004', customer: 'Fatima Noor', date: 'Jun 17, 2026', status: 'Delivered', total: 17998, items: 4 },
  { id: 'AL-2026-005', customer: 'Hassan Ali', date: 'Jun 17, 2026', status: 'Cancelled', total: 3499, items: 1 },
  { id: 'AL-2026-006', customer: 'Zara Sheikh', date: 'Jun 16, 2026', status: 'Shipped', total: 12999, items: 2 },
  { id: 'AL-2026-007', customer: 'Bilal Ahmed', date: 'Jun 16, 2026', status: 'Delivered', total: 7499, items: 2 },
  { id: 'AL-2026-008', customer: 'Mariam Iqbal', date: 'Jun 15, 2026', status: 'Processing', total: 22999, items: 5 },
];

const mockNotifications = [
  { id: 1, type: 'order', title: 'New order received', message: 'Order #AL-2026-008 from Mariam Iqbal', time: '5 min ago', read: false, icon: ShoppingCart },
  { id: 2, type: 'stock', title: 'Low stock alert', message: 'Crystal Drop Chandelier has only 3 units left', time: '1 hour ago', read: false, icon: AlertTriangle },
  { id: 3, type: 'review', title: 'New 5-star review', message: 'Hammered Brass Table Lamp received a 5-star review', time: '3 hours ago', read: false, icon: Star },
  { id: 4, type: 'order', title: 'Order shipped', message: 'Order #AL-2026-002 has been shipped via TCS', time: '5 hours ago', read: true, icon: Package },
  { id: 5, type: 'customer', title: 'New customer registered', message: 'Hassan Ali created an account', time: '8 hours ago', read: true, icon: Users },
  { id: 6, type: 'stock', title: 'Restock needed', message: 'Scented Wax Melt Trio is out of stock', time: '1 day ago', read: true, icon: XCircle },
];

const mockRevenue = [
  { month: 'Jan', revenue: 145000, orders: 45 },
  { month: 'Feb', revenue: 168000, orders: 52 },
  { month: 'Mar', revenue: 192000, orders: 61 },
  { month: 'Apr', revenue: 178000, orders: 55 },
  { month: 'May', revenue: 215000, orders: 68 },
  { month: 'Jun', revenue: 248000, orders: 74 },
];

const statusConfig: Record<string, { color: string; bg: string; icon: typeof CheckCircle }> = {
  Delivered: { color: 'var(--color-success)', bg: 'rgba(34, 197, 94, 0.1)', icon: CheckCircle },
  Shipped: { color: 'var(--color-info)', bg: 'rgba(59, 130, 246, 0.1)', icon: Package },
  Processing: { color: 'var(--color-gold)', bg: 'rgba(212, 175, 55, 0.1)', icon: Clock },
  Cancelled: { color: 'var(--color-danger)', bg: 'rgba(220, 38, 38, 0.1)', icon: XCircle },
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(mockNotifications);

  const fadeIn = useGsapFadeIn<HTMLDivElement>({ y: 20, duration: 0.4 });
  const stagger = useGsapStagger<HTMLDivElement>({ y: 20, duration: 0.4, stagger: 0.06, start: 'top 90%' });

  const totalRevenue = mockRevenue.reduce((sum, r) => sum + r.revenue, 0);
  const totalOrders = mockRevenue.reduce((sum, r) => sum + r.orders, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);
  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const navItems = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'inventory' as Tab, label: 'Inventory', icon: Package },
    { id: 'orders' as Tab, label: 'Orders', icon: ShoppingCart },
    { id: 'analytics' as Tab, label: 'Analytics', icon: BarChart3 },
    { id: 'notifications' as Tab, label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'settings' as Tab, label: 'Settings', icon: SettingsIcon },
  ];

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="w-full pt-24 sm:pt-28 min-h-screen flex" >
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-24 lg:top-28 left-0 z-40 w-64 h-[calc(100vh-6rem)] lg:h-[calc(100vh-7rem)] transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        
      >
        <div className="p-5 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 pb-5" style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" >
              <LayoutDashboard className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-white font-bold text-sm" >Admin Panel</p>
              <p className="text-white/40 text-[10px]" >Aura Living</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === item.id ? 'bg-gold/15 text-gold' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                style={{ fontSize: '14px', fontWeight: activeTab === item.id ? 600 : 400 }}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full text-[10px] font-bold text-white px-1.5 bg-gold">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>

          {/* Back to site */}
          <Link
            href="/"
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-white/40 hover:text-white hover:bg-white/5 cursor-pointer"
            style={{ fontSize: '14px', borderTop: '1px solid rgba(212,175,55,0.2)' }}
          >
            <ArrowUpRight className="w-4 h-4" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold" >
            {navItems.find(n => n.id === activeTab)?.label}
          </h1>
          <div className="w-10" />
        </div>

        {/* ═══ OVERVIEW ═══ */}
        {activeTab === 'overview' && (
          <div ref={fadeIn}>
            <h2 className="hidden lg:block text-2xl font-bold mb-1" >
              Dashboard Overview
            </h2>
            <p className="hidden lg:block aura-body-small text-muted-gray mb-6">Welcome back! Here&apos;s what&apos;s happening today.</p>

            {/* KPI Cards */}
            <div ref={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Revenue', value: formatPKR(totalRevenue), change: '+12.5%', up: true, icon: DollarSign },
                { label: 'Total Orders', value: totalOrders.toString(), change: '+8.2%', up: true, icon: ShoppingCart },
                { label: 'Avg Order Value', value: formatPKR(avgOrderValue), change: '+3.1%', up: true, icon: TrendingUp },
                { label: 'Products in Stock', value: products.filter(p => p.inStock).length.toString(), change: '-2', up: false, icon: Package },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-lg p-5" >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" >
                      <kpi.icon className="w-5 h-5 text-gold-text" />
                    </div>
                    <span className={`text-xs font-semibold flex items-center gap-0.5 ${kpi.up ? 'text-green-600' : 'text-red-500'}`}>
                      {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {kpi.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold" >
                    {kpi.value}
                  </p>
                  <p className="text-xs mt-1" >{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="rounded-lg p-6 mb-8" >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold" >
                    Revenue Overview
                  </h2>
                  <p className="text-xs" >Last 6 months</p>
                </div>
                <button className="text-xs font-medium text-gold-text flex items-center gap-1 cursor-pointer" >
                  <Download className="w-3 h-3" />
                  Export
                </button>
              </div>

              {/* Bar chart */}
              <div className="flex items-end justify-between gap-2 sm:gap-4 h-48">
                {mockRevenue.map((data, i) => {
                  const maxRevenue = Math.max(...mockRevenue.map(r => r.revenue));
                  const heightPercent = (data.revenue / maxRevenue) * 100;
                  return (
                    <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex flex-col justify-end" style={{ height: '100%' }}>
                        <div
                          className="w-full rounded-t-md transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                          style={{
                            height: `${heightPercent}%`,
                            background: 'linear-gradient(180deg, var(--color-gold) 0%, var(--color-gold-hover) 100%)',
                            minHeight: '8px' }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[10px] font-bold px-2 py-1 rounded bg-charcoal text-white" >
                            {formatPKR(data.revenue)}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px]" >{data.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Orders + Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="rounded-lg p-5" >
                <h2 className="text-lg font-bold mb-4" >
                  Recent Orders
                </h2>
                <div className="space-y-3">
                  {mockOrders.slice(0, 5).map((order) => {
                    const cfg = statusConfig[order.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <div key={order.id} className="flex items-center justify-between gap-3 py-2" style={{ borderBottom: '1px solid rgba(232,213,163,0.4)' }}>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold truncate" >
                            {order.customer}
                          </p>
                          <p className="text-[11px]" >
                            #{order.id} · {order.date}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                          <StatusIcon className="w-2.5 h-2.5" />
                          {order.status}
                        </span>
                        <span className="text-sm font-bold whitespace-nowrap" >
                          {formatPKR(order.total)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => setActiveTab('orders')} className="w-full text-center text-sm font-medium text-gold-text mt-4 hover:underline cursor-pointer" >
                  View All Orders
                </button>
              </div>

              {/* Top Products */}
              <div className="rounded-lg p-5" >
                <h2 className="text-lg font-bold mb-4" >
                  Top Products
                </h2>
                <div className="space-y-3">
                  {products.slice(0, 5).map((product, i) => (
                    <div key={product.id} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid rgba(232,213,163,0.4)' }}>
                      <span className="text-xs font-bold w-5" style={{ color: 'var(--color-gold)' }}>#{i + 1}</span>
                      <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 relative" >
                        <Image src={product.image} alt={product.name} fill className="w-full h-full object-contain" sizes="40px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate" >
                          {product.name}
                        </p>
                        <p className="text-[11px]" >
                          {product.reviews} reviews · ⭐ {product.rating}
                        </p>
                      </div>
                      <span className="text-sm font-bold" style={{ color: 'var(--color-gold-text)' }}>
                        {formatPKR(product.price)}
                      </span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab('inventory')} className="w-full text-center text-sm font-medium text-gold-text mt-4 hover:underline cursor-pointer" >
                  View All Products
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ INVENTORY ═══ */}
        {activeTab === 'inventory' && (
          <div ref={fadeIn}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold" >Inventory</h2>
                <p className="aura-body-small text-muted-gray">{products.length} products · {products.filter(p => p.inStock).length} in stock</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-md" style={{ border: '1.5px solid var(--color-gold-soft)' }}>
                  <Search className="w-4 h-4 ml-3 text-muted-gray" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="px-2 py-2 text-sm bg-transparent outline-none w-40 sm:w-56"
                    
                  />
                </div>
                <PremiumButton variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Add
                </PremiumButton>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-lg overflow-hidden" >
              <div className="overflow-x-auto">
                <table className="w-full" >
                  <thead>
                    <tr >
                      <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-semibold" >Product</th>
                      <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-semibold hidden sm:table-cell" >SKU</th>
                      <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-semibold hidden md:table-cell" >Category</th>
                      <th className="text-right py-3 px-4 text-xs uppercase tracking-wider font-semibold" >Price</th>
                      <th className="text-center py-3 px-4 text-xs uppercase tracking-wider font-semibold" >Stock</th>
                      <th className="text-right py-3 px-4 text-xs uppercase tracking-wider font-semibold" >Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="transition-colors hover:bg-gold/5" style={{ borderBottom: '1px solid rgba(232,213,163,0.3)' }}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 relative" >
                              <Image src={product.image} alt={product.name} fill className="w-full h-full object-contain" sizes="40px" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate" >{product.name}</p>
                              {product.badge && (
                                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded" style={{ color: 'var(--color-gold-text)' }}>
                                  {product.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm hidden sm:table-cell" >{product.sku || '—'}</td>
                        <td className="py-3 px-4 text-sm hidden md:table-cell" >
                          {categories.find(c => c.id === product.category)?.name || product.category}
                        </td>
                        <td className="py-3 px-4 text-right text-sm font-semibold" >{formatPKR(product.price)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold" style={{
                            backgroundColor: product.inStock ? 'rgba(34,197,94,0.1)' : 'rgba(220,38,38,0.1)',
                            color: product.inStock ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            {product.inStock ? <CheckCircle className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                            {product.inStock ? 'In Stock' : 'Out'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button aria-label="Edit product" className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-gold/10 cursor-pointer" >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button aria-label="Delete product" className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-red-50 hover:text-red-500 cursor-pointer" >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length === 0 && (
                <div className="py-12 text-center">
                  <Package2 className="w-10 h-10 mx-auto mb-2 text-muted-gray" />
                  <p className="text-sm text-muted-gray">No products found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ ORDERS ═══ */}
        {activeTab === 'orders' && (
          <div ref={fadeIn}>
            <h2 className="text-2xl font-bold mb-1" >Orders</h2>
            <p className="aura-body-small text-muted-gray mb-6">{mockOrders.length} total orders</p>

            <div className="rounded-lg overflow-hidden" >
              <div className="overflow-x-auto">
                <table className="w-full" >
                  <thead>
                    <tr >
                      <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-semibold" >Order ID</th>
                      <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-semibold" >Customer</th>
                      <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-semibold hidden sm:table-cell" >Date</th>
                      <th className="text-center py-3 px-4 text-xs uppercase tracking-wider font-semibold" >Items</th>
                      <th className="text-center py-3 px-4 text-xs uppercase tracking-wider font-semibold" >Status</th>
                      <th className="text-right py-3 px-4 text-xs uppercase tracking-wider font-semibold" >Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.map((order) => {
                      const cfg = statusConfig[order.status];
                      const StatusIcon = cfg.icon;
                      return (
                        <tr key={order.id} className="transition-colors hover:bg-gold/5 cursor-pointer" style={{ borderBottom: '1px solid rgba(232,213,163,0.3)' }}>
                          <td className="py-3 px-4 text-sm font-semibold" >#{order.id}</td>
                          <td className="py-3 px-4 text-sm" >{order.customer}</td>
                          <td className="py-3 px-4 text-sm hidden sm:table-cell" >{order.date}</td>
                          <td className="py-3 px-4 text-center text-sm" >{order.items}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                              <StatusIcon className="w-2.5 h-2.5" />
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-sm font-bold" >{formatPKR(order.total)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ANALYTICS ═══ */}
        {activeTab === 'analytics' && (
          <div ref={fadeIn}>
            <h2 className="text-2xl font-bold mb-1" >Analytics</h2>
            <p className="aura-body-small text-muted-gray mb-6">Business performance insights</p>

            {/* KPI Row */}
            <div ref={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Conversion Rate', value: '3.2%', change: '+0.5%', up: true },
                { label: 'Avg Session', value: '4m 32s', change: '+12s', up: true },
                { label: 'Bounce Rate', value: '38.5%', change: '-2.1%', up: true },
                { label: 'Page Views', value: '12.4K', change: '+8.7%', up: true },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-lg p-5" >
                  <p className="text-2xl font-bold mb-1" >{kpi.value}</p>
                  <p className="text-xs" >{kpi.label}</p>
                  <span className="text-[11px] font-semibold text-green-600 flex items-center gap-0.5 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    {kpi.change}
                  </span>
                </div>
              ))}
            </div>

            {/* Revenue + Orders Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="rounded-lg p-6" >
                <h2 className="text-lg font-bold mb-4" >Revenue Trend</h2>
                <div className="flex items-end justify-between gap-3 h-40">
                  {mockRevenue.map((data) => {
                    const maxRev = Math.max(...mockRevenue.map(r => r.revenue));
                    return (
                      <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full rounded-t-md" style={{
                          height: `${(data.revenue / maxRev) * 100}%`,
                          background: 'linear-gradient(180deg, var(--color-gold) 0%, var(--color-gold-hover) 100%)',
                          minHeight: '6px' }} />
                        <span className="text-[10px]" >{data.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg p-6" >
                <h2 className="text-lg font-bold mb-4" >Orders Trend</h2>
                <div className="flex items-end justify-between gap-3 h-40">
                  {mockRevenue.map((data) => {
                    const maxOrd = Math.max(...mockRevenue.map(r => r.orders));
                    return (
                      <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full rounded-t-md" style={{
                          height: `${(data.orders / maxOrd) * 100}%`,
                          background: 'linear-gradient(180deg, var(--surface-dark) 0%, #3A3A3A 100%)',
                          minHeight: '6px' }} />
                        <span className="text-[10px]" >{data.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="rounded-lg p-6" >
              <h2 className="text-lg font-bold mb-4" >Products by Category</h2>
              <div className="space-y-3">
                {categories.map((cat) => {
                  const count = products.filter(p => p.category === cat.id).length;
                  const percent = Math.round((count / products.length) * 100);
                  return (
                    <div key={cat.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm" >{cat.name}</span>
                        <span className="text-sm font-semibold" >{count} ({percent}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-gold-pale)' }}>
                        <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: 'var(--color-gold)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══ NOTIFICATIONS ═══ */}
        {activeTab === 'notifications' && (
          <div ref={fadeIn}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold" >Notifications</h2>
                <p className="aura-body-small text-muted-gray">{unreadCount} unread</p>
              </div>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-sm font-medium text-gold-text hover:underline cursor-pointer" >
                  Mark all as read
                </button>
              )}
            </div>

            <div ref={stagger} className="space-y-3">
              {notifications.map((notif) => {
                const NotifIcon = notif.icon;
                return (
                  <div
                    key={notif.id}
                    className="rounded-lg p-4 flex items-start gap-4 transition-all"
                    style={{
                      backgroundColor: notif.read ? 'var(--surface-card)' : 'rgba(212,175,55,0.05)',
                      border: notif.read ? '1px solid var(--color-gold-soft)' : '1px solid rgba(212,175,55,0.3)' }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{
                      backgroundColor: notif.type === 'stock' ? 'rgba(220,38,38,0.1)' : 'rgba(212,175,55,0.1)' }}>
                      <NotifIcon className="w-5 h-5" style={{ color: notif.type === 'stock' ? 'var(--color-danger)' : 'var(--color-gold)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold" >
                          {notif.title}
                        </p>
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-gold shrink-0" />}
                      </div>
                      <p className="text-sm" >
                        {notif.message}
                      </p>
                      <p className="text-[11px] mt-1" >
                        {notif.time}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-gray shrink-0 mt-1" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ SETTINGS ═══ */}
        {activeTab === 'settings' && (
          <div ref={fadeIn}>
            <h2 className="text-2xl font-bold mb-6" >Admin Settings</h2>

            <div className="rounded-lg p-6 mb-6" >
              <h2 className="text-lg font-bold mb-4" >Store Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wide font-medium block mb-1.5" >Store Name</label>
                  <input type="text" defaultValue="Aura Living" className="w-full px-3 py-2.5 rounded-md text-sm outline-none" style={{ border: '1.5px solid var(--color-gold-soft)' }} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide font-medium block mb-1.5" >Currency</label>
                  <select className="w-full px-3 py-2.5 rounded-md text-sm outline-none" style={{ border: '1.5px solid var(--color-gold-soft)' }}>
                    <option>PKR — Pakistani Rupee</option>
                    <option>USD — US Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide font-medium block mb-1.5" >Free Shipping Threshold</label>
                  <input type="text" defaultValue="2999" className="w-full px-3 py-2.5 rounded-md text-sm outline-none" style={{ border: '1.5px solid var(--color-gold-soft)' }} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide font-medium block mb-1.5" >Tax Rate (%)</label>
                  <input type="text" defaultValue="0" className="w-full px-3 py-2.5 rounded-md text-sm outline-none" style={{ border: '1.5px solid var(--color-gold-soft)' }} />
                </div>
              </div>
              <PremiumButton variant="primary" className="mt-4">
                Save Changes
              </PremiumButton>
            </div>

            <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(220,38,38,0.03)', border: '1px solid rgba(220,38,38,0.2)' }}>
              <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--color-danger)' }}>Danger Zone</h2>
              <p className="text-sm mb-4" >
                Reset all store data, clear cache, or delete the store entirely. These actions are irreversible.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider cursor-pointer" style={{ backgroundColor: 'var(--color-danger)' }}>
                  Reset Store Data
                </button>
                <button className="px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider cursor-pointer" style={{ border: '1px solid var(--color-danger)', color: 'var(--color-danger)', backgroundColor: 'transparent' }}>
                  Clear Cache
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
