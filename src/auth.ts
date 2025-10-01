import NextAuth from "next-auth";
import Twitter from "next-auth/providers/twitter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || "development-secret-change-in-production",
  providers: [
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID || "",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.handle = profile.screen_name || profile.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.handle) {
        session.user.handle = token.handle as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
