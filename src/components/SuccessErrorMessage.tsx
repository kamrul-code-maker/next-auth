"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface SuccessErrorMessageProps {
  error?: string | null;
  success?: string | null;
}

export function SuccessErrorMessage({ error, success }: SuccessErrorMessageProps) {
  if (!error && !success) return null;

  return (
    <div className="mt-4 space-y-2">
      {error && (
        <Alert variant="destructive" className="rounded-2xl shadow-md">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="font-semibold">Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-600/30 bg-green-50 rounded-2xl shadow-md">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertTitle className="font-semibold text-green-700">Success</AlertTitle>
          <AlertDescription className="text-green-700">
            {success}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
