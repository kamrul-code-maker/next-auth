# NextAuth v5 + Google & GitHub Authentication (Beginner-Friendly)

এই নোটটি step-by-step এবং line-by-line বাংলা ব্যাখ্যা সহ তৈরি করা হয়েছে যাতে একজন beginner সহজে বুঝতে পারে।

---

## 1️⃣ প্রোজেক্ট সেটআপ

**Step 1:** Next.js প্রোজেক্ট তৈরি করুন

```bash
npx create-next-app@latest nextauth-demo
cd nextauth-demo
```

**Step 2:** প্রয়োজনীয় প্যাকেজ ইন্সটল করুন

```bash
npm install next-auth @auth/prisma-adapter prisma bcryptjs
npm install @prisma/client
```

**Step 3:** Prisma init করুন

```bash
npx prisma init
```

* `.env` ফাইল আপডেট করুন:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

**Step 4:** Prisma schema setup (src/prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String    @id @default(cuid())
  name           String?
  email          String    @unique
  emailVerified  DateTime?
  password       String?
  image          String?
  accounts       Account[]
  sessions       Session[]
}

model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  access_token       String?
  refresh_token      String?
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
```

**Step 5:** Prisma migrate করুন

```bash
npx prisma migrate dev --name init
```

---

## 2️⃣ NextAuth Configuration (src/lib/auth.ts)

```ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "../prisma/client"
import bcrypt from "bcryptjs"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user || !user.password) return null
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null
        return user
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const existingUser = await prisma.user.findUnique({ where: { email: user.email! } })
      if (existingUser && account) {
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          update: {},
          create: {
            userId: existingUser.id,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            type: account.type,
            access_token: account.access_token,
            refresh_token: account.refresh_token,
          },
        })
      }
      return true
    },
  },
}

export default NextAuth(authOptions)
```

* এখানে আমরা Google, GitHub এবং Credentials provider setup করেছি।
* `signIn callback` → multiple providers একই ইউজারের সাথে link করতে।

---

## 3️⃣ Login Page (app/login/page.tsx)

```tsx
"use client";

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email already in use with different provider!"
    : ""

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Login Page</h1>
      {urlError && <p className="text-red-500 mb-4">{urlError}</p>}

      <button className="mb-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => signIn('google')}>
        Sign in with Google
      </button>

      <button className="px-4 py-2 bg-gray-800 text-white rounded" onClick={() => signIn('github')}>
        Sign in with GitHub
      </button>
    </div>
  )
}
```

* এখানে OAuthAccountNotLinked error দেখানো হচ্ছে।

---

## 4️⃣ Error Page (app/error/page.tsx)

```tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const errorType = searchParams.get("error")

  let message = "Something went wrong! Please try again."
  if (errorType === "OAuthAccountNotLinked") message = "Email already in use with different provider!"
  else if (errorType === "CredentialsSignin") message = "Invalid email or password!"

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Login Error</h1>
      <p className="text-gray-700 mb-6">{message}</p>
      <div className="flex gap-4">
        <button onClick={() => router.back()} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">Go Back</button>
        <Link href="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login Page</Link>
      </div>
    </div>
  )
}
```

* সব ধরনের NextAuth error (OAuthAccountNotLinked, CredentialsSignin, ইত্যাদি) দেখানো যাবে।

---

## 5️⃣ Authentication Flow Diagram

```text
User clicks "Login with Google" or "GitHub"
        |
        v
NextAuth tries OAuth login
        |
        v
Error occurs? ----> No ----> Successful login
        |
       Yes
        |
        v
Redirect to /error?error=ERROR_TYPE
        |
        v
Custom ErrorPage reads error param
        |
        v
Shows friendly error message
        |
        v
User clicks Go Back or Login Page to retry
```

---

## 6️⃣ Notes

* "use client" ব্যবহার করুন যেসব ফাইলে `useSearchParams` বা `router` ব্যবহার করছেন।
* Credentials login এবং OAuth login error আলাদাভাবে handle করা হয়েছে।
* Prisma Adapter দিয়ে multiple providers একই ইউজারের সাথে link করা যায়।
* Error page এবং login page সহজে customize করা যাবে Tailwind দিয়ে।
