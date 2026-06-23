import Link from "next/link";
import PremiumButton from "@/components/ui/PremiumButton";
import { ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 pt-28 pb-16">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <span className="text-[120px] font-bold aura-text-gold leading-none">404</span>
        </div>
        <h1 className="aura-h2 mb-4">Product Not Found</h1>
        <p className="text-sm aura-text-secondary mb-8 leading-relaxed">
          We&apos;re sorry — the product you&apos;re looking for doesn&apos;t exist or has been removed.
          Perhaps you&apos;d like to browse our full collection instead?
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <PremiumButton variant="primary" href="/shop" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Browse All Products
          </PremiumButton>
          <PremiumButton variant="secondary" href="/">
            Back to Home
          </PremiumButton>
        </div>
      </div>
    </div>
  );
}
