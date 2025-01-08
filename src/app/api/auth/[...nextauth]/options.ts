import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "credentials",
			credentials: {
				email: {
					label: "email",
					type: "text",
				},
				password: {
					label: "password",
					type: "password",
				},
			},

			async authorize(credentials: any): Promise<any> {
				try {
					await dbConnect();
					// Find the user with email
					const user = await UserModel.findOne({
						email: credentials.identifier,
					});

					if (!user) {
						throw new Error("No user found with this email");
					}

					const isPasswordCorrect = await bcrypt.compare(
						credentials.password,
						user.password
					);

					if (!isPasswordCorrect) {
						throw new Error("Incorrect password");
					}

					return user;
				} catch (error: any) {
					throw new Error(error);
				}
			},
		}),
	],
	pages: {
		signIn: "/sign-in",
	},
	callbacks: {
		async session({ session, token }) {
			if (token) {
				session.user._id = token._id;
				session.user.email = token.email;
			}
			return session;
		},
		async jwt({ token, user }) {
			if (user) {
				token._id = user._id?.toString();
				token.email = user.email;
			}
			return token;
		},
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
};
