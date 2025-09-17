import { Button } from '@/components/ui/button'
import React from 'react'
import { useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { signIn } from 'next-auth/react';

function SocialLink() {

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const onClick = (provider: "google" | "github") => {
        signIn(provider, {
            callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        });
    }
    return (
        <div className="mt-4 space-y-2">
            <Button
                variant="outline"
                className="w-full"
                onClick={() => onClick("google")}

            >
                Continue with Google
            </Button>
            <Button
                variant="outline"
                className="w-full"
                onClick={() => onClick("github")}
            >
                Continue with GitHub
            </Button>
        </div>
    )
}

export default SocialLink