import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/lib/db";
import { accounts, sessions, users, verifications } from "@/lib/db/schema/users";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // À activer plus tard avec email service
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // Refresh après 1 jour
    cookieCache: {
      enabled: true,
      maxAge: 60 * 15, // 15 minutes
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});

export type Auth = typeof auth;
