// auth.config.ts 
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "./lib/schemas/loginSchema";
import { getUseByEmail } from "./app/actions/user/user";
export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = loginSchema.safeParse(credentials);
                if (validatedFields.success) {
                    const { email, password } = validatedFields.data
                    const user = await getUseByEmail(email)
                    if (!user || !user.password) return null;
                    const passwordsMatch = await bcrypt.compare(password, user.password)

                    if (passwordsMatch) return user;
                    
                }

                return null 
            }
        })
  
    ]
} satisfies NextAuthConfig