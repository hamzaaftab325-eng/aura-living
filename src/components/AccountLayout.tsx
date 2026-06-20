'use client';

/**
 * AccountLayout — wraps the /account/* section.
 *
 * Currently a thin pass-through wrapper. The per-account view components
 * (AccountView, TrackOrdersView, AddressesView, SettingsView) already render
 * their own hero, breadcrumb, and content. This component exists so the App
 * Router `/account/layout.tsx` has a client-component root it can mount.
 *
 * If a shared sidebar / sub-nav is added later, it lives here.
 */
export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
