import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOrderById } from "@/lib/orders";
import { headers } from "next/headers";
import OrderDetailView from "@/components/OrderDetailView";

export const metadata: Metadata = {
  title: "Order Details | Aura Living",
  description: "View your order details and tracking information.",
  alternates: { canonical: "/account/orders" },
  robots: { index: false, follow: false },
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    notFound();
  }

  const order = await getOrderById(id, session!.user.id);

  if (!order) {
    notFound();
  }

  return <OrderDetailView order={order} />;
}
