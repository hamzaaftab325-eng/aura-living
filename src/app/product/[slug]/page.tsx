import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products, getProductBySlug } from '@/data/products';
import ProductDetailView from '@/components/ProductDetailView';

// Pre-render all product pages at build time
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

// Per-product metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Aura Living',
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
      type: 'website',
      title,
      description,
      url: `https://auraliving.com${canonical}`,
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
      card: 'summary_large_image',
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
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
