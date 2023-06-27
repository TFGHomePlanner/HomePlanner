import GithubProvider from "next-auth/providers/github";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {   
	callbacks: {
		async jwt({ token, account }) {
			// Persist the OAuth access_token to the token right after signin
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		},
		async session({ session, token, user }) {
			// Send properties to the client, like an access_token from a provider.
			if (session.user && token.role && token.id) {
				session.user.id = token.id;
			}
			return session;
		},
	},
	// Configure one or more authentication providers
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID || "",
			clientSecret: process.env.GITHUB_SECRET || "",
		}),
		/*CredentialsProvider({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const creds = await loginSchema.parseAsync(credentials);
        const user = await prisma.user.findFirst({
          where: { email: creds.email },
        });
        if (!user) {
          return null;
        }
        const isValidPassword = credentials?.password === user.passwordHash;
        if (!isValidPassword) {
          return null;
        }
        return user;
      },
    }),*/
	],
};

export default NextAuth(authOptions);
