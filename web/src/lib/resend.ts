import "server-only";

/** Sends via Resend's HTTP API (plain fetch: works on Workers, no SDK). */
export async function sendEmail(opts: {
  apiKey: string;
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
  idempotencyKey: string;
}): Promise<{ ok: true } | { ok: false; status: number }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      "Content-Type": "application/json",
      // A double-submit or retry can't send the same enquiry twice.
      "Idempotency-Key": opts.idempotencyKey,
    },
    body: JSON.stringify({
      from: opts.from,
      to: [opts.to],
      reply_to: opts.replyTo,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    }),
    signal: AbortSignal.timeout(10000),
  });
  return res.ok ? { ok: true } : { ok: false, status: res.status };
}
