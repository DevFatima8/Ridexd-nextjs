"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

export type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
};

type ConfirmContextType = {
  confirm: (options: ConfirmOptions | string) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context.confirm;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({ message: "" });
  const [loading, setLoading] = useState(false);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions | string): Promise<boolean> => {
    const formattedOptions: ConfirmOptions =
      typeof opts === "string" ? { message: opts } : opts;

    setOptions(formattedOptions);
    setIsOpen(true);
    setLoading(false);

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleClose = useCallback((result: boolean) => {
    setIsOpen(false);
    setLoading(false);
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  }, []);

  const handleConfirm = useCallback(() => {
    handleClose(true);
  }, [handleClose]);

  const handleCancel = useCallback(() => {
    handleClose(false);
  }, [handleClose]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        handleCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, handleCancel]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isDanger = (options.variant ?? "danger") === "danger";

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
            onClick={() => {
              if (!loading) handleCancel();
            }}
          />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200 border border-[#e3e5e7]">
            <div className="flex items-start gap-4">
              {/* Icon badge */}
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  isDanger ? "bg-red-50 text-[#d72c0d]" : "bg-amber-50 text-amber-600"
                }`}
              >
                {isDanger ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.75"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.75"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                )}
              </div>

              {/* Text content */}
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#1a1a1a]">
                  {options.title ?? "Confirm Action"}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6d7175]">
                  {options.message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="rounded-lg border border-[#c9cccf] bg-white px-4 py-2 text-sm font-medium text-[#202223] transition hover:bg-[#f6f6f7] hover:text-[#1a1a1a] disabled:opacity-50"
              >
                {options.cancelText ?? "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition shadow-sm disabled:opacity-60 ${
                  isDanger
                    ? "bg-[#d72c0d] hover:bg-[#bc2200] active:bg-[#a01c00]"
                    : "bg-[#00a0ac] hover:bg-[#008893]"
                }`}
              >
                {loading && (
                  <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {options.confirmText ?? (isDanger ? "Delete" : "Confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
