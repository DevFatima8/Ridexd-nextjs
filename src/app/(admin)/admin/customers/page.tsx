import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { formatPKR } from "@/lib/catalog";
import { listOrders } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const orders = await listOrders();

  const customers = new Map<
    string,
    { name: string; email: string; city: string; orders: number; spent: number; last: string }
  >();

  orders.forEach((order) => {
    const key = order.email.toLowerCase();
    const existing = customers.get(key);
    if (existing) {
      existing.orders += 1;
      existing.spent += order.status === "cancelled" ? 0 : order.total;
      if (new Date(order.createdAt) > new Date(existing.last)) existing.last = order.createdAt.toISOString();
    } else {
      customers.set(key, {
        name: order.customerName,
        email: order.email,
        city: order.city || "—",
        orders: 1,
        spent: order.status === "cancelled" ? 0 : order.total,
        last: order.createdAt.toISOString(),
      });
    }
  });

  const rows = Array.from(customers.values()).sort((a, b) => b.spent - a.spent);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Customers</h1>
        <p className="mt-1 text-[13px] text-[#6d7175]">
          {rows.length} customers built from {orders.length} orders
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#e3e5e7] bg-white">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead className="bg-[#fafbfb] text-[11px] uppercase text-[#6d7175]">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">City</th>
              <th className="px-3 py-3">Orders</th>
              <th className="px-3 py-3">Last order</th>
              <th className="px-4 py-3 text-right">Total spent</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.email} className="border-t border-[#f1f2f3] hover:bg-[#fafbfb]">
                <td className="px-4 py-3 font-medium">{row.name}</td>
                <td className="px-3 py-3 text-[#6d7175]">{row.email}</td>
                <td className="px-3 py-3">{row.city}</td>
                <td className="px-3 py-3">{row.orders}</td>
                <td className="px-3 py-3 text-[#6d7175]">
                  {new Date(row.last).toLocaleDateString("en-PK")}
                </td>
                <td className="px-4 py-3 text-right font-medium">{formatPKR(row.spent)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[#8c9196]">
                  No customers yet — place a test order from the storefront.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
