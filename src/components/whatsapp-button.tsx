import { WHATSAPP_NUMBER } from "@/lib/catalog";

export function WhatsAppButton() {
  const message = encodeURIComponent(
    "Assalam o Alaikum Ridexd! Mujhe apne products ke baare mein maloomat chahiye.",
  );

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Ridexd on WhatsApp"
      className="group fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] transition hover:bg-[#1eb958]"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
          <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.12-.41-2.13-1.31-.79-.7-1.32-1.57-1.47-1.87-.15-.3-.02-.46.13-.61.15-.15.35-.4.5-.6.15-.2.2-.35.3-.55.1-.2.05-.37-.02-.52-.07-.15-.65-1.57-.9-2.15-.23-.56-.47-.48-.65-.49h-.55c-.2 0-.5.07-.75.37-.27.3-1.02 1-1.02 2.42 0 1.42 1.04 2.79 1.19 2.99.15.2 2.05 3.24 5.02 4.42 2.47.98 2.97.79 3.51.74.54-.05 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.12-.27-.19-.57-.34zM12.05 21.8h-.01a9.7 9.7 0 0 1-4.94-1.35l-.35-.21-3.67.96.98-3.58-.23-.37a9.66 9.66 0 0 1-1.48-5.16c0-5.34 4.36-9.69 9.71-9.69 2.59 0 5.03 1.01 6.86 2.84a9.63 9.63 0 0 1 2.84 6.86c0 5.34-4.36 9.7-9.71 9.7zM20.52 3.49A11.7 11.7 0 0 0 12.05 0C5.6 0 .36 5.24.36 11.68c0 2.06.54 4.06 1.56 5.83L0 24l6.65-1.74a11.66 11.66 0 0 0 5.4 1.37h.01c6.44 0 11.69-5.24 11.69-11.68 0-3.12-1.22-6.05-3.23-8.46z" />
        </svg>
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-[12px] font-semibold tracking-wide transition-all duration-300 group-hover:max-w-[140px]">
        Chat on WhatsApp
      </span>
    </a>
  );
}
