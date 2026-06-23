'use client';

/**
 * GsapInitializer — client component that imports the GSAP registration
 * file. This ensures ScrollTrigger is registered before any component
 * uses it.
 *
 * Place this in the root layout (it renders nothing visible).
 */

import '@/lib/gsap-register';

export default function GsapInitializer() {
  return null;
}
