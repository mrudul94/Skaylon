/**
 * Floating "Chat on WhatsApp" button. A plain link (works without JS) that
 * opens WhatsApp with a short pre-filled message. On phones it sits above the
 * sticky call bar and moves out of the way of the cookie banner (globals.css).
 */
export function WhatsAppButton({ number }: { number: string }) {
  const href = `https://wa.me/${number}?text=${encodeURIComponent("Hi Skaylon, I'd like to discuss a project.")}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-track="whatsapp_click"
      data-track-label="floating"
      className="whatsapp-fab group fixed right-4 z-40 flex h-14 items-center rounded-full bg-[#0e7f45] hover:bg-[#0a6e3c] pr-4 pl-4 text-white shadow-[0_14px_34px_-12px_rgb(10_20_53/0.55)] transition-[padding,transform] duration-300 hover:-translate-y-0.5 sm:right-6"
    >
      <svg aria-hidden="true" viewBox="0 0 32 32" width="26" height="26" fill="currentColor">
        <path d="M16.02 3C8.84 3 3 8.83 3 16c0 2.29.6 4.53 1.74 6.5L3 29l6.68-1.75A12.96 12.96 0 0 0 16.02 29C23.2 29 29 23.17 29 16S23.2 3 16.02 3Zm0 23.68c-2 0-3.95-.54-5.66-1.55l-.4-.24-3.96 1.04 1.06-3.86-.26-.4A10.63 10.63 0 0 1 5.34 16c0-5.9 4.8-10.68 10.68-10.68 5.89 0 10.66 4.79 10.66 10.68 0 5.9-4.79 10.68-10.66 10.68Zm5.86-8c-.32-.16-1.9-.94-2.2-1.05-.29-.1-.5-.16-.72.16-.21.32-.82 1.04-1 1.26-.19.21-.37.24-.69.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.5.14-.66.15-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.53-.54-.72-.55h-.62c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.66 0 1.57 1.14 3.09 1.3 3.3.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.2 2 .12.61-.09 1.9-.78 2.16-1.53.27-.74.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37Z" />
      </svg>
      <span className="whatsapp-label max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap opacity-0 transition-[max-width,opacity,margin] duration-300 group-hover:ml-2 group-hover:max-w-40 group-focus-visible:ml-2 group-hover:opacity-100 group-focus-visible:max-w-40 group-focus-visible:opacity-100">
        Chat on WhatsApp
      </span>
      <span className="sr-only"> (opens WhatsApp in a new tab)</span>
    </a>
  );
}
