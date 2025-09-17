
"use client";

import { auth } from "@/auth";
import { signOut } from "next-auth/react";

export default  function SignOutButton() {
  // const session = await auth()
  return (
    <>

      {/* <pre>{JSON.stringify(session)}</pre> */}
      <button
        onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Sign Out
      </button>
    </>

  );
}
