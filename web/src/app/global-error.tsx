"use client";

// Replaces the root layout when it fails, so it can't rely on globals.css or fonts.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#08090a", color: "#ece8e1", fontFamily: "system-ui, sans-serif", padding: 16 }}>
        <div style={{ maxWidth: 560 }}>
          <h1 style={{ fontWeight: 300, fontSize: "2.5rem", margin: 0 }}>Skaylon is briefly unavailable.</h1>
          <p style={{ color: "#a9a59e", lineHeight: 1.6 }}>
            Please try again in a moment, or email skaylon.in@gmail.com.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: 16, padding: "12px 24px", borderRadius: 999, border: 0, background: "#ece8e1", color: "#08090a", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
