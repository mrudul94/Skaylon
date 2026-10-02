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
    ["Project type", input.projectType],
    ["Budget", input.budget],
    ["Timeline", input.timeline],
    ["Sent from", input.source === "popup" ? "Project enquiry pop-up" : "Contact page"],
  ];
  const present = rows.filter((r): r is [string, string] => Boolean(r[1]));

  const subject = oneLine(`New enquiry: ${input.name}${input.company ? ` (${input.company})` : ""}`).slice(0, 150);

  const message = input.message || "(No project details provided.)";

  const text = [
    ...present.map(([k, v]) => `${k}: ${oneLine(v)}`),
    "",
    message,
    "",
    `— Received ${meta.receivedAt} via skaylon.com`,
  ].join("\n");

  const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;color:#111;line-height:1.5">
<h2 style="font-weight:500;margin:0 0 16px">New enquiry from the website</h2>
<table cellpadding="6" style="border-collapse:collapse">${present
    .map(([k, v]) => `<tr><td style="color:#666">${k}</td><td>${escapeHtml(oneLine(v))}</td></tr>`)
    .join("")}</table>
<p style="white-space:pre-wrap;margin-top:20px">${escapeHtml(message)}</p>
<p style="color:#888;font-size:12px">Received ${escapeHtml(meta.receivedAt)} via skaylon.com</p>
</body></html>`;

  return { subject, text, html, replyTo: oneLine(input.email) };
}

/**
 * The acknowledgement sent to the visitor. Deliberately generic: it repeats
 * nothing the visitor typed (no name, message or company), so the form can't
 * be abused to deliver attacker-written text to someone else's inbox.
 */
export function buildConfirmationEmail(meta: { siteName: string; teamEmail: string; phone: string; siteUrl: string }) {
  const subject = `We received your enquiry | ${meta.siteName}`;
  const lines = [
    "Hello,",
    "",
    `Thank you for contacting ${meta.siteName}. Your project enquiry has reached us, and we reply to every enquiry within one to two working days, usually to arrange a short call.`,
    "",
    `If it's urgent, reply to this email or call ${meta.phone}.`,
    "",
    `${meta.siteName}`,
    meta.siteUrl,
    "",
    "You are receiving this because this email address was entered in the enquiry form on our website. If that wasn't you, you can ignore this message.",
  ];
  const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;color:#0a1435;line-height:1.6;max-width:560px">
<p>Hello,</p>
<p>Thank you for contacting ${escapeHtml(meta.siteName)}. Your project enquiry has reached us, and we reply to every enquiry within one to two working days, usually to arrange a short call.</p>
<p>If it&#39;s urgent, reply to this email or call ${escapeHtml(meta.phone)}.</p>
<p style="margin-top:24px">${escapeHtml(meta.siteName)}<br><a href="${escapeHtml(meta.siteUrl)}" style="color:#0052cc">${escapeHtml(meta.siteUrl.replace(/^https?:\/\//, ""))}</a></p>
<p style="color:#4f5875;font-size:12px;margin-top:24px">You are receiving this because this email address was entered in the enquiry form on our website. If that wasn&#39;t you, you can ignore this message.</p>
</body></html>`;
  return { subject, text: lines.join("\n"), html, replyTo: meta.teamEmail };
}
