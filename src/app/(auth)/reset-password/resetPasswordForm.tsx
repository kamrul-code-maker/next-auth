"use client";

import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { SuccessErrorMessage } from "@/components/SuccessErrorMessage";
import { ResetSchema } from "@/lib/schemas/resetSchme";
import { resetPassword } from "@/app/actions/auth/resetPassword";
// <-- You need to create this action

// ✅ Reset Schema (using Zod)


export default function ResetPasswordForm() {
  return (
    <CardContent className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>

      <Formik
        initialValues={{ email: "" }}
        validate={(values) => {
          const result = ResetSchema.safeParse(values);
          if (!result.success) {
            return result.error.flatten().fieldErrors;
          }
          return {};
        }}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            const data = await resetPassword(values);

            if (data?.error) {
              setStatus({ success: null, error: data.error });
            } else if (data?.success) {
              setStatus({ success: data.success, error: null });
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
            <div>
              <Field
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Success & Error */}
            <SuccessErrorMessage error={status?.error} success={status?.success} />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              Send Reset Link
            </Button>
          </Form>
        )}
      </Formik>

      {/* Back to login link */}
      <p className="text-center text-sm mt-4">
        Remembered your password?{" "}
        <Link href="/login" className="text-purple-600 hover:underline">
          Login
        </Link>
      </p>
    </CardContent>
  );
}
