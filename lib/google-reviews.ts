import "server-only";
import { createGoogleReviewsLoader } from "./google-reviews-data";

export const getGoogleReviews = createGoogleReviewsLoader({ config: () => {
  const clientId = process.env.GBP_CLIENT_ID;
  const clientSecret = process.env.GBP_CLIENT_SECRET;
  const refreshToken = process.env.GBP_REFRESH_TOKEN;
  const location = process.env.GBP_LOCATION_NAME;
  return clientId && clientSecret && refreshToken && location ? { clientId, clientSecret, refreshToken, location } : null;
} });
