export type GoogleReview = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type GoogleReviews = {
  averageRating: number;
  totalReviewCount: number;
  reviews: GoogleReview[];
  fetchedAt: number;
};

type Config = { clientId: string; clientSecret: string; refreshToken: string; location: string };
type Options = { config: () => Config | null; request?: typeof fetch; now?: () => number; ttl?: number };
const ratings: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
const HOUR = 60 * 60 * 1000;

export class GoogleReviewsError extends Error {
  readonly reason: string;
  constructor(reason: string) { super("As avaliações estão temporariamente indisponíveis."); this.reason = reason; }
}

export function normalizeGoogleReviews(input: unknown, now: number): GoogleReviews {
  if (!input || typeof input !== "object") throw new GoogleReviewsError("invalid_response");
  const data = input as Record<string, unknown>;
  const count = data.totalReviewCount;
  const average = data.averageRating ?? (count === 0 ? 0 : undefined);
  if (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0 || typeof average !== "number" || !Number.isFinite(average) || average < 0 || average > 5 || (count > 0 && average < 1)) throw new GoogleReviewsError("invalid_response");
  if (data.reviews !== undefined && !Array.isArray(data.reviews)) throw new GoogleReviewsError("invalid_response");
  const reviews: GoogleReview[] = [];
  for (const raw of (data.reviews || []) as Record<string, unknown>[]) {
    if (!raw || typeof raw !== "object") continue;
    const rating = typeof raw.starRating === "string" ? ratings[raw.starRating] : undefined;
    const date = typeof raw.updateTime === "string" ? raw.updateTime : raw.createTime;
    if (!rating || typeof raw.reviewId !== "string" || typeof date !== "string" || !Number.isFinite(Date.parse(date))) continue;
    const reviewer = raw.reviewer && typeof raw.reviewer === "object" ? raw.reviewer as Record<string, unknown> : {};
    reviews.push({
      id: raw.reviewId,
      author: reviewer.isAnonymous === true ? "Usuário anônimo do Google" : typeof reviewer.displayName === "string" && reviewer.displayName.trim() ? reviewer.displayName : "Usuário do Google",
      rating,
      comment: typeof raw.comment === "string" ? raw.comment : "",
      date,
    });
  }
  return { averageRating: average, totalReviewCount: count, reviews: reviews.slice(0, 3), fetchedAt: now };
}

// A bounded server-memory cache keeps private credentials and tokens out of persistent
// Next.js caches and avoids a Google request for each visitor. No reviews are saved to disk.
export function createGoogleReviewsLoader({ config, request = fetch, now = Date.now, ttl = HOUR }: Options) {
  let cached: GoogleReviews | null = null;
  let inFlight: Promise<GoogleReviews | null> | null = null;
  let retryAfter = 0;
  let expiry: ReturnType<typeof setTimeout> | undefined;
  async function load(settings: Config) {
    const tokenResponse = await request("https://oauth2.googleapis.com/token", {
      method: "POST", cache: "no-store", signal: AbortSignal.timeout(8000),
      body: new URLSearchParams({ client_id: settings.clientId, client_secret: settings.clientSecret, refresh_token: settings.refreshToken, grant_type: "refresh_token" }),
    });
    if (!tokenResponse.ok) throw new GoogleReviewsError(`authorization_${tokenResponse.status}`);
    const token = await tokenResponse.json();
    if (typeof token.access_token !== "string" || !token.access_token) throw new GoogleReviewsError("invalid_token_response");
    const endpoint = new URL(`https://mybusiness.googleapis.com/v4/${settings.location}/reviews`);
    endpoint.searchParams.set("pageSize", "3");
    endpoint.searchParams.set("orderBy", "updateTime desc");
    const response = await request(endpoint, { headers: { Authorization: `Bearer ${token.access_token}` }, cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new GoogleReviewsError(`reviews_${response.status}`);
    return normalizeGoogleReviews(await response.json(), now());
  }
  return async function getReviews(): Promise<GoogleReviews | null> {
    const settings = config();
    if (!settings || !/^accounts\/\d+\/locations\/\d+$/.test(settings.location)) return null;
    if (cached && now() - cached.fetchedAt < ttl) return cached;
    cached = null;
    if (inFlight) return inFlight;
    if (now() < retryAfter) return null;
    inFlight = load(settings).then(data => {
      cached = data;
      retryAfter = 0;
      clearTimeout(expiry);
      expiry = setTimeout(() => { cached = null; }, ttl);
      expiry.unref?.();
      return data;
    }).catch(() => {
      retryAfter = now() + 60_000;
      return null;
    }).finally(() => { inFlight = null; });
    return inFlight;
  };
}
