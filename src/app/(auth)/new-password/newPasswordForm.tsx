"use client";

import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { SuccessErrorMessage } from "@/components/SuccessErrorMessage";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/app/actions/auth/newPassword";

// ✅ Schema
const newPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Reset token from email link

  return (
    <CardContent className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Set New Password</h1>

      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validate={(values) => {
          const result = newPasswordSchema.safeParse(values);
          if (!result.success) {
            return result.error.flatten().fieldErrors;
          }
          return {};
        }}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            if (!token) {
              setStatus({ success: null, error: "Invalid or missing token!" });
              return;
            }

            const data = await newPassword(values, token);

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
            {/* New Password */}
            <div>
              <Field
                type="password"
                name="password"
                placeholder="New Password"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <Field
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Status Messages */}
            <SuccessErrorMessage
              error={status?.error}
              success={status?.success}
            />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              Reset Password
            </Button>
          </Form>
        )}
      </Formik>

      {/* Back to login */}
      <p className="text-center text-sm mt-4">
        <Link href="/login" className="text-purple-600 hover:underline">
          Back to Login
        </Link>
      </p>
    </CardContent>
  );
}
