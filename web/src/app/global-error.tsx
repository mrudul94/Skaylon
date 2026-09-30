"use client";

// Replaces the root layout when it fails, so it can't rely on globals.css or fonts.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#faf8f4", color: "#14161a", fontFamily: "system-ui, sans-serif", padding: 16 }}>
        <div style={{ maxWidth: 560 }}>
          <h1 style={{ fontWeight: 600, fontSize: "2.25rem", margin: 0 }}>Skaylon is briefly unavailable.</h1>
          <p style={{ color: "#525866", lineHeight: 1.6 }}>
            Please try again in a moment, or email skaylon.in@gmail.com.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: 16, padding: "12px 24px", borderRadius: 8, border: 0, background: "#14161a", color: "#faf8f4", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
