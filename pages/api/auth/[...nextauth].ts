import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../models/User";
import db from "../../../utils/db";
import { isPasswordValid } from "../../../utils/hash";
import { TOKEN_EXPIRES_IN } from "../../../config";

export default NextAuth({
  pages: {
    signIn: "/",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      //@ts-ignore
      async authorize(credentials: any) {
        await db.connect();

        const user = await User.findOne({ username: credentials.username });

        // Check if user exists
        if (!user) {
          return null;
        }

        // Validate password
        const isPasswordMatch = await isPasswordValid(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) {
          return null;
        }

        return {
          name: user.name,
          username: user.username,
        };
      },
    }),
  ],

  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
    maxAge: TOKEN_EXPIRES_IN,
  },
});
