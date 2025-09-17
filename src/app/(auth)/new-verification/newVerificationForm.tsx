"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { newVerification } from "@/app/actions/auth/new-verification"


export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const onSubmit = useCallback(() => {
    if (success || error) return

    if (!token) {
      setError("Missing token!")
      return
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success)
        setError(data.error)
      })
      .catch(() => {
        setError("Something went wrong!")
      })
  }, [token, success, error])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <Card className="w-full max-w-md mx-auto shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">
          Confirming your verification
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-center min-h-[100px]">
          {!success && !error && (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          )}

          {success && (
            <p className="text-sm text-green-500 text-center mt-2">{success}</p>
          )}

          {!success && error && (
            <p className="text-sm text-red-500 text-center mt-2">{error}</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button asChild variant="link">
          <Link href="/login">Back to login</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
