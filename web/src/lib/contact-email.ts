import type { ContactInput } from "./contact-schema";

/**
 * Builds the enquiry email. Pure (tested by verify-contact): every user value
 * is HTML-escaped, and header-bound values are stripped of line breaks so a
 * visitor can't inject headers or markup into the team's inbox.
 */
export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export function buildEnquiryEmail(input: ContactInput, meta: { receivedAt: string; ip?: string }) {
  const rows: [string, string | undefined][] = [
    ["Name", input.name],
    ["Email", input.email],
    ["Company", input.company],
    ["Phone", input.phone],
    ["Service", input.service],
    ["Budget", input.budget],
  ];
  const present = rows.filter((r): r is [string, string] => Boolean(r[1]));

  const subject = oneLine(`New enquiry: ${input.name}${input.company ? ` (${input.company})` : ""}`).slice(0, 150);

  const text = [
    ...present.map(([k, v]) => `${k}: ${oneLine(v)}`),
    "",
    input.message,
    "",
    `— Received ${meta.receivedAt} via skaylon.com`,
  ].join("\n");

  const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;color:#111;line-height:1.5">
<h2 style="font-weight:500;margin:0 0 16px">New enquiry from the website</h2>
<table cellpadding="6" style="border-collapse:collapse">${present
    .map(([k, v]) => `<tr><td style="color:#666">${k}</td><td>${escapeHtml(oneLine(v))}</td></tr>`)
    .join("")}</table>
<p style="white-space:pre-wrap;margin-top:20px">${escapeHtml(input.message)}</p>
<p style="color:#888;font-size:12px">Received ${escapeHtml(meta.receivedAt)} via skaylon.com</p>
</body></html>`;

  return { subject, text, html, replyTo: oneLine(input.email) };
}
