import { getGoogleReviews } from "@/lib/google-reviews";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const data = await getGoogleReviews();
  // Google data is bounded by the server cache; no public CDN or ISR snapshot can
  // retain these reviews beyond their refresh period after authorization is revoked.
  return Response.json(data || { available: false }, {
    status: data ? 200 : 503,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...(data ? {} : { "Retry-After": "60" }) },
  });
}
