import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/utils/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials: any) {
        const { email, password } = credentials;

        try {
          await connectDB();
          const user = await User.findOne({ email });

          if (!user) {
            throw new Error("No user found with this email!");
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            throw new Error("Password does not match!");
          }

          // এখানে আমরা id, name, email এর পাশাপাশি role ও রিটার্ন করছি
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role || "user", // ডাটাবেসে role না থাকলে ডিফল্ট "user"
          };
        } catch (error: any) {
          console.log("Error during authorization: ", error);
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    // ১. JWT টোকেন তৈরির সময় role অ্যাড করা
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // ২. সেশনে role ডাটাটি এভেইলএবল করা যাতে ফ্রন্টএন্ডে useSession() দিয়ে পাওয়া যায়
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };