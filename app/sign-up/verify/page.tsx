"use client";

import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifySignUpPage() {
  const { signUp } = useSignUp();
  const verification = signUp?.verifications.emailLinkVerification;

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-3">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Sign up verification
          </div>
          <CardTitle>Finish verifying your email</CardTitle>
          <CardDescription>
            Once the magic link succeeds, your account can continue into
            onboarding.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {!verification ? <p>Loading verification state...</p> : null}
          {verification?.status === "verified" ? (
            <p>Verification complete. Return to the original tab to continue.</p>
          ) : null}
          {verification?.status === "expired" ? (
            <p>The sign-up link expired. Request another one and try again.</p>
          ) : null}
          {verification?.status === "failed" ? (
            <p>The sign-up link failed. Start over and request a new link.</p>
          ) : null}
          {verification?.status === "client_mismatch" ? (
            <p>
              This link has to be opened from the same device and browser where
              sign-up started.
            </p>
          ) : null}
          <Link
            className="inline-flex font-medium text-foreground underline underline-offset-4"
            href="/sign-up"
          >
            Back to sign up
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
