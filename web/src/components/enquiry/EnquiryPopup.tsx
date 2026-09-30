"use client";

import { useEffect, useRef, useState } from "react";
import { BUDGETS, PROJECT_TYPES, TIMELINES } from "@/lib/contact-options";
import { buttonClass } from "@/components/ui/primitives";
import { Turnstile } from "@/components/contact/Turnstile";
import { BotFields, ConsentField, FormStatus, Label, inputClass, useEnquiryForm } from "@/components/contact/useEnquiryForm";

const P = "popup";

/**
 * The enquiry dialog. A native modal <dialog>: focus moves inside and is
 * trapped, the page behind is inert, Escape closes it, and focus returns to
 * where it was. Posts to the same server action as the contact page.
 */
export function EnquiryPopup({
  open,
  siteKey,
  since,
  onDismiss,
  onClosed,
}: {
  open: boolean;
  siteKey: string;
  /** When the visitor arrived on the page (ms epoch): the bot-timing baseline. */
  since: number;
  /** Called synchronously when the visitor dismisses without sending. */
  onDismiss: () => void;
  /** Called after the dialog has closed, for any reason. */
  onClosed: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [sent, setSent] = useState(false);
  const { state, formAction, pending, startedAt, attempt, formRef, statusRef, errors, field, selectKey, FieldError, canSubmit, verifying, onTurnstileStatus } = useEnquiryForm({
    prefix: P,
    events: { success: "enquiry_popup_submitted", failure: "contact_failed" },
    onSuccess: () => setSent(true),
    since,
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Dismissal is recorded in the same tick as the visitor's action (the
  // dialog's own close event is queued and could lose a race with navigation).
  const close = () => {
    if (!sent) onDismiss();
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="popup-heading"
      aria-describedby="popup-intro"
      onCancel={() => {
        // Escape key.
        if (!sent) onDismiss();
      }}
      onClose={() => {
        onClosed();
        returnFocus.current?.focus?.();
      }}
      // Click on the backdrop (the dialog element itself, outside the panel) closes.
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
      className="sheet m-auto max-h-[calc(100dvh-2rem)] w-[min(40rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-2xl border hairline bg-paper p-0 text-ink shadow-2xl"
    >
      <div className="p-5 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id="popup-heading" className="text-title font-semibold text-balance">
            Before you go — what are you looking to build?
          </h2>
          <button
            type="button"
            onClick={close}
            className="-mt-1 -mr-1 flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-ink-muted hover:bg-paper-2 hover:text-ink"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            <span className="sr-only">Close</span>
          </button>
        </div>

        {state.status === "success" ? (
          <div ref={statusRef} tabIndex={-1} role="status" className="mt-4 outline-none">
            <p className="font-mono text-eyebrow text-success uppercase">Enquiry sent</p>
            <p className="mt-2 text-lead">Thank you. We&apos;ll reply within one to two working days.</p>
            <p className="mt-2 text-ink-muted">Your details go only to Skaylon&apos;s inbox, and we won&apos;t add you to any mailing list.</p>
            <button type="button" onClick={close} className={buttonClass("primary", "mt-6")}>
              Close
            </button>
          </div>
        ) : (
          <>
            <p id="popup-intro" className="mt-2 text-ink-muted">
              Share a few details and we&apos;ll reply with next steps. No obligation, and it takes under a minute.
            </p>
            <form ref={formRef} action={formAction} className="mt-5 space-y-4">
              <FormStatus id="popup-status" statusRef={statusRef} message={state.status === "error" ? state.message : undefined} />
              <BotFields prefix={P} startedAt={startedAt} />
              <input type="hidden" name="source" value="popup" />

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor={`${P}-projectType`} optional>
                    Project type
                  </Label>
                  <select key={selectKey("projectType")} {...field("projectType")} className={inputClass}>
                    <option value="">Choose…</option>
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
                    Budget
                  </Label>
                  <select key={selectKey("budget")} {...field("budget")} className={inputClass}>
                    <option value="">Not sure</option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <FieldError name="budget" />
                </div>
                <div>
                  <Label htmlFor={`${P}-timeline`} optional>
                    Timeline
                  </Label>
                  <select key={selectKey("timeline")} {...field("timeline")} className={inputClass}>
                    <option value="">Not sure</option>
                    {TIMELINES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <FieldError name="timeline" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>

              <div>
                <Label htmlFor={`${P}-message`} optional>
                  Project details
                </Label>
                <textarea {...field("message")} maxLength={4000} rows={3} className={inputClass} />
                <FieldError name="message" />
              </div>

              <ConsentField prefix={P} error={errors.consent} />
              <Turnstile siteKey={siteKey} resetKey={attempt} onStatus={onTurnstileStatus} />

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={close} className="min-h-11 text-sm text-ink-muted underline hover:text-ink">
                  No thanks
                </button>
                <button type="submit" disabled={pending || !canSubmit} className={buttonClass("primary", "disabled:cursor-wait disabled:opacity-60")}>
                  {pending ? "Sending…" : verifying ? "Checking your browser…" : "Send enquiry"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
