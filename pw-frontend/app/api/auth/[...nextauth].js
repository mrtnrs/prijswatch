import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn(user, account, profile) {
      console.log("User:", user);
      console.log("Account:", account);
      console.log("Profile:", profile);
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: '/api/auth/error', // Add this line
  },
  site: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
});