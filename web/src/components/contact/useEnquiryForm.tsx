"use client";

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { submitContact } from "@/app/contact/actions";
import { STORAGE_KEYS } from "@/lib/contact-options";
import type { ContactField, ContactState } from "@/lib/contact-schema";
import { track, type TrackEvent } from "@/lib/track";

export const inputClass =
  "mt-1.5 block w-full rounded-lg border border-field bg-surface px-3.5 py-3 text-ink placeholder:text-ink-muted/70 transition-[border-color,box-shadow] duration-150 hover:border-ink-muted focus:border-ink focus:shadow-[0_0_0_3px_rgb(164_68_28/0.18)] focus:outline-none aria-[invalid=true]:border-danger";

/** Remember that this visitor has sent an enquiry (suppresses the pop-up). */
export function markEnquirySent() {
  try {
    localStorage.setItem(STORAGE_KEYS.enquirySent, "1");
  } catch {
    // Storage can be unavailable (private mode, blocked site data): harmless.
  }
}

/**
 * State and behaviour shared by the contact form and the enquiry pop-up. Both
 * post to the same server action; `prefix` keeps element ids unique when both
 * forms are on one page.
 */
export function useEnquiryForm({
  prefix,
  events,
  onSuccess,
  since,
}: {
  prefix: string;
  events: { success: TrackEvent; failure: TrackEvent };
  onSuccess?: () => void;
  /** When the visitor started engaging (ms epoch); defaults to when the form mounts. */
  since?: number;
}) {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });
  const [startedAt, setStartedAt] = useState("");
  const [attempt, setAttempt] = useState(0);
  // Submit waits for the Turnstile token (a submit without one is always
  // refused). If the check can't load at all, allow the submit after a grace
  // period so the server can explain, rather than leaving a dead button.
  const [verification, setVerification] = useState<"ready" | "pending" | "failed">("pending");
  const [graceOver, setGraceOver] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGraceOver(true), 10_000);
    return () => clearTimeout(t);
  }, []);
  const canSubmit = Boolean(startedAt) && (verification !== "pending" || graceOver);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  // Set on the client: pages are statically built, so a server timestamp
  // would be the build time.
  useEffect(() => setStartedAt(String(since ?? Date.now())), [since]);

  useEffect(() => {
    if (state.status === "success") {
      track(events.success);
      markEnquirySent();
      statusRef.current?.focus();
      onSuccessRef.current?.();
    } else if (state.status === "error") {
      track(events.failure);
      setAttempt((a) => a + 1); // new Turnstile token for the retry
      const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      (firstInvalid ?? statusRef.current)?.focus();
    }
  }, [state, events.success, events.failure]);

  const errors: Partial<Record<ContactField, string>> = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const values: Record<string, string> = state.status === "error" ? (state.values ?? {}) : {};

  const field = (name: ContactField, defaultValue = "") => ({
    id: `${prefix}-${name}`,
    name,
    defaultValue: values[name] ?? defaultValue,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${prefix}-${name}-error` : undefined,
  });

  // React resets uncontrolled forms after an action, and a <select> ignores a
  // changed defaultValue, so selects remount after each failed attempt to
  // show the values the visitor had chosen.
  const selectKey = (name: ContactField) => `${name}-${attempt}`;

  const FieldError = ({ name }: { name: ContactField }) =>
    errors[name] ? (
      <p id={`${prefix}-${name}-error`} className="mt-1.5 text-sm text-danger">
        {errors[name]}
      </p>
    ) : null;

  return {
    state,
    formAction,
    pending,
    startedAt,
    attempt,
    formRef,
    statusRef,
    errors,
    field,
    selectKey,
    FieldError,
    canSubmit,
    verifying: verification === "pending" && !graceOver,
    onTurnstileStatus: setVerification,
  };
}

/** Honeypot + timestamp: the two hidden inputs every enquiry form needs. */
export function BotFields({ prefix, startedAt }: { prefix: string; startedAt: string }) {
  return (
    <>
      {/* Honeypot: invisible to people and assistive tech; bots fill it. */}
      <div aria-hidden="true" className="absolute left-[-10000px] h-px w-px overflow-hidden">
        <label htmlFor={`${prefix}-website`}>Website</label>
        <input id={`${prefix}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />
    </>
  );
}

export function Label({ htmlFor, children, optional }: { htmlFor: string; children: ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
      {children} {optional ? <span className="font-normal text-ink-muted">(optional)</span> : <span className="font-normal text-ink-muted">(required)</span>}
    </label>
  );
}

export function ConsentField({ prefix, error }: { prefix: string; error?: string }) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={`${prefix}-consent`}
          name="consent"
          type="checkbox"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${prefix}-consent-error` : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-accent-ink)]"
        />
        <label htmlFor={`${prefix}-consent`} className="text-sm leading-relaxed text-ink-2">
          Skaylon may use these details to reply to my enquiry, as described in the{" "}
          <a href="/privacy" className="font-medium text-ink underline hover:text-accent-ink">
            Privacy Policy
          </a>
          .
        </label>
      </div>
      {error && (
        <p id={`${prefix}-consent-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormStatus({ id, statusRef, message }: { id: string; statusRef: React.RefObject<HTMLDivElement | null>; message?: string }) {
  return (
    <div ref={statusRef} id={id} tabIndex={-1} role="alert" className="outline-none">
      {message && <p className="rounded-lg border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">{message}</p>}
    </div>
  );
}
