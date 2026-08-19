import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { OrderDeleteButton } from "@/components/admin/order-delete-button";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { isAdmin } from "@/lib/auth";
import { formatPKR } from "@/lib/catalog";
import { getOrderWithItems } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function AdminOrderDetail({ params }: { params: Params }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const record = await getOrderWithItems(Number(id));
  if (!record) notFound();
  const { order, items } = record;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/orders" className="text-[12px] text-[#00a0ac]">
            ← Orders
          </Link>
          <h1 className="mt-2 text-xl font-semibold">Order {order.orderNumber}</h1>
          <p className="mt-1 text-[13px] text-[#6d7175]">
            Placed {new Date(order.createdAt).toLocaleString("en-PK")} · {order.paymentMethod.toUpperCase()}
          </p>
        </div>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-[#6d7175]">Fulfilment status</span>
            <OrderStatusSelect id={order.id} status={order.status} />
            <span className="rounded bg-[#f1f2f3] px-2 py-0.5 text-[11px] capitalize">{order.status}</span>
          </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="rounded-lg border border-[#e3e5e7] bg-white">
          <p className="border-b border-[#e3e5e7] px-5 py-3 text-[13px] font-semibold">
            Line items ({items.length})
          </p>
          <div className="divide-y divide-[#f1f2f3]">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={item.title} className="h-16 w-12 rounded object-cover" />
                <div className="flex-1">
                  <p className="text-[13px] font-medium">{item.title}</p>
                  <p className="text-[11px] text-[#8c9196]">
                    {item.variant ? `Size ${item.variant} · ` : ""}SKU #{item.productId}
                  </p>
                </div>
                <p className="w-20 text-[12px] text-[#6d7175]">× {item.quantity}</p>
                <p className="w-24 text-right text-[13px] font-medium">{formatPKR(item.lineTotal)}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-[#e3e5e7] px-5 py-4 text-[13px]">
            <div className="flex justify-between">
              <span className="text-[#6d7175]">Subtotal</span>
              <span>{formatPKR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6d7175]">Delivery</span>
              <span>{order.shipping === 0 ? "Free" : formatPKR(order.shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-[#f1f2f3] pt-2 text-[15px] font-semibold">
              <span>Total</span>
              <span>{formatPKR(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-[#e3e5e7] bg-white p-5 text-[13px]">
            <p className="text-[13px] font-semibold">Customer</p>
            <div className="mt-3 space-y-1 text-[#6d7175]">
              <p className="text-[#202223]">{order.customerName}</p>
              <p>{order.email}</p>
              <p>{order.phone || "—"}</p>
            </div>
          </div>
          <div className="rounded-lg border border-[#e3e5e7] bg-white p-5 text-[13px]">
            <p className="text-[13px] font-semibold">Delivery address</p>
            <div className="mt-3 space-y-1 text-[#6d7175]">
              <p>{order.address || "—"}</p>
              <p>
                {order.city} {order.postalCode}
              </p>
            </div>
          </div>
          {order.notes && (
            <div className="rounded-lg border border-[#e3e5e7] bg-white p-5 text-[13px]">
              <p className="text-[13px] font-semibold">Notes</p>
              <p className="mt-3 text-[#6d7175]">{order.notes}</p>
            </div>
          )}
          <Link
            href={`/track?order=${order.orderNumber}`}
            target="_blank"
            className="block rounded border border-[#c9cccf] bg-white px-4 py-2.5 text-center text-[13px] hover:bg-[#f4f5f7]"
          >
            Open customer tracking page ↗
          </Link>
          <div className="rounded-lg border border-[#ffd7d2] bg-[#fffaf9] p-5">
            <p className="text-[13px] font-semibold text-[#d72c0d]">Danger zone</p>
            <p className="mt-1 text-[12px] text-[#6d7175]">
              Deleting removes this order and its line items from order history permanently.
            </p>
            <div className="mt-3">
              <OrderDeleteButton
                id={order.id}
                orderNumber={order.orderNumber}
                redirectTo="/admin/orders"
                label="Delete this order"
                variant="button"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
