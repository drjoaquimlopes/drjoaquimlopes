import test from "node:test";
import assert from "node:assert/strict";
import { createGoogleReviewsLoader, normalizeGoogleReviews } from "../lib/google-reviews-data.ts";

const config = () => ({ clientId: "fixture-client", clientSecret: "fixture-secret", refreshToken: "fixture-refresh", location: "accounts/123/locations/456" });
const fixture = () => ({ averageRating: 3.7, totalReviewCount: 20, reviews: [
  { reviewId: "one", starRating: "ONE", comment: "Texto de teste, preservado integralmente.", updateTime: "2026-10-01T12:00:00Z", reviewer: { displayName: "Pessoa de teste" } },
  { reviewId: "five", starRating: "FIVE", updateTime: "2026-09-01T12:00:00Z", reviewer: { isAnonymous: true, displayName: "Não deve aparecer" } },
] });
const response = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

test("preserves the Google average, original comment, order and low ratings while respecting anonymous authors", () => {
  const data = normalizeGoogleReviews(fixture(), 123);
  assert.equal(data.averageRating, 3.7); assert.equal(data.totalReviewCount, 20);
  assert.deepEqual(data.reviews.map(review => review.rating), [1, 5]);
  assert.equal(data.reviews[0].comment, fixture().reviews[0].comment);
  assert.equal(data.reviews[1].author, "Usuário anônimo do Google"); assert.equal(data.reviews[1].comment, "");
  assert.equal(data.fetchedAt, 123);
  assert.throws(() => normalizeGoogleReviews({ averageRating: 6, totalReviewCount: 2 }, 0));
  assert.deepEqual(normalizeGoogleReviews({ totalReviewCount: 0 }, 0).reviews, []);
});

test("coalesces requests, refreshes after expiry and never returns credentials or a Google access token", async () => {
  let now = 100_000, requests = 0;
  const load = createGoogleReviewsLoader({ config, now: () => now, ttl: 1000, request: async (url, options) => {
    requests++;
    assert.equal(options.cache, "no-store");
    if (String(url).includes("oauth2")) return response({ access_token: "fixture-access" });
    assert.equal(options.headers.Authorization, "Bearer fixture-access");
    const endpoint = new URL(url); assert.equal(endpoint.searchParams.get("pageSize"), "3"); assert.equal(endpoint.searchParams.get("orderBy"), "updateTime desc");
    return response({ ...fixture(), client_secret: "should-not-leak" });
  } });
  const [a, b] = await Promise.all([load(), load()]); assert.deepEqual(a, b); assert.equal(requests, 2);
  assert.equal(await load(), a); assert.equal(requests, 2);
  assert.doesNotMatch(JSON.stringify(a), /fixture-access|fixture-secret|fixture-refresh|client_secret|should-not-leak/);
  now += 1001; await load(); assert.equal(requests, 4);
});

test("drops expired content on upstream failure, backs off retries and recovers", async () => {
  let now = 100_000, requests = 0, failing = false;
  const load = createGoogleReviewsLoader({ config, now: () => now, ttl: 1000, request: async url => {
    requests++;
    if (String(url).includes("oauth2")) return response({ access_token: "fixture-access" });
    return failing ? response({ error: "unavailable" }, 503) : response(fixture());
  } });
  assert.ok(await load()); now += 1001; failing = true;
  assert.equal(await load(), null); const attempts = requests;
  assert.equal(await load(), null); assert.equal(requests, attempts);
  now += 60_001; failing = false; assert.ok(await load());
});

test("missing or malformed location configuration performs no external request", async () => {
  for (const value of [null, { ...config(), location: "https://untrusted.invalid" }]) {
    const load = createGoogleReviewsLoader({ config: () => value, request: async () => { throw new Error("Must not request"); } });
    assert.equal(await load(), null);
  }
});
