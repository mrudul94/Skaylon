"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BUDGETS, PROJECT_TYPES, SERVICE_PROJECT_TYPE, TIMELINES } from "@/lib/contact-options";
import { buttonClass } from "@/components/ui/primitives";
import { Turnstile } from "./Turnstile";
import { BotFields, ConsentField, FormStatus, Label, inputClass, useEnquiryForm } from "./useEnquiryForm";

const P = "contact";

export function ContactForm({ siteKey, email }: { siteKey: string; email: string }) {
  const router = useRouter();
  // Pre-select the project type when arriving from a service page
  // (/contact?service=<slug>). Read on the client so the page stays static.
  const [projectType, setProjectType] = useState("");
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service") ?? "";
    setProjectType(SERVICE_PROJECT_TYPE[slug] ?? "");
  }, []);
  const { state, formAction, pending, startedAt, attempt, formRef, statusRef, errors, field, selectKey, FieldError, canSubmit, verifying, onTurnstileStatus } = useEnquiryForm({
    prefix: P,
    events: { success: "contact_submitted", failure: "contact_failed" },
    onSuccess: () => router.push("/contact/thank-you"),
  });

  if (state.status === "success") {
    // Shown while the thank-you page loads (and if navigation is blocked).
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="outline-none">
        <p className="font-mono text-eyebrow text-success uppercase">Message received</p>
        <h2 className="mt-3 text-title font-semibold">Thank you. We&apos;ll be in touch.</h2>
        <p className="mt-3 text-ink-muted">
          We reply to every enquiry within one to two working days. If it&apos;s urgent, email{" "}
          <a href={`mailto:${email}`} className="font-medium text-ink underline">
            {email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-5" aria-describedby="contact-status">
      <div>
        <h2 className="text-title font-semibold">Send a project enquiry</h2>
        <p className="mt-1.5 text-sm text-ink-muted">Fields marked (required) must be filled in. It takes about two minutes.</p>
      </div>

      <FormStatus id="contact-status" statusRef={statusRef} message={state.status === "error" ? state.message : undefined} />

      <BotFields prefix={P} startedAt={startedAt} />
      <input type="hidden" name="source" value="contact" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${P}-name`}>Name</Label>
          <input {...field("name")} type="text" required minLength={2} maxLength={80} autoComplete="name" className={inputClass} />
          <FieldError name="name" />
        </div>
        <div>
          <Label htmlFor={`${P}-email`}>Email</Label>
          <input {...field("email")} type="email" required maxLength={254} autoComplete="email" className={inputClass} />
          <FieldError name="email" />
        </div>
        <div>
          <Label htmlFor={`${P}-company`} optional>
            Company
          </Label>
          <input {...field("company")} type="text" maxLength={120} autoComplete="organization" className={inputClass} />
          <FieldError name="company" />
        </div>
        <div>
          <Label htmlFor={`${P}-phone`} optional>
            Phone
          </Label>
          <input {...field("phone")} type="tel" maxLength={24} pattern="[+()\d\s\-]*" autoComplete="tel" className={inputClass} />
          <FieldError name="phone" />
        </div>
        <div>
          <Label htmlFor={`${P}-projectType`} optional>
            Project type
          </Label>
          <select key={`${selectKey("projectType")}-${projectType}`} {...field("projectType", projectType)} className={inputClass}>
            <option value="">Not sure yet</option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <FieldError name="projectType" />
        </div>
        <div>
          <Label htmlFor={`${P}-budget`} optional>
            Estimated budget
          </Label>
          <select key={selectKey("budget")} {...field("budget")} className={inputClass}>
            <option value="">Prefer not to say</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <FieldError name="budget" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`${P}-timeline`} optional>
            Preferred timeline
          </Label>
          <select key={selectKey("timeline")} {...field("timeline")} className={inputClass}>
            <option value="">Not sure yet</option>
            {TIMELINES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <FieldError name="timeline" />
        </div>
      </div>

      <div>
        <Label htmlFor={`${P}-message`}>Project details</Label>
        <p id={`${P}-message-hint`} className="mt-0.5 text-sm text-ink-muted">
          What are you trying to achieve, and what is in the way? At least 20 characters.
        </p>
        <textarea
          {...field("message")}
          aria-describedby={[`${P}-message-hint`, errors.message ? `${P}-message-error` : ""].filter(Boolean).join(" ")}
          required
          minLength={20}
          maxLength={4000}
          rows={6}
          className={inputClass}
        />
        <FieldError name="message" />
      </div>

      <ConsentField prefix={P} error={errors.consent} />

      <Turnstile siteKey={siteKey} resetKey={attempt} onStatus={onTurnstileStatus} />

      <button type="submit" disabled={pending || !canSubmit} className={buttonClass("primary", "w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto")}>
        {pending ? "Sending…" : verifying ? "Checking your browser…" : "Send enquiry"}
      </button>
      <noscript>
        <p className="text-sm text-ink-muted">
          The form needs JavaScript for spam protection. You can always email{" "}
          <a href={`mailto:${email}`} className="font-medium text-ink underline">
            {email}
          </a>
          .
        </p>
      </noscript>
    </form>
  );
}
