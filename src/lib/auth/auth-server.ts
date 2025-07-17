import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";
import { db } from "@/db";
import { env } from "@/env";
import * as authSchema from "@/db/schema/auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 30,
    },
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_SECRET,
    },
  },
  plugins: [
    // Should be last plugin
    reactStartCookies(),
  ],
});
