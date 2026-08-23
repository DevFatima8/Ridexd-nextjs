"use client";

import { useState } from "react";

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const errs: FormErrors = {};

    if (!name.trim()) {
      errs.name = "Full name is required.";
    } else if (name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = "Email address is required.";
    } else if (!emailRegex.test(email.trim())) {
      errs.email = "Please enter a valid email address (e.g. name@example.com).";
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (!phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (phoneDigits.length < 7) {
      errs.phone = "Please enter a valid phone number (at least 7 digits).";
    }

    if (!message.trim()) {
      errs.message = "Message is required.";
    } else if (message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters long.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setServerError(data.error || "Failed to submit your message. Please try again.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setErrors({});
    } catch (err) {
      console.error("[contact-page] Submit error:", err);
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <div className="text-center md:text-left">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#a88242]">
          Customer Care & Enquiries
        </p>
        <h1 className="mt-2 font-display text-3xl md:text-5xl text-ink">Get in touch with us</h1>
        <p className="mt-3 text-sm text-ink-soft/80 max-w-2xl">
          Have a question about an order, custom sizing, delivery timelines, or general inquiry? Fill out the form below and our dedicated support team will get back to you promptly.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Contact Form */}
        <div className="rounded-2xl border border-sand bg-white p-6 md:p-8 shadow-sm">
          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="font-display text-2xl md:text-3xl text-ink">Message Received!</h2>
              <p className="text-sm text-ink-soft/80 max-w-md mx-auto leading-relaxed">
                Thank you for reaching out. Your message has been saved in our system. Our support team typically responds within 1 working day.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 rounded-full bg-ink px-6 py-3 text-[11px] font-medium tracking-[0.2em] text-white uppercase transition hover:bg-black"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {serverError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-3">
                  <span className="text-lg leading-none">⚠️</span>
                  <div className="flex-1">{serverError}</div>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <div className="block">
                  <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft/80">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="e.g. Ayesha Khan"
                    className={`mt-2 w-full rounded-lg border bg-cream px-3.5 py-2.5 text-sm outline-none transition ${
                      errors.name ? "border-red-400 focus:border-red-500" : "border-sand focus:border-gold"
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="block">
                  <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft/80">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="name@example.com"
                    className={`mt-2 w-full rounded-lg border bg-cream px-3.5 py-2.5 text-sm outline-none transition ${
                      errors.email ? "border-red-400 focus:border-red-500" : "border-sand focus:border-gold"
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
                </div>
              </div>

              {/* Phone */}
              <div className="block">
                <label htmlFor="contact-phone" className="block text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft/80">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  placeholder="0300-1234567"
                  className={`mt-2 w-full rounded-lg border bg-cream px-3.5 py-2.5 text-sm outline-none transition ${
                    errors.phone ? "border-red-400 focus:border-red-500" : "border-sand focus:border-gold"
                  }`}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500 font-medium">{errors.phone}</p>}
              </div>

              {/* Message */}
              <div className="block">
                <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft/80">
                  Message / Inquiry <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                  }}
                  placeholder="How can we assist you today? Please include any order numbers or specific details."
                  className={`mt-2 w-full rounded-lg border bg-cream px-3.5 py-2.5 text-sm outline-none transition ${
                    errors.message ? "border-red-400 focus:border-red-500" : "border-sand focus:border-gold"
                  }`}
                />
                {errors.message && <p className="mt-1 text-xs text-red-500 font-medium">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-ink py-4 text-[11px] font-semibold tracking-[0.24em] text-white uppercase transition hover:bg-black disabled:opacity-60 shadow-md"
              >
                {submitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Sending message...</span>
                  </>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Support Sidebar Info */}
        <aside className="space-y-6 rounded-2xl bg-cream p-6 md:p-8 text-sm border border-sand">
          <div className="border-b border-sand pb-5">
            <h3 className="font-display text-lg text-ink font-semibold">Direct Contact Details</h3>
            <p className="mt-1 text-xs text-ink-soft/70">Reach out directly via phone, WhatsApp or email.</p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-[#a88242] uppercase">WhatsApp Support</p>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1.5 font-medium text-ink hover:text-[#00a0ac] transition"
              >
                <span>💬</span>
                <span>0300-1234567</span>
              </a>
              <p className="text-xs text-ink-soft/70 mt-0.5">Mon–Sat, 10:00 AM – 8:00 PM</p>
            </div>

            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-[#a88242] uppercase">Email Support</p>
              <a
                href="mailto:support@ridexd.com"
                className="mt-1 inline-block font-medium text-ink hover:text-[#00a0ac] transition"
              >
                support@ridexd.com
              </a>
            </div>

            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-[#a88242] uppercase">Studio & Hub</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                Ridexd Fulfilment Hub, Gulberg III, Lahore, Pakistan
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-[#a88242] uppercase">Nationwide Delivery</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                2–5 working days nationwide · PKR 250 flat fee · Free shipping on orders above PKR 5,000.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
