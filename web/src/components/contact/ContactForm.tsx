"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitContact } from "@/app/contact/actions";
import { BUDGETS } from "@/lib/contact-options";
import type { ContactField, ContactState } from "@/lib/contact-schema";
import { track } from "@/lib/track";
import { Turnstile } from "./Turnstile";

const inputClass =
  "mt-2 block w-full rounded-sm border border-bone/15 bg-graphite-950/60 px-4 py-3 text-bone placeholder:text-bone-muted/60 transition-colors focus:border-ember focus:outline-none aria-[invalid=true]:border-ember";

export function ContactForm({ services, siteKey, email }: { services: string[]; siteKey: string; email: string }) {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });
  const [startedAt, setStartedAt] = useState("");
  const [attempt, setAttempt] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Set on the client: the page is statically built, so a server timestamp
  // would be the build time.
  useEffect(() => setStartedAt(String(Date.now())), []);

  useEffect(() => {
    if (state.status === "success") {
      track("contact_submitted");
      statusRef.current?.focus();
    } else if (state.status === "error") {
      track("contact_failed");
      setAttempt((a) => a + 1); // new Turnstile token for the retry
      const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      (firstInvalid ?? statusRef.current)?.focus();
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="outline-none">
        <p className="text-eyebrow text-ember uppercase">Message received</p>
        <h2 className="mt-5 text-title font-light">Thank you. We&apos;ll be in touch.</h2>
        <p className="mt-4 text-bone-muted">
          The founder reads every enquiry personally. If it&apos;s urgent, write to{" "}
          <a href={`mailto:${email}`} className="text-bone underline underline-offset-4 hover:text-ember">
            {email}
          </a>
          .
        </p>
      </div>
    );
  }

  const errors: Partial<Record<ContactField, string>> = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const values: Record<string, string> = state.status === "error" ? (state.values ?? {}) : {};
  const field = (name: ContactField) => ({
    id: `contact-${name}`,
    name,
    defaultValue: values[name] ?? "",
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  });
  const Err = ({ name }: { name: ContactField }) =>
    errors[name] ? (
      <p id={`contact-${name}-error`} className="mt-2 text-sm text-ember-soft">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form ref={formRef} action={formAction} className="space-y-6" aria-describedby="contact-status">
      <h2 className="text-title font-light">Send a project brief</h2>

      <div ref={statusRef} id="contact-status" tabIndex={-1} role="alert" className="outline-none">
        {state.status === "error" && (
          <p className="rounded-sm border border-ember/40 bg-ember/10 px-4 py-3 text-sm">{state.message}</p>
        )}
      </div>

      {/* Honeypot: invisible to people and assistive tech; bots fill it. */}
      <div aria-hidden="true" className="absolute left-[-10000px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-sm">
            Name <span className="text-bone-muted">(required)</span>
          </label>
          <input {...field("name")} type="text" required minLength={2} maxLength={80} autoComplete="name" className={inputClass} />
          <Err name="name" />
        </div>
        <div>
          <label htmlFor="contact-email" className="text-sm">
            Email <span className="text-bone-muted">(required)</span>
          </label>
          <input {...field("email")} type="email" required maxLength={254} autoComplete="email" className={inputClass} />
          <Err name="email" />
        </div>
        <div>
          <label htmlFor="contact-company" className="text-sm">
            Company
          </label>
          <input {...field("company")} type="text" maxLength={120} autoComplete="organization" className={inputClass} />
          <Err name="company" />
        </div>
        <div>
          <label htmlFor="contact-phone" className="text-sm">
            Phone
          </label>
          <input {...field("phone")} type="tel" maxLength={24} pattern="[+()\d\s\-]*" autoComplete="tel" className={inputClass} />
          <Err name="phone" />
        </div>
        <div>
          <label htmlFor="contact-service" className="text-sm">
            What do you need?
          </label>
          <select {...field("service")} className={inputClass}>
            <option value="">Not sure yet</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Err name="service" />
        </div>
        <div>
          <label htmlFor="contact-budget" className="text-sm">
            Budget
          </label>
          <select {...field("budget")} className={inputClass}>
            <option value="">Prefer not to say</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <Err name="budget" />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="text-sm">
          What&apos;s in the way? <span className="text-bone-muted">(required, 20+ characters)</span>
        </label>
        <textarea {...field("message")} required minLength={20} maxLength={4000} rows={6} className={inputClass} />
        <Err name="message" />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id="contact-consent"
            name="consent"
            type="checkbox"
            required
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "contact-consent-error" : undefined}
            className="mt-1 h-4 w-4 accent-[var(--color-ember)]"
          />
          <label htmlFor="contact-consent" className="text-sm text-bone-muted">
            Skaylon may use these details to reply to my enquiry, as described in the{" "}
            <a href="/privacy" className="text-bone underline underline-offset-4 hover:text-ember">
              privacy policy
            </a>
            .
          </label>
        </div>
        <Err name="consent" />
      </div>

      <Turnstile siteKey={siteKey} resetKey={attempt} />

      <button
        type="submit"
        disabled={pending || !startedAt}
        className="inline-flex min-h-12 items-center rounded-full bg-bone px-7 text-sm font-medium text-graphite-950 transition-colors duration-500 hover:bg-ember disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send brief"}
      </button>
      <noscript>
        <p className="text-sm text-bone-muted">
          The form needs JavaScript for spam protection. You can always email{" "}
          <a href={`mailto:${email}`} className="text-bone underline">
            {email}
          </a>
          .
        </p>
      </noscript>
    </form>
  );
}
