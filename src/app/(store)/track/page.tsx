import Link from "next/link";
import { formatPKR } from "@/lib/catalog";
import { getOrderByNumber } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Track your order" };

type SearchParams = Promise<{ order?: string }>;

const STAGES = ["pending", "confirmed", "packed", "shipped", "delivered"];

export default async function TrackPage({ searchParams }: { searchParams: SearchParams }) {
  const { order: orderNumber } = await searchParams;
  const record = orderNumber ? await getOrderByNumber(orderNumber.trim()) : null;
  const stageIndex = record ? Math.max(0, STAGES.indexOf(record.status)) : -1;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-[11px] tracking-luxe text-gold uppercase">Order tracking</p>
      <h1 className="mt-4 font-display text-4xl">Track your order</h1>
      <p className="mt-3 text-sm text-ink-soft/70">
        Enter the order number from your confirmation (for example RD12345678).
      </p>

      <form className="mt-8 flex flex-wrap gap-3" action="/track">
        <input
          name="order"
          defaultValue={orderNumber ?? ""}
          placeholder="RDXXXXXXXX"
          className="flex-1 rounded-full border border-sand bg-cream px-5 py-3 text-sm outline-none focus:border-gold"
        />
        <button
          type="submit"
          className="rounded-full bg-ink px-8 py-3 text-[11px] tracking-[0.24em] text-white uppercase"
        >
          Track
        </button>
      </form>

      {orderNumber && !record && (
        <div className="mt-10 rounded-2xl border border-sand bg-cream p-8 text-center">
          <p className="font-display text-xl">No order found for “{orderNumber}”</p>
          <p className="mt-2 text-sm text-ink-soft/70">
            Double-check the order number or contact support@ridexd.com.
          </p>
        </div>
      )}

      {record && (
        <div className="mt-10 rounded-2xl border border-sand p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.24em] text-gold uppercase">Order {record.orderNumber}</p>
              <p className="mt-2 font-display text-2xl">{formatPKR(record.total)}</p>
            </div>
            <span className="rounded-full bg-ink px-4 py-2 text-[11px] tracking-[0.2em] text-white uppercase">
              {record.status}
            </span>
          </div>

          <ol className="mt-8 grid grid-cols-5 gap-2 text-center">
            {STAGES.map((stage, index) => (
              <li key={stage}>
                <div
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs ${
                    index <= stageIndex ? "bg-gold text-white" : "bg-sand text-ink-soft"
                  }`}
                >
                  {index + 1}
                </div>
                <p className="mt-2 text-[10px] tracking-[0.16em] uppercase">{stage}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 grid gap-2 text-sm text-ink-soft/80">
            <p>Customer: {record.customerName}</p>
            <p>Placed: {new Date(record.createdAt).toLocaleString("en-PK")}</p>
            <p>Delivery to: {record.city || "—"}, {record.address || "—"}</p>
          </div>
        </div>
      )}

      <Link href="/shop" className="mt-10 inline-block text-[11px] tracking-[0.2em] text-gold uppercase">
        Continue shopping →
      </Link>
    </div>
  );
}
