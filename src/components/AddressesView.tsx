'use client';

import { useState } from 'react';
import {
  useGsapFadeIn,
  useGsapStagger,
  useGsapBlurText,
} from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import {
  MapPin,
  Plus,
  ChevronRight,
  Home,
  Briefcase,
  Edit2,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import PremiumButton from '@/components/ui/PremiumButton';
import { useToast } from '@/hooks/use-toast';
import Breadcrumb from '@/components/ui/Breadcrumb';

/* ═══════════════════════════════════════════════════════════
   AnimatedSection — staggered children reveal
   ═══════════════════════════════════════════════════════════ */
function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useGsapStagger<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.12,
    delay: 0.15,
    ease: 'power3.out',
    start: 'top 80%',
  });
  return <div ref={ref} className={className}>{children}</div>;
}

/* ═══════════════════════════════════════════════════════════
   Address type
   ═══════════════════════════════════════════════════════════ */
interface Address {
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

const initialAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    name: 'Ayesha Khan',
    phone: '+92 300 1234567',
    line1: 'House 24, Block C, Model Town',
    line2: 'Near Central Park',
    city: 'Lahore',
    province: 'Punjab',
    postal: '54000',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Work',
    name: 'Ayesha Khan',
    phone: '+92 300 1234567',
    line1: 'Office 7B, Arfa Software Technology Park',
    line2: 'Ferozepur Road',
    city: 'Lahore',
    province: 'Punjab',
    postal: '54000',
    isDefault: false,
  },
];

const labelConfig: Record<Address['label'], { icon: typeof Home; color: string; bg: string }> = {
  Home: { icon: Home, color: 'var(--color-gold)', bg: 'rgba(212, 175, 55, 0.1)' },
  Work: { icon: Briefcase, color: 'var(--color-info)', bg: 'rgba(59, 130, 246, 0.1)' },
  Other: { icon: MapPin, color: 'var(--color-muted-gray)', bg: 'rgba(138, 138, 138, 0.1)' },
};

const emptyForm: Omit<Address, 'id' | 'isDefault'> = {
  label: 'Home',
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  province: '',
  postal: '',
};

export default function AddressesView() {
  const setPage = useStore((state) => state.setPage);
  const user = useStore((state) => state.user);
  const { toast } = useToast();

  // Hydration guard
  const [hydrated, setHydrated] = useState(false);
  useState(() => { Promise.resolve().then(() => setHydrated(true)); });
  const safeUser = hydrated ? user : null;

  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Address, 'id' | 'isDefault'>>(emptyForm);

  // GSAP refs
  const headerRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.7 });
  const heroTitleRef = useGsapBlurText<HTMLHeadingElement>({ duration: 0.5, stagger: 0.03, start: 'top 90%' });
  const cardsRef = useGsapStagger<HTMLDivElement>({
    selector: ':scope > div',
    y: 30,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
    start: 'top 85%',
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleOpenAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setForm({
      label: addr.label,
      name: addr.name,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 ?? '',
      city: addr.city,
      province: addr.province,
      postal: addr.postal,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.line1.trim() || !form.city.trim() || !form.postal.trim()) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields.', variant: 'destructive' });
      return;
    }
    if (editingId) {
      // Edit existing
      setAddresses((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...form } : a)));
      toast({ title: 'Address updated', description: 'Your changes have been saved.' });
    } else {
      // Add new
      const newAddr: Address = {
        ...form,
        id: `addr-${Date.now()}`,
        isDefault: addresses.length === 0, // first address becomes default
      };
      setAddresses((prev) => [...prev, newAddr]);
      toast({ title: 'Address added', description: 'New address has been saved successfully.' });
    }
    resetForm();
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    toast({
      title: 'Default address updated',
      description: 'Future orders will ship to this address by default.',
    });
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast({
      title: 'Address removed',
      description: 'The saved address has been deleted.',
    });
  };

  // Not-signed-in gate
  if (hydrated && !safeUser) {
    return (
      <div className="w-full page-transition" style={{ backgroundColor: 'var(--surface-page)' }}>
        <section className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden flex items-center justify-center">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: 'url(/images/pages/account-hero.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(44,44,44,0.8) 0%, rgba(44,44,44,0.5) 50%, rgba(212,175,55,0.15) 100%)',
            }}
          />
          <div ref={headerRef} className="relative z-10 flex flex-col items-center text-center px-4">
            <h1
              ref={heroTitleRef}
              className="aura-hero-title text-white"
              
            >
              Saved Addresses
            </h1>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
              <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
            </div>
          </div>
        </section>
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center rounded-xl p-8 sm:p-10" style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--color-gold-soft)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(212,175,55,0.1)', border: '1px dashed rgba(212,175,55,0.4)' }}>
              <MapPin className="w-8 h-8" style={{ color: 'var(--color-gold-text)' }} />
            </div>
            <h2 className="text-[var(--surface-dark)] text-[28px] sm:text-[32px] lg:text-[40px] font-bold mb-3" >
              Sign in to manage addresses
            </h2>
            <p className="text-[var(--color-warm-gray)] text-sm sm:text-base mb-6" >
              Save delivery addresses for faster checkout and easy reordering.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <PremiumButton variant="gold" size="sm" onClick={() => setPage('login')}>Sign In</PremiumButton>
              <button
                onClick={() => setPage('signup')}
                className="text-xs sm:text-sm font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
                style={{ color: 'var(--color-gold)', background: 'none' }}
              >
                Create a free account
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full page-transition" style={{ backgroundColor: 'var(--surface-page)' }}>
      {/* Hero */}
      <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'url(/images/pages/account-hero.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(44,44,44,0.8) 0%, rgba(44,44,44,0.5) 50%, rgba(212,175,55,0.15) 100%)',
          }}
        />

        <div ref={headerRef} className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
          <h1
            ref={heroTitleRef}
            className="aura-hero-title text-white"
            
          >
            Saved Addresses
          </h1>

          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
          </div>

          <p
            className="text-white/80 text-base sm:text-lg max-w-md mx-auto mt-4 leading-relaxed"
            
          >
            Manage delivery addresses for faster, smoother checkouts.
          </p>
        </div>
      </section>

      {/* Breadcrumb strip (below hero) */}
      <Breadcrumb
        items={[
          { label: 'My Account', onClick: () => { setPage('account'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
          { label: 'Saved Addresses' },
        ]}
      />

      {/* Addresses */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Add new address CTA */}
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-10 rounded-xl p-5 sm:p-6" style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--color-gold-soft)' }}>
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}>
                  <Plus className="w-5 h-5" style={{ color: 'var(--color-gold-text)' }} />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-semibold" style={{ color: 'var(--surface-dark)' }}>
                    {editingId ? 'Edit address' : 'Add a new address'}
                  </p>
                  <p className="text-xs sm:text-sm" style={{ color: 'var(--color-muted-gray)' }}>
                    Save home, work, or other delivery locations.
                  </p>
                </div>
              </div>
              {!showForm && (
                <PremiumButton variant="gold" size="sm" onClick={handleOpenAdd}>
                  Add Address
                </PremiumButton>
              )}
            </div>
          </AnimatedSection>

          {/* Add/Edit form */}
          {showForm && (
            <AnimatedSection>
              <form
                onSubmit={handleSave}
                className="rounded-xl p-5 sm:p-7 mb-8 sm:mb-10"
                style={{ backgroundColor: 'var(--surface-card)', border: '1.5px solid var(--color-gold)' }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--surface-dark)' }}>
                    {editingId ? 'Edit Address' : 'New Address'}
                  </h3>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--color-gold-soft)]/30"
                    style={{ color: 'var(--color-muted-gray)' }}
                    aria-label="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mb-5"><GoldDivider /></div>

                {/* Label selector */}
                <div className="mb-5">
                  <label className="text-xs font-medium tracking-wide uppercase block mb-2" style={{ color: 'var(--color-muted-gray)' }}>
                    Address Type
                  </label>
                  <div className="flex gap-2">
                    {(['Home', 'Work', 'Other'] as const).map((lbl) => {
                      const cfg = labelConfig[lbl];
                      const Icon = cfg.icon;
                      const selected = form.label === lbl;
                      return (
                        <button
                          key={lbl}
                          type="button"
                          onClick={() => setForm({ ...form, label: lbl })}
                          className="flex items-center gap-2 py-2 px-4 rounded-sm text-sm font-medium transition-all duration-200 cursor-pointer"
                          style={{ border: selected ? `1.5px solid ${cfg.color}` : '1px solid var(--color-gold-soft)',
                            backgroundColor: selected ? cfg.bg : 'transparent',
                            color: selected ? cfg.color : 'var(--color-warm-gray)',
                          }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {lbl}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-medium tracking-wide uppercase block mb-2" style={{ color: 'var(--color-muted-gray)' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Ayesha Khan"
                      className="w-full px-3 py-2.5 rounded-sm text-sm outline-none transition-colors"
                      style={{ color: 'var(--surface-dark)',
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        border: '1px solid var(--color-gold-soft)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium tracking-wide uppercase block mb-2" style={{ color: 'var(--color-muted-gray)' }}>
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+92 300 1234567"
                      className="w-full px-3 py-2.5 rounded-sm text-sm outline-none transition-colors"
                      style={{ color: 'var(--surface-dark)',
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        border: '1px solid var(--color-gold-soft)',
                      }}
                    />
                  </div>
                </div>

                {/* Address line 1 */}
                <div className="mb-4">
                  <label className="text-xs font-medium tracking-wide uppercase block mb-2" style={{ color: 'var(--color-muted-gray)' }}>
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.line1}
                    onChange={(e) => setForm({ ...form, line1: e.target.value })}
                    placeholder="House #, Block, Street"
                    className="w-full px-3 py-2.5 rounded-sm text-sm outline-none transition-colors"
                    style={{ color: 'var(--surface-dark)',
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      border: '1px solid var(--color-gold-soft)',
                    }}
                  />
                </div>

                {/* Address line 2 */}
                <div className="mb-4">
                  <label className="text-xs font-medium tracking-wide uppercase block mb-2" style={{ color: 'var(--color-muted-gray)' }}>
                    Apartment / Suite / Landmark (optional)
                  </label>
                  <input
                    type="text"
                    value={form.line2 ?? ''}
                    onChange={(e) => setForm({ ...form, line2: e.target.value })}
                    placeholder="Near Central Park"
                    className="w-full px-3 py-2.5 rounded-sm text-sm outline-none transition-colors"
                    style={{ color: 'var(--surface-dark)',
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      border: '1px solid var(--color-gold-soft)',
                    }}
                  />
                </div>

                {/* City + Province + Postal */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="text-xs font-medium tracking-wide uppercase block mb-2" style={{ color: 'var(--color-muted-gray)' }}>
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="Lahore"
                      className="w-full px-3 py-2.5 rounded-sm text-sm outline-none transition-colors"
                      style={{ color: 'var(--surface-dark)',
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        border: '1px solid var(--color-gold-soft)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium tracking-wide uppercase block mb-2" style={{ color: 'var(--color-muted-gray)' }}>
                      Province *
                    </label>
                    <select
                      required
                      value={form.province}
                      onChange={(e) => setForm({ ...form, province: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-sm text-sm outline-none transition-colors"
                      style={{ color: 'var(--surface-dark)',
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        border: '1px solid var(--color-gold-soft)',
                      }}
                    >
                      <option value="">Select</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="KPK">KPK</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                      <option value="AJK">AJK</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium tracking-wide uppercase block mb-2" style={{ color: 'var(--color-muted-gray)' }}>
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.postal}
                      onChange={(e) => setForm({ ...form, postal: e.target.value })}
                      placeholder="54000"
                      className="w-full px-3 py-2.5 rounded-sm text-sm outline-none transition-colors"
                      style={{ color: 'var(--surface-dark)',
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        border: '1px solid var(--color-gold-soft)',
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <PremiumButton variant="gold" size="sm" type="submit">
                    {editingId ? 'Save Changes' : 'Save Address'}
                  </PremiumButton>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-sm font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
                    style={{ color: 'var(--color-muted-gray)', background: 'none' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </AnimatedSection>
          )}

          {/* Address cards */}
          <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {addresses.map((addr) => {
              const cfg = labelConfig[addr.label];
              const LabelIcon = cfg.icon;
              return (
                <div
                  key={addr.id}
                  className="relative rounded-xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:border-[var(--color-gold)]"
                  style={{ backgroundColor: 'var(--surface-card)',
                    border: addr.isDefault ? '1.5px solid var(--color-gold)' : '1px solid var(--color-gold-soft)',
                  }}
                >
                  {addr.isDefault && (
                    <span
                      className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: 'var(--color-gold)' }}
                    >
                      <Check className="w-3 h-3" />
                      Default
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: cfg.bg }}>
                      <LabelIcon className="w-4 h-4" style={{ color: cfg.color }} />
                    </div>
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: cfg.color }}
                    >
                      {addr.label}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-semibold mb-1" style={{ color: 'var(--surface-dark)' }}>
                    {addr.name}
                  </p>
                  <p className="text-xs sm:text-sm mb-3" style={{ color: 'var(--color-muted-gray)' }}>
                    {addr.phone}
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--color-warm-gray)' }}>
                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                    {addr.city}, {addr.province} — {addr.postal}
                  </p>

                  <div className="flex items-center gap-2 mt-5 pt-4" style={{ borderTop: '1px solid var(--color-gold-soft)' }}>
                    <button
                      onClick={() => handleOpenEdit(addr)}
                      className="inline-flex items-center gap-1 text-xs font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
                      style={{ color: 'var(--color-gold)', background: 'none' }}
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                    {!addr.isDefault && (
                      <>
                        <span style={{ color: 'var(--color-gold-soft)' }}>·</span>
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="inline-flex items-center gap-1 text-xs font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
                          style={{ color: 'var(--color-gold)', background: 'none' }}
                        >
                          <Check className="w-3 h-3" />
                          Set Default
                        </button>
                      </>
                    )}
                    <span style={{ color: 'var(--color-gold-soft)' }}>·</span>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="inline-flex items-center gap-1 text-xs font-medium transition-colors duration-200 hover:text-red-600 cursor-pointer ml-auto"
                      style={{ color: 'var(--color-danger)', background: 'none' }}
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {addresses.length === 0 && (
            <div className="text-center py-12 rounded-xl" style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--color-gold-soft)' }}>
              <MapPin className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--color-gold)' }} />
              <h3 className="text-[var(--surface-dark)] text-lg font-semibold mb-1" >
                No saved addresses yet
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-muted-gray)' }}>
                Add an address to speed up your next checkout.
              </p>
            </div>
          )}

          {/* Back to account */}
          <div className="text-center mt-10 sm:mt-14">
            <button
              onClick={() => { setPage('account'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
              style={{ color: 'var(--color-gold)', background: 'none' }}
            >
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              Back to My Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
