import Link from "next/link";
import { redirect } from "next/navigation";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { isAdmin } from "@/lib/auth";
import { formatPKR } from "@/lib/catalog";
import { listOrders } from "@/lib/queries";

export const dynamic = "force-dynamic";

const TABS = ["all", "pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];

type SearchParams = Promise<{ status?: string }>;

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { status = "all" } = await searchParams;
  const orders = await listOrders(status);

  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Orders</h1>
          <p className="mt-1 text-[13px] text-[#6d7175]">
            {orders.length} orders · {formatPKR(revenue)} collected
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab}
            href={`/admin/orders${tab === "all" ? "" : `?status=${tab}`}`}
            className={`rounded-full border px-3.5 py-1.5 text-[12px] capitalize ${
              status === tab
                ? "border-[#303335] bg-[#303335] text-white"
                : "border-[#c9cccf] bg-white hover:bg-[#f4f5f7]"
            }`}
          >
            {tab}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#e3e5e7] bg-white">
        <table className="w-full min-w-[820px] text-left text-[13px]">
          <thead className="bg-[#fafbfb] text-[11px] uppercase text-[#6d7175]">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Customer</th>
              <th className="px-3 py-3">City</th>
              <th className="px-3 py-3">Payment</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-[#f1f2f3] hover:bg-[#fafbfb]">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-[#00a0ac]">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-3 py-3 text-[#6d7175]">
                  {new Date(order.createdAt).toLocaleDateString("en-PK")}
                </td>
                <td className="px-3 py-3">{order.customerName}</td>
                <td className="px-3 py-3">{order.city || "—"}</td>
                <td className="px-3 py-3 uppercase">{order.paymentMethod}</td>
                <td className="px-3 py-3">
                  <OrderStatusSelect id={order.id} status={order.status} />
                </td>
                <td className="px-4 py-3 text-right font-medium">{formatPKR(order.total)}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-[#8c9196]">
                  No orders in this view yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
