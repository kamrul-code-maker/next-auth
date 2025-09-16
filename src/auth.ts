// src/auth.ts

import NextAuth from "next-auth"
import { prisma } from "./lib/prisma"
import authConfig from "./auth.config"

import {PrismaAdapter}  from "@auth/prisma-adapter"

 
// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [],
// })

export const {
  handlers:{GET, POST} , auth,  signIn, signOut
} = NextAuth({
  adapter:PrismaAdapter(prisma), 
  session:{strategy:"jwt"},
  ...authConfig
})


// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   session: { strategy: "jwt" },
//   ...authConfig,
// });
