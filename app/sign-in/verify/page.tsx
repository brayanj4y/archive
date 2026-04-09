"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ONBOARDING_URL, SIGN_IN_URL } from "@/lib/routes";

export default function VerifySignInPage() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const verification = signIn?.emailLink.verification;
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function finalizeVerification() {
      if (!signIn || verification?.status !== "verified") {
        return;
      }

      setStatusMessage("Finalizing sign-in...");

      try {
        const { error } = await signIn.finalize();

        if (error) {
          throw error;
        }

        router.replace(ONBOARDING_URL);
      } catch {
        setStatusMessage("Verification completed. Return to sign in and try again.");
      }
    }

    void finalizeVerification();
  }, [router, signIn, verification?.status]);

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-3">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Sign in verification
          </div>
          <CardTitle>Check your sign-in status</CardTitle>
          <CardDescription>
            Open the magic link from the same browser where you started sign-in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {statusMessage ? <p>{statusMessage}</p> : null}
          {!verification ? <p>Loading verification state...</p> : null}
          {verification?.status === "verified" ? (
            <p>Verification complete.</p>
          ) : null}
          {verification?.status === "expired" ? (
            <p>The sign-in link expired. Request a new one and try again.</p>
          ) : null}
          {verification?.status === "failed" ? (
            <p>The sign-in link failed. Start over and request a fresh link.</p>
          ) : null}
          {verification?.status === "client_mismatch" ? (
            <p>
              This link has to be opened from the same device and browser where
              sign-in started.
            </p>
          ) : null}
          <Link
            className="inline-flex font-medium text-foreground underline underline-offset-4"
            href={SIGN_IN_URL}
          >
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
