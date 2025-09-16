"use client";

import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { registerSchema } from "@/lib/schemas/registerSchema";
import { register } from "@/app/actions/auth/register";
import { SuccessErrorMessage } from "@/components/SuccessErrorMessage";




function RegisterForm() {
  return (
    <CardContent className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validate={(values) => {
          const result = registerSchema.safeParse(values);
          if (!result.success) {
            return result.error.flatten().fieldErrors;
          }
          return {};
        }}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            const data = await register(values); // API call
            if (data.error) {
              setStatus({ success: null, error: data.error });
            } else {
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
            {/* Name */}
            <div>
              <Field
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Email */}
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

            {/* Formik render এর মধ্যে */}
            <SuccessErrorMessage error={status?.error} success={status?.success} />

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Register
            </Button>
          </Form>
        )}
      </Formik>

      {/* Social register */}
      <div className="mt-4 space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => alert("Dummy Google Register 🚀")}
        >
          Continue with Google
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => alert("Dummy GitHub Register 🚀")}
        >
          Continue with GitHub
        </Button>
      </div>

      {/* Login link */}
      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-purple-600 hover:underline">
          Login
        </Link>
      </p>
    </CardContent>
  )
}

export default RegisterForm