"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useConfirm } from "@/components/confirm-provider";
import { GROUPS } from "@/lib/catalog";
import type { CategoryWithCount } from "@/lib/queries";

export function CategoryManager({ categories }: { categories: CategoryWithCount[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState({ name: "", tagline: "", imageUrl: "", groupSlug: "women", parentSlug: "" });
  const catFileInputRef = useRef<HTMLInputElement>(null);

  function handleCatFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        setDraft((d) => ({ ...d, imageUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  }

  function reset() {
    setDraft({ name: "", tagline: "", imageUrl: "", groupSlug: "women", parentSlug: "" });
    setEditingId(null);
    setError("");
  }

  async function save() {
    setBusy(true);
    setError("");
    try {
      if (!draft.name.trim()) throw new Error("Category name is required");
      const response = await fetch(
        editingId ? `/api/categories/${editingId}` : "/api/categories",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        },
      );
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Save failed");
      reset();
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number, name: string) {
    const ok = await confirm({
      title: "Delete category",
      message: `Delete category “${name}”? Products stay in place but lose this category assignment.`,
      confirmText: "Delete",
      variant: "danger",
    });
    if (!ok) return;

    setBusy(true);
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#e3e5e7] bg-white p-4">
        <div>
          <p className="text-[13px] font-semibold">
            {categories.length} categories across {GROUPS.length} departments
          </p>
          <p className="text-[12px] text-[#8c9196]">
            Jitni categories chahiye utni banaein — nayi category foran storefront menu, collections,
            filters aur product form mein show ho jati hai.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            reset();
            setOpen((v) => !v);
          }}
          className="rounded bg-[#303335] px-3.5 py-2 text-[13px] text-white hover:bg-black"
        >
          {open ? "Close" : "+ Add category"}
        </button>
      </div>

      {open && (
        <div className="grid gap-3 rounded-lg border border-[#e3e5e7] bg-white p-5 sm:grid-cols-2">
          <label className="block text-[12px] text-[#6d7175]">
            Department
            <select
              value={draft.groupSlug}
              onChange={(e) => setDraft((d) => ({ ...d, groupSlug: e.target.value, parentSlug: "" }))}
              className="mt-1.5 w-full rounded border border-[#c9cccf] px-3 py-2 text-[13px]"
            >
              {GROUPS.map((g) => (
                <option key={g.slug} value={g.slug}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[12px] text-[#6d7175]">
            Parent Category (Optional)
            <select
              value={draft.parentSlug}
              onChange={(e) => setDraft((d) => ({ ...d, parentSlug: e.target.value }))}
              className="mt-1.5 w-full rounded border border-[#c9cccf] px-3 py-2 text-[13px]"
            >
              <option value="">None (Top-Level Category)</option>
              {categories
                .filter((c) => c.groupSlug === draft.groupSlug && !c.parentSlug)
                .map((c) => (
                  <option key={c.categorySlug} value={c.categorySlug}>
                    {c.name}
                  </option>
                ))}
            </select>
          </label>
          <label className="block text-[12px] text-[#6d7175]">
            Category name
            <input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="e.g. Winter Shawl Kameez"
              className="mt-1.5 w-full rounded border border-[#c9cccf] px-3 py-2 text-[13px] outline-none focus:border-[#00a0ac]"
            />
          </label>
          <label className="block text-[12px] text-[#6d7175]">
            Tagline
            <input
              value={draft.tagline}
              onChange={(e) => setDraft((d) => ({ ...d, tagline: e.target.value }))}
              placeholder="e.g. Warm wool 3 piece"
              className="mt-1.5 w-full rounded border border-[#c9cccf] px-3 py-2 text-[13px] outline-none focus:border-[#00a0ac]"
            />
          </label>
          <div className="block text-[12px] text-[#6d7175] sm:col-span-2">
            Image (Upload or URL)
            <input
              ref={catFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleCatFileUpload}
              className="hidden"
            />
            <div className="mt-1.5 flex gap-2">
              <input
                value={draft.imageUrl}
                onChange={(e) => setDraft((d) => ({ ...d, imageUrl: e.target.value }))}
                placeholder="https://... or choose file from computer"
                className="flex-1 rounded border border-[#c9cccf] px-3 py-2 text-[13px] outline-none focus:border-[#00a0ac]"
              />
              <button
                type="button"
                onClick={() => catFileInputRef.current?.click()}
                className="rounded border border-[#c9cccf] bg-[#f4f5f7] px-3 py-2 text-[12px] font-medium text-[#202223] hover:bg-[#e3e5e7]"
              >
                📁 Choose File
              </button>
            </div>
          </div>
          {error && <p className="text-[12px] text-[#d72c0d] sm:col-span-2">{error}</p>}
          <div className="flex gap-2 sm:col-span-2">
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="rounded bg-[#00a0ac] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#00838d] disabled:opacity-60"
            >
              {busy ? "Saving…" : editingId ? "Save changes" : "Create category"}
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setOpen(false);
              }}
              className="rounded border border-[#c9cccf] px-4 py-2 text-[13px] hover:bg-[#f4f5f7]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-[#e3e5e7] bg-white">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead className="bg-[#fafbfb] text-[11px] uppercase text-[#6d7175]">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-3 py-3">Department</th>
              <th className="px-3 py-3">Parent</th>
              <th className="px-3 py-3">Slug</th>
              <th className="px-3 py-3">Products</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t border-[#f1f2f3] hover:bg-[#fafbfb]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {cat.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-10 w-8 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-8 items-center justify-center rounded bg-[#f1f2f3] text-[9px] font-semibold text-[#8c9196]">
                        NO IMG
                      </div>
                    )}
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {cat.name}
                        {cat.parentSlug && (
                          <span className="rounded bg-[#e6f7f8] px-1.5 py-0.5 text-[10px] text-[#00a0ac]">
                            Subcategory
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-[#8c9196]">{cat.tagline}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 capitalize">{cat.groupSlug}</td>
                <td className="px-3 py-3 text-[#6d7175]">
                  {cat.parentSlug || <span className="text-[#8c9196]">—</span>}
                </td>
                <td className="px-3 py-3 text-[#6d7175]">{cat.categorySlug}</td>
                <td className="px-3 py-3">{cat.productCount}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3 text-[12px]">
                    <Link
                      href={`/admin/products?group=${cat.groupSlug}&category=${cat.categorySlug}`}
                      className="text-[#6d7175] hover:text-[#202223]"
                    >
                      Products
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(cat.id);
                        setDraft({
                          name: cat.name,
                          tagline: cat.tagline,
                          imageUrl: cat.image,
                          groupSlug: cat.groupSlug,
                          parentSlug: cat.parentSlug ?? "",
                        });
                        setOpen(true);
                      }}
                      className="rounded border border-[#c9cccf] bg-white px-2.5 py-1 text-[#00a0ac] hover:bg-[#e6f7f8]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(cat.id, cat.name)}
                      className="text-[#d72c0d]"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
