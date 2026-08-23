"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!response.ok) {
      setError("Incorrect password. Try the demo password: Admin@123");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f5f7] px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Ridexd Admin"
            className="h-10 w-auto object-contain"
          />
          <div>
            <p className="font-semibold">Ridexd Admin</p>
            <p className="text-[11px] text-[#6d7175]">ridexd.com · staff login</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-[12px] font-medium text-[#303335]">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="mt-1.5 w-full rounded border border-[#c9cccf] px-3 py-2 text-sm outline-none focus:border-[#00a0ac] focus:ring-2 focus:ring-[#00a0ac]/20"
              placeholder="••••••••"
            />
          </label>
          {error && <p className="text-[12px] text-[#d72c0d]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-[#303335] py-2.5 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-[11px] leading-relaxed text-[#8c9196]">
          Demo password <strong>Admin@123</strong>. Set <code>ADMIN_PASSWORD</code> in your env file
          before going live on Hostinger.
        </p>
      </div>
    </div>
  );
}
