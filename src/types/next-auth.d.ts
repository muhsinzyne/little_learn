import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      activeChildProfileId?: number | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    activeChildProfileId?: number | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    activeChildProfileId?: number | null;
  }
}
