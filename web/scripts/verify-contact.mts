/**
 * verify-contact — the contact form's validation, bot heuristics and email
 * construction (injection safety), from the real modules.
 */
import { MAX_FILL_MS, MIN_FILL_MS, botSignals, contactSchema } from "../src/lib/contact-schema.ts";
import { buildEnquiryEmail, escapeHtml } from "../src/lib/contact-email.ts";

let failures = 0;
function check(name: string, ok: boolean) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

const valid = {
  name: "Asha Menon",
  email: "asha@example.in",
  company: "",
  phone: "+91 98470 00000",
  service: "Website Development",
  budget: "₹2–5 lakh",
  message: "We need a faster marketing site with a booking flow for three clinics.",
  consent: "on",
};
const parse = (o: Record<string, unknown>) => contactSchema.safeParse(o);

check("valid enquiry accepted", parse(valid).success);
const v = parse(valid);
check("empty optional fields become undefined", v.success && v.data.company === undefined);
check("whitespace trimmed", (() => { const r = parse({ ...valid, name: "  Asha  " }); return r.success && r.data.name === "Asha"; })());
check("missing name rejected", !parse({ ...valid, name: "" }).success);
check("bad email rejected", !parse({ ...valid, email: "asha@" }).success);
check("email over 254 chars rejected", !parse({ ...valid, email: `${"a".repeat(250)}@x.in` }).success);
check("short message rejected (<20)", !parse({ ...valid, message: "Call me" }).success);
check("huge message rejected (>4000)", !parse({ ...valid, message: "x".repeat(4001) }).success);
check("phone with letters rejected", !parse({ ...valid, phone: "call me maybe" }).success);
check("unknown budget rejected", !parse({ ...valid, budget: "a million" }).success);
check("empty budget allowed", parse({ ...valid, budget: "" }).success);
check("missing consent rejected", !parse({ ...valid, consent: undefined }).success);

const now = 1_760_000_000_000;
check("honeypot filled → bot", botSignals("http://spam", String(now - 10_000), now) === "honeypot");
check("no timestamp → bot", botSignals("", undefined, now) === "no-timestamp");
check(`faster than ${MIN_FILL_MS}ms → bot`, botSignals("", String(now - 500), now) === "too-fast");
check("older than max age → stale", botSignals("", String(now - MAX_FILL_MS - 1), now) === "stale");
check("normal human → ok", botSignals("", String(now - 45_000), now) === null);

// Email safety: markup is escaped and header-bound values can't carry newlines.
const evil = parse({
  ...valid,
  name: "Eve\r\nBcc: victim@example.com",
  company: "<img src=x onerror=alert(1)>",
  message: "Hello <script>alert('x')</script> team, please call back soon.",
});
check("hostile input still parses (then gets neutralised)", evil.success);
if (evil.success) {
  const mail = buildEnquiryEmail(evil.data, { receivedAt: "2026-09-18T10:00:00Z" });
  check("subject has no line breaks (no header injection)", !/[\r\n]/.test(mail.subject));
  check("reply-to has no line breaks", !/[\r\n]/.test(mail.replyTo));
  check("HTML escapes <script>", !mail.html.includes("<script>") && mail.html.includes("&lt;script&gt;"));
  check("HTML escapes <img onerror>", !mail.html.includes("<img src=x") && mail.html.includes("&lt;img"));
  check("text part keeps the message verbatim", mail.text.includes("<script>alert('x')</script>"));
}
check("escapeHtml covers & < > \" '", escapeHtml(`&<>"'`) === "&amp;&lt;&gt;&quot;&#39;");

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
