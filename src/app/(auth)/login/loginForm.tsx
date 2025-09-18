"use client";

import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { loginSchema } from "@/lib/schemas/loginSchema";
import { login } from "@/app/actions/auth/login";
import { SuccessErrorMessage } from "@/components/SuccessErrorMessage";
import SocialLink from "../socialLink";
import { useSearchParams } from "next/navigation";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  return (
    <CardContent className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

      <Formik
        initialValues={{ email: "", password: "", code: "" }}
        validate={(values) => {
          const result = loginSchema.safeParse(values);
          if (!result.success) {
            return result.error.flatten().fieldErrors;
          }
          return {};
        }}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            const data = await login(values, callbackUrl);

            if (data?.error) {
              setStatus({ success: null, error: data.error });
            } else if (data?.success) {
              setStatus({ success: data.success, error: null });
            } else if (data?.twoFactor) {
              // backend বলছে 2FA দরকার
              setStatus({ twoFactor: true, error: null });
            }
          } catch (err) {
            setStatus({ success: null, error: "Something went wrong!" });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-4">
            {/* Email */}
            {!status?.twoFactor && (
              <>
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </>
            )}

            {/* Two Factor Code (যখন status.twoFactor true হবে তখন দেখাবে) */}
            {status?.twoFactor && (
              <div>
                <label className="block text-sm font-medium">Two Factor Code</label>
                <Field
                  type="text"
                  name="code"
                  placeholder="123456"
                  as={Input} // এখানে shadcn Input কে Formik এর Field হিসেবে ব্যবহার করা হচ্ছে
                  className="mt-1"
                />
                <ErrorMessage
                  name="code"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            )}

            {/* Success / Error */}
            <SuccessErrorMessage
              error={status?.error}
              success={status?.success}
            />

            {/* OAuthAccountNotLinked error */}
            {urlError && <p className="text-red-500">{urlError}</p>}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {status?.twoFactor ? "Verify Code" : "Login"}
            </Button>
          </Form>
        )}
      </Formik>

      {/* Social login */}
      <SocialLink />

      {/* Register link */}
      <p className="text-center text-sm mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-purple-600 hover:underline">
          Register
        </Link>
      </p>
    </CardContent>
  );
}
