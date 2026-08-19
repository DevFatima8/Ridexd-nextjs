import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { GROUP_MAP, formatPKR } from "@/lib/catalog";
import { getAdminStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!(await isAdmin())) redirect("/admin/login");
  const stats = await getAdminStats();

  const cards = [
    { label: "Total revenue", value: formatPKR(stats.orders.revenue), sub: `${stats.orders.total} orders` },
    { label: "Orders to fulfil", value: String(stats.orders.pending), sub: "pending confirmation" },
    { label: "Products", value: String(stats.products.total), sub: `${stats.products.active} active` },
    {
      label: "Inventory value",
      value: formatPKR(stats.products.inventoryValue),
      sub: `${stats.products.lowStock} low stock`,
    },
  ];

  const maxGroup = Math.max(1, ...stats.topGroups.map((g) => g.value));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Good day, Ridexd 👋</h1>
          <p className="mt-1 text-[13px] text-[#6d7175]">
            Here is what is happening across your store today.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/products/new"
            className="rounded bg-[#303335] px-3.5 py-2 text-[13px] text-white hover:bg-black"
          >
            + Add product
          </Link>
          <Link
            href="/admin/orders"
            className="rounded border border-[#c9cccf] bg-white px-3.5 py-2 text-[13px] hover:bg-[#f4f5f7]"
          >
            View orders
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border border-[#e3e5e7] bg-white p-5">
            <p className="text-[12px] text-[#6d7175]">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
            <p className="mt-1 text-[11px] text-[#8c9196]">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-lg border border-[#e3e5e7] bg-white">
          <div className="flex items-center justify-between border-b border-[#e3e5e7] px-5 py-3">
            <p className="text-[13px] font-semibold">Recent orders</p>
            <Link href="/admin/orders" className="text-[12px] text-[#00a0ac]">
              View all
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="px-5 py-10 text-center text-[13px] text-[#8c9196]">
              No orders yet. Place a test order from the storefront to see it here.
            </p>
          ) : (
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#fafbfb] text-[11px] uppercase text-[#6d7175]">
                <tr>
                  <th className="px-5 py-2.5">Order</th>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5">Customer</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-5 py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-[#f1f2f3]">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-[#00a0ac]">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-[#6d7175]">
                      {new Date(order.createdAt).toLocaleDateString("en-PK")}
                    </td>
                    <td className="px-3 py-3">{order.customerName}</td>
                    <td className="px-3 py-3">
                      <span className="rounded bg-[#f1f2f3] px-2 py-0.5 text-[11px] capitalize">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium">{formatPKR(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-[#e3e5e7] bg-white p-5">
            <p className="text-[13px] font-semibold">Products by department</p>
            <div className="mt-4 space-y-3">
              {stats.topGroups.map((row) => (
                <div key={row.group}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span>{GROUP_MAP[row.group]?.name ?? row.group}</span>
                    <span className="text-[#6d7175]">{row.value}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-[#f1f2f3]">
                    <div
                      className="h-1.5 rounded-full bg-[#00a0ac]"
                      style={{ width: `${(row.value / maxGroup) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#e3e5e7] bg-white p-5">
            <p className="text-[13px] font-semibold">Store setup checklist</p>
            <ul className="mt-3 space-y-2 text-[12px] text-[#6d7175]">
              <li>✅ 5 departments · 25 categories seeded</li>
              <li>✅ Women edit is 100% shalwar kameez</li>
              <li>✅ 100 products published</li>
              <li>✅ Cash on delivery checkout enabled</li>
              <li>⬜ Set ADMIN_PASSWORD before launch</li>
              <li>⬜ Import mysql/schema.sql on Hostinger</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
