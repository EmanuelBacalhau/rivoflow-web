import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url("NEXT_PUBLIC_API_URL must be a valid URL"),
  NEXT_PUBLIC_OAUTH_AUTHORIZATION_URL: z.url(
    "NEXT_PUBLIC_OAUTH_AUTHORIZATION_URL must be a valid URL",
  ),
  NEXT_PUBLIC_CLIENT_ID: z.string("NEXT_PUBLIC_CLIENT_ID is required"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_OAUTH_AUTHORIZATION_URL:
    process.env.NEXT_PUBLIC_OAUTH_AUTHORIZATION_URL,
  NEXT_PUBLIC_CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID,
});
