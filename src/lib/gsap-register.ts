/**
 * ============================================================================
 * GSAP Global Plugin Registration
 * ============================================================================
 *
 * This file ensures ScrollTrigger is registered with GSAP globally before
 * ANY component uses it. Import this file once in the root layout.
 *
 * Without this, production builds can fail with:
 *   "Please gsap.registerPlugin(ScrollTrigger)"
 *   "eh is not a function"
 *
 * Because code-splitting causes ScrollTrigger to load AFTER components
 * that try to use it.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register plugins globally — idempotent (safe to call multiple times)
gsap.registerPlugin(useGSAP, ScrollTrigger);

// Configure ScrollTrigger defaults
ScrollTrigger.config({
  // Ignore mobile resize events that cause false triggers
  ignoreMobileResize: true,
});

// Re-export so components can import from one place
export { gsap, ScrollTrigger, useGSAP };
