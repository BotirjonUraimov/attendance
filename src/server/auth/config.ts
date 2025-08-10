import NextAuth, { type NextAuthOptions, type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin12345";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const isEmailMatch = credentials.email === ADMIN_EMAIL;
        const isPasswordMatch = credentials.password === ADMIN_PASSWORD;
        if (isEmailMatch && isPasswordMatch) {
          const user: User = { id: "admin", name: "Admin", email: ADMIN_EMAIL };
          return user;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
