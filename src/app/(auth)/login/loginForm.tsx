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




export default function LoginForm() {

    const searchParams = useSearchParams();
    //   const callbackUrl = searchParams.get("callbackUrl");
    const urlError =
        searchParams.get("error") === "OAuthAccountNotLinked"
            ? "Email already in use with different provider!"
            : "";
    return (
        <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

            <Formik
                initialValues={{ email: "", password: "" }}
                validate={(values) => {
                    const result = loginSchema.safeParse(values);
                    if (!result.success) {
                        return result.error.flatten().fieldErrors;
                    }
                    return {};
                }}
                onSubmit={async (values, { setSubmitting, setStatus }) => {
                    try {
                        const data = await login(values);

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

                        {/* OAuthAccountNotLinked error */}
                        {urlError && <p className="text-red-500">{urlError}</p>}

                        {/* Submit */}
                        <Button type="submit" className="w-full" disabled={isSubmitting} >
                            Login
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
    )
}
