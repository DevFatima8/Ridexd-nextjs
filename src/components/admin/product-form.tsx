"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useConfirm } from "@/components/confirm-provider";
import type { ProductRow } from "@/db/schema";
import { GROUPS, MAX_PRODUCT_IMAGES } from "@/lib/catalog";

const SIZE_PRESETS = [
  "XS", "S", "M", "L", "XL", "XXL",
  "2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y",
  "0-3M", "3-6M", "6-12M", "12-18M", "18-24M",
  "Single", "Queen", "King", "Standard",
];

type CategoryOption = { groupSlug: string; parentSlug?: string; categorySlug: string; name: string };

export function ProductForm({
  product,
  categories,
}: {
  product?: ProductRow;
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const confirm = useConfirm();
  const editing = Boolean(product);

  const [form, setForm] = useState({
    title: product?.title ?? "",
    subtitle: product?.subtitle ?? "",
    description: product?.description ?? "",
    groupSlug: product?.groupSlug ?? "women",
    categorySlug: product?.categorySlug ?? categories[0]?.categorySlug ?? "",
    subcategorySlug: product?.subcategorySlug ?? "",
    price: product?.price ?? 0,
    compareAtPrice: product?.compareAtPrice ?? 0,
    cost: product?.cost ?? 0,
    sku: product?.sku ?? "",
    barcode: product?.barcode ?? "",
    stock: product?.stock ?? 0,
    fabric: product?.fabric ?? "",
    colorFamily: product?.colorFamily ?? "",
    vendor: product?.vendor ?? "Ridexd Studio",
    status: product?.status ?? "active",
    featured: product?.featured ?? false,
  });
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? []);
  const [imageInput, setImageInput] = useState("");
  const [customSize, setCustomSize] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(files: File[]) {
    const remaining = MAX_PRODUCT_IMAGES - images.length;
    if (remaining <= 0) return;
    const selected = files.slice(0, remaining);

    selected.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setImages((prev) => (prev.length < MAX_PRODUCT_IMAGES ? [...prev, result] : prev));
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length) handleFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length) handleFiles(files);
  }

  const groupCategories = categories.filter(
    (c) => c.groupSlug === form.groupSlug && !c.parentSlug,
  );
  const groupSubcategories = categories.filter(
    (c) => c.groupSlug === form.groupSlug && c.parentSlug === form.categorySlug,
  );
  const fallbackCategory =
    groupCategories[0]?.categorySlug ?? categories[0]?.categorySlug ?? "stitched";

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addImage() {
    const value = imageInput.trim();
    if (!value) return;
    if (images.length >= MAX_PRODUCT_IMAGES) {
      setError(`Maximum ${MAX_PRODUCT_IMAGES} images per product.`);
      return;
    }
    setError("");
    setImages((prev) => [...prev, value]);
    setImageInput("");
  }

  function toggleSize(size: string) {
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (images.length > MAX_PRODUCT_IMAGES) {
        throw new Error(`A product can have at most ${MAX_PRODUCT_IMAGES} images.`);
      }
      if (!form.categorySlug) {
        throw new Error("Please pick a category for this product.");
      }
      const response = await fetch(
        editing ? `/api/products/${product!.id}` : "/api/products",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, images, sizes }),
        },
      );
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Save failed");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  }

  async function remove() {
    if (!product) return;
    const ok = await confirm({
      title: "Delete product",
      message: `Are you sure you want to delete “${product.title}”? This action cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
    });
    if (!ok) return;
    setSaving(true);
    await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <div className="space-y-4">
        <section className="rounded-lg border border-[#e3e5e7] bg-white p-5">
          <input
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Product title"
            className="w-full rounded border border-[#c9cccf] px-3 py-2.5 text-[15px] font-medium outline-none focus:border-[#00a0ac]"
          />
          <input
            value={form.subtitle}
            onChange={(e) => update("subtitle", e.target.value)}
            placeholder="Short subtitle (e.g. 3 piece embroidered lawn suit)"
            className="mt-3 w-full rounded border border-[#c9cccf] px-3 py-2 text-[13px] outline-none focus:border-[#00a0ac]"
          />
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={6}
            placeholder="Full product description"
            className="mt-3 w-full rounded border border-[#c9cccf] px-3 py-2 text-[13px] outline-none focus:border-[#00a0ac]"
          />
        </section>

        <section className="rounded-lg border border-[#e3e5e7] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold">Media</p>
            <p className={`text-[12px] ${images.length >= MAX_PRODUCT_IMAGES ? "font-semibold text-[#d72c0d]" : "text-[#8c9196]"}`}>
              {images.length} / {MAX_PRODUCT_IMAGES} images
            </p>
          </div>
          <p className="mt-1 text-[12px] text-[#8c9196]">
            Upload image files from your computer or paste image URLs below (first image is main shot). Maximum {MAX_PRODUCT_IMAGES} images per product.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Image Previews */}
          <div className="mt-4 flex flex-wrap gap-3">
            {images.map((image, index) => (
              <div key={`${image.slice(0, 30)}-${index}`} className="relative">
                {image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={image} alt="" className="h-24 w-20 rounded border border-[#e3e5e7] object-cover" />
                ) : (
                  <div className="flex h-24 w-20 items-center justify-center rounded bg-[#f1f2f3] text-[9px] font-semibold text-[#8c9196]">
                    NO IMG
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#d72c0d] text-[11px] text-white shadow"
                  aria-label={`Remove image ${index + 1}`}
                >
                  ×
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1 text-[9px] text-white">
                    MAIN
                  </span>
                )}
                <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 text-[9px] text-white">
                  {index + 1}
                </span>
              </div>
            ))}
            {images.length < MAX_PRODUCT_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-24 w-20 flex-col items-center justify-center rounded border border-dashed border-[#c9cccf] text-[#8c9196] transition hover:border-[#00a0ac] hover:bg-[#e6f7f8]/50 hover:text-[#00a0ac]"
                title="Choose file from computer"
              >
                <span className="text-xl font-light">+</span>
                <span className="text-[10px] font-medium">Upload</span>
              </button>
            )}
          </div>

          {/* Control bar for URL input */}
          <div className="mt-4 flex gap-2">
            <input
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="Or paste image URL (https://...)"
              className="flex-1 rounded border border-[#c9cccf] px-3 py-2 text-[13px] outline-none focus:border-[#00a0ac]"
            />
            <button
              type="button"
              onClick={addImage}
              disabled={images.length >= MAX_PRODUCT_IMAGES}
              className="rounded border border-[#c9cccf] bg-white px-4 py-2 text-[13px] font-medium hover:bg-[#f4f5f7] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add URL
            </button>
          </div>
          {images.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px]">
              <button
                type="button"
                onClick={() => setImages((prev) => prev.slice(0, MAX_PRODUCT_IMAGES))}
                className="text-[#6d7175] hover:text-[#202223]"
              >
                Trim to {MAX_PRODUCT_IMAGES}
              </button>
              <span className="text-[#c9cccf]">|</span>
              <button
                type="button"
                onClick={() => setImages([])}
                className="text-[#d72c0d]"
              >
                Remove all images
              </button>
            </div>
          )}
        </section>

        <section className="rounded-lg border border-[#e3e5e7] bg-white p-5">
          <p className="text-[13px] font-semibold">Sizes / variants</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SIZE_PRESETS.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`rounded border px-3 py-1.5 text-[12px] ${
                  sizes.includes(size)
                    ? "border-[#00a0ac] bg-[#e6f7f8] text-[#0b7c86]"
                    : "border-[#c9cccf] hover:bg-[#f4f5f7]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              placeholder="Custom size (e.g. 14-15Y)"
              className="flex-1 rounded border border-[#c9cccf] px-3 py-2 text-[13px]"
            />
            <button
              type="button"
              onClick={() => {
                const value = customSize.trim();
                if (!value) return;
                setSizes((prev) => (prev.includes(value) ? prev : [...prev, value]));
                setCustomSize("");
              }}
              className="rounded border border-[#c9cccf] px-4 py-2 text-[13px] hover:bg-[#f4f5f7]"
            >
              Add size
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-[#e3e5e7] bg-white p-5">
          <p className="text-[13px] font-semibold">Pricing</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <NumberField label="Price (PKR)" value={form.price} onChange={(v) => update("price", v)} />
            <NumberField
              label="Compare at price"
              value={form.compareAtPrice}
              onChange={(v) => update("compareAtPrice", v)}
            />
            <NumberField label="Cost per item" value={form.cost} onChange={(v) => update("cost", v)} />
          </div>
          <p className="mt-2 text-[11px] text-[#8c9196]">
            Margin: Rs {Math.max(0, form.price - form.cost)} ·{" "}
            {form.price > 0 ? Math.round(((form.price - form.cost) / form.price) * 100) : 0}% profit
          </p>
        </section>
      </div>

      <div className="space-y-4">
        <section className="rounded-lg border border-[#e3e5e7] bg-white p-5">
          <p className="text-[13px] font-semibold">Status</p>
          <div className="mt-3 flex gap-2">
            {["active", "draft", "archived"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => update("status", option)}
                className={`flex-1 rounded border px-2 py-2 text-[12px] capitalize ${
                  form.status === option
                    ? "border-[#303335] bg-[#303335] text-white"
                    : "border-[#c9cccf] hover:bg-[#f4f5f7]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <label className="mt-4 flex items-center gap-2 text-[13px]">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="h-4 w-4"
            />
            Feature on storefront homepage
          </label>
        </section>

        <section className="rounded-lg border border-[#e3e5e7] bg-white p-5">
          <p className="text-[13px] font-semibold">Organisation</p>
          <label className="mt-3 block text-[12px] text-[#6d7175]">
            Department
            <select
              value={form.groupSlug}
              onChange={(e) => {
                const group = e.target.value;
                const groupCats = categories.filter((c) => c.groupSlug === group && !c.parentSlug);
                const firstCat = groupCats[0]?.categorySlug ?? "";
                const subs = categories.filter((c) => c.groupSlug === group && c.parentSlug === firstCat);
                setForm((prev) => ({
                  ...prev,
                  groupSlug: group,
                  categorySlug: firstCat,
                  subcategorySlug: subs[0]?.categorySlug ?? "",
                }));
              }}
              className="mt-1.5 w-full rounded border border-[#c9cccf] px-3 py-2 text-[13px]"
            >
              {GROUPS.map((g) => (
                <option key={g.slug} value={g.slug}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-3 block text-[12px] text-[#6d7175]">
            Category
            <select
              value={form.categorySlug}
              onChange={(e) => {
                const cat = e.target.value;
                const subs = categories.filter(
                  (c) => c.groupSlug === form.groupSlug && c.parentSlug === cat,
                );
                setForm((prev) => ({
                  ...prev,
                  categorySlug: cat,
                  subcategorySlug: subs[0]?.categorySlug ?? "",
                }));
              }}
              className="mt-1.5 w-full rounded border border-[#c9cccf] px-3 py-2 text-[13px]"
            >
              {(groupCategories.length ? groupCategories : categories).map((c) => (
                <option key={`${c.groupSlug}-${c.categorySlug}`} value={c.categorySlug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          {groupSubcategories.length > 0 && (
            <label className="mt-3 block text-[12px] text-[#6d7175]">
              Subcategory
              <select
                value={form.subcategorySlug}
                onChange={(e) => update("subcategorySlug", e.target.value)}
                className="mt-1.5 w-full rounded border border-[#c9cccf] px-3 py-2 text-[13px]"
              >
                <option value="">None / All subcategories</option>
                {groupSubcategories.map((sc) => (
                  <option key={`${sc.groupSlug}-${sc.categorySlug}`} value={sc.categorySlug}>
                    {sc.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <TextField label="Vendor" value={form.vendor} onChange={(v) => update("vendor", v)} />
          <TextField label="Fabric" value={form.fabric} onChange={(v) => update("fabric", v)} />
          <TextField label="Colour family" value={form.colorFamily} onChange={(v) => update("colorFamily", v)} />
        </section>

        <section className="rounded-lg border border-[#e3e5e7] bg-white p-5">
          <p className="text-[13px] font-semibold">Inventory</p>
          <NumberField label="Quantity in stock" value={form.stock} onChange={(v) => update("stock", v)} />
          <TextField label="SKU" value={form.sku} onChange={(v) => update("sku", v)} />
          <TextField label="Barcode" value={form.barcode} onChange={(v) => update("barcode", v)} />
        </section>

        <div className="sticky bottom-4 space-y-2 rounded-lg border border-[#e3e5e7] bg-white p-4">
          {error && <p className="text-[12px] text-[#d72c0d]">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded bg-[#303335] py-2.5 text-[13px] font-medium text-white hover:bg-black disabled:opacity-60"
          >
            {saving ? "Saving…" : editing ? "Save changes" : "Publish product"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={remove}
              disabled={saving}
              className="w-full rounded border border-[#d72c0d] py-2.5 text-[13px] text-[#d72c0d] hover:bg-[#fdf1ef]"
            >
              Delete product
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-3 block text-[12px] text-[#6d7175]">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded border border-[#c9cccf] px-3 py-2 text-[13px] outline-none focus:border-[#00a0ac]"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mt-3 block text-[12px] text-[#6d7175]">
      {label}
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 w-full rounded border border-[#c9cccf] px-3 py-2 text-[13px] outline-none focus:border-[#00a0ac]"
      />
    </label>
  );
}
