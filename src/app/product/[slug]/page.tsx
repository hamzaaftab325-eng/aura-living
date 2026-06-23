import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  getAllProductSlugs,
} from "@/lib/products";
import ProductDetailView from "@/components/ProductDetailView";

// Revalidate every 1 hour (ISR — incremental static regeneration)
export const revalidate = 3600;

/**
 * Pre-render the top product pages at build time.
 * The rest will be generated on-demand (ISR).
 */
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  // Pre-render all products (we have 45, which is manageable)
  return slugs.map((slug) => ({ slug }));
}

/**
 * Per-product metadata for SEO.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Aura Living",
      robots: { index: false, follow: true },
    };
  }

  const title = `${product.name} | Aura Living`;
  const description = product.description;
  const canonical = `/product/${product.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, excluding current)
  const related = await getRelatedProducts(product.id, 4);

  return <ProductDetailView product={product} relatedProducts={related} />;
}
