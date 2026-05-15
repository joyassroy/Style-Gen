import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; // এটি যোগ করুন
import connectDB from "@/utils/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials: any) {
        const { email, password } = credentials;
        try {
          await connectDB();
          const user = await User.findOne({ email });
          if (!user) throw new Error("No user found!");
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) throw new Error("Wrong password!");
          
          return { id: user._id.toString(), name: user.name, email: user.email, role: user.role || "user" };
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account.provider === "google") {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });
          
          // যদি নতুন ইউজার হয়, তাকে ডিফল্ট 'user' রোল দিয়ে সেভ করুন
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              role: "user", 
            });
          }
          user.role = existingUser?.role || "user"; // রোলটি সেশনে পাস করার জন্য সেট করুন
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }: any) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) session.user.role = token.role;
      return session;
    },
  },
  session: { strategy: "jwt" as const},
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };