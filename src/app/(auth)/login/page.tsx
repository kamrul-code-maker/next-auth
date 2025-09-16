"use client";

import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "./loginForm";



export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Card className="w-full max-w-sm shadow-xl rounded-2xl">
      <LoginForm/>
      </Card>
    </div>
  );
}
