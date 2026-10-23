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
    const endpoint = new URL(url); assert.equal(endpoint.searchParams.get("pageSize"), "50"); assert.equal(endpoint.searchParams.get("orderBy"), "updateTime desc");
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

test("collects all pages in order, deduplicates records and exposes only safe non-anonymous photos", async () => {
  let pages = 0;
  const first = fixture().reviews[0];
  const load = createGoogleReviewsLoader({ config, request: async url => {
    if (String(url).includes("oauth2")) return response({ access_token: "fixture-access" });
    const endpoint = new URL(url); pages++;
    if (!endpoint.searchParams.has("pageToken")) return response({ ...fixture(), reviews: [{ ...first, reviewer: { displayName: "Pessoa de teste", profilePhotoUrl: "https://lh3.googleusercontent.com/a/photo" } }], nextPageToken: "second" });
    assert.equal(endpoint.searchParams.get("pageToken"), "second");
    return response({ ...fixture(), reviews: [first, ...Array.from({length: 6}, (_, i) => ({ ...first, reviewId: `next-${i}`, reviewer: { isAnonymous: i === 0, profilePhotoUrl: i === 0 ? "https://lh3.googleusercontent.com/a/private" : i === 1 ? "https://googleusercontent.com.evil.invalid/photo" : i === 2 ? "http://lh3.googleusercontent.com/photo" : "https://lh3.googleusercontent.com/a/public" } }))] });
  } });
  const data = await load(); assert.equal(pages, 2); assert.equal(data.reviews.length, 7);
  assert.equal(data.reviews[0].photoUrl, "https://lh3.googleusercontent.com/a/photo");
  assert.deepEqual(data.reviews.map(r=>r.id), ["one", ...Array.from({length:6},(_,i)=>`next-${i}`)]);
  assert.equal(data.reviews[1].photoUrl, undefined); assert.equal(data.reviews[2].photoUrl, undefined); assert.equal(data.reviews[3].photoUrl, undefined);
  assert.equal(data.reviews[4].photoUrl, "https://lh3.googleusercontent.com/a/public");
});

test("a failed subsequent page or repeated token cannot publish a partial list", async () => {
  for (const mode of ["failure", "repeat"]) {
    let requests = 0;
    const load = createGoogleReviewsLoader({ config, request: async url => {
      requests++;
      if (String(url).includes("oauth2")) return response({ access_token: "fixture-access" });
      if (mode === "failure" && new URL(url).searchParams.has("pageToken")) return response({},503);
      return response({ ...fixture(), nextPageToken: "repeated" });
    } });
    assert.equal(await load(),null); assert.equal(requests,3);
  }
});
