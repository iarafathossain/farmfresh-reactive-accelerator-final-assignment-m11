import { env } from "@/config/env";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import type { Account, Session, User } from "next-auth";
import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import client from "./libs/mongoClient";
import { showToast } from "./providers/ToastProvider";
import { getUserByEmail } from "./queries/user";

// Extent JWT
interface ExtendedToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  user?: User;
  error?: string;
}

// Extended session
interface ExtendedSession extends Session {
  accessToken?: string;
  error?: string;
}

const refreshAccessToken = async (
  token: ExtendedToken,
): Promise<ExtendedToken> => {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: env.auth.googleClientId,
        client_secret: env.auth.googleClientSecret,
        grant_type: "refresh_token",
        refresh_token: token.refresh_token as string,
      });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const refreshTokens: {
      access_token: string;
      expires_in: number;
      refresh_token?: string;
    } = await response.json();

    if (!response.ok) {
      throw refreshTokens;
    }

    return {
      ...token,
      accessToken: refreshTokens?.access_token,
      accessTokenExpires: Date.now() + refreshTokens?.expires_in * 1000,
      refreshToken: refreshTokens.refresh_token && refreshTokens.refresh_token,
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  adapter: MongoDBAdapter(client) as unknown as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.auth.googleClientId,
      clientSecret: env.auth.googleClientSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(
        credentials: Partial<Record<"email" | "password", unknown>>,
      ): Promise<User | null> {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          throw new Error("Missing email or password.");
        }

        try {
          const exist = await getUserByEmail(email);
          if (!exist) {
            showToast("Invalid email or password.", "ERROR");
            throw new Error("Invalid email or password.");
          }
          const isMatch = await bcrypt.compare(password, exist.password);

          if (!isMatch) {
            showToast("Invalid email or password.", "ERROR");
            throw new Error("Invalid email or password.");
          }
          return exist;
        } catch (err) {
          if (err instanceof Error) {
            throw new Error(err.message);
          }
          if (typeof err === "string") {
            throw new Error(err);
          }
          throw new Error("Fail to login.");
        }
      },
    }),
  ],
  trustHost: true,
  callbacks: {
    async jwt({
      token,
      user,
      account,
    }: {
      token: ExtendedToken;
      user?: User;
      account?: Account | null;
    }): Promise<ExtendedToken> {
      if (account && user) {
        return {
          accessToken: account?.access_token,
          accessTokenExpires: Date.now() + (account.expires_in ?? 0) * 1000,
          refreshToken: account?.refresh_token,
          user: {
            ...user,
            role: user?.role ?? "Customer", // default role = Customer for google sign in user
          },
        };
      }

      if (Date.now() < (token.accessTokenExpires ?? 0)) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: ExtendedToken;
    }) {
      const extendedSession: ExtendedSession = {
        ...session,
        user: token.user as typeof session.user,
        accessToken: token.accessToken,
        error: token.error,
      };

      return extendedSession;
    },
  },
});
