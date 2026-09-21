/**
 * verify-webhook — the Sanity signature check (src/lib/webhook.ts), with an
 * INDEPENDENT reference signature from node:crypto (not the module's own
 * signer) so a shared mistake can't pass.
 */
import { createHmac } from "node:crypto";
import { MAX_AGE_MS, verifySanitySignature } from "../src/lib/webhook.ts";

let failures = 0;
function check(name: string, ok: boolean) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

const secret = "test-secret-with-enough-entropy";
const body = JSON.stringify({ _id: "service-ui-ux-design", _type: "service" });
const now = 1_760_000_000_000;
const ref = (s: string, t: number, b: string, url = true) => {
  const sig = createHmac("sha256", s).update(`${t}.${b}`).digest("base64");
  return url ? sig.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : sig;
};
const header = (t: number, sig: string) => `t=${t},v1=${sig}`;

check("valid base64url signature accepted", (await verifySanitySignature(body, header(now, ref(secret, now, body)), secret, now)).ok);
check("valid standard-base64 signature accepted", (await verifySanitySignature(body, header(now, ref(secret, now, body, false)), secret, now)).ok);
check("tampered body rejected", !(await verifySanitySignature(body + " ", header(now, ref(secret, now, body)), secret, now)).ok);
check("wrong secret rejected", !(await verifySanitySignature(body, header(now, ref("other-secret", now, body)), secret, now)).ok);
check("missing header rejected", !(await verifySanitySignature(body, null, secret, now)).ok);
check("malformed header rejected", !(await verifySanitySignature(body, "garbage", secret, now)).ok);
const old = now - MAX_AGE_MS - 1;
check("stale timestamp (replay) rejected", !(await verifySanitySignature(body, header(old, ref(secret, old, body)), secret, now)).ok);
const edge = now - MAX_AGE_MS + 1000;
check("timestamp within window accepted", (await verifySanitySignature(body, header(edge, ref(secret, edge, body)), secret, now)).ok);
check("timestamp swapped after signing rejected", !(await verifySanitySignature(body, header(now, ref(secret, now - 1, body)), secret, now)).ok);

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
