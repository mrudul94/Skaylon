import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { serverEnv } from "@/lib/env";
import { verifySanitySignature } from "@/lib/webhook";
import { SANITY_TAG } from "@/sanity/client";

/**
 * Sanity publish webhook → regenerate every CMS-backed page. The site is
 * small and every page shares site settings (footer), so one tag for all
 * keeps this simple and correct.
 */
export async function POST(request: Request) {
  const secret = serverEnv().SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ error: "Revalidation not configured" }, { status: 503 });

  const body = await request.text();
  const check = await verifySanitySignature(body, request.headers.get("sanity-webhook-signature"), secret);
  if (!check.ok) return NextResponse.json({ error: check.reason }, { status: 401 });

  revalidateTag(SANITY_TAG);
  let type: string | undefined;
  try {
    type = (JSON.parse(body) as { _type?: string })._type;
  } catch {
    type = undefined;
  }
  return NextResponse.json({ revalidated: true, tag: SANITY_TAG, type, at: new Date().toISOString() });
}
