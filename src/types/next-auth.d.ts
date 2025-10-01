import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      handle?: string;
    } & DefaultSession["user"];
  }

  interface Profile {
    screen_name?: string;
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    handle?: string;
  }
}
