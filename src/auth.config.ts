// auth.config.ts 
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "./lib/schemas/loginSchema";
import { getUserByEmail } from "./app/actions/user/user";
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
export default {
    providers: [
        // Google
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        // GitHub
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        Credentials({
            async authorize(credentials) {
                const validatedFields = loginSchema.safeParse(credentials);
                if (validatedFields.success) {
                    const { email, password } = validatedFields.data
                    const user = await getUserByEmail(email)
                    if (!user || !user.password) return null;
                    const passwordsMatch = await bcrypt.compare(password, user.password)

                    if (passwordsMatch) return user;

                }

                return null
            }
        })

    ]
} satisfies NextAuthConfig