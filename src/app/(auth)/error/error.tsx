"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // NextAuth error from URL
  const errorType = searchParams.get("error");

  // User-friendly message
  let message = "Something went wrong! Please try again.";

  if (errorType === "OAuthAccountNotLinked") {
    message = "Email already in use with different provider!";
  } else if (errorType === "CredentialsSignin") {
    message = "Invalid email or password!";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Login Error</h1>
      <p className="text-gray-700 mb-6">{message}</p>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          onClick={() => router.back()}
        >
          Go Back
        </button>
        <Link
          href="/login"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login Page
        </Link>
      </div>
    </div>
  );
}
