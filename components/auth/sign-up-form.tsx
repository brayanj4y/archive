"use client";

import * as React from "react";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import { getClerkErrorMessage } from "@/components/auth/utils";
import { HOME_URL, SSO_CALLBACK_URL } from "@/lib/routes";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { Alert } from "@/components/ui/alert";

export function SignUpForm() {
  const { fetchStatus, signUp } = useSignUp();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isStartingOAuth, setIsStartingOAuth] = React.useState(false);
  const [oauthProvider, setOAuthProvider] = React.useState<
    "google" | "github" | null
  >(null);

  const isLoaded = fetchStatus !== "fetching";
  const isBusy = isStartingOAuth;
  const shouldMountCaptcha = isStartingOAuth;

  async function handleOAuth(provider: "google" | "github") {
    if (!isLoaded || !signUp) {
      return;
    }

    setErrorMessage("");
    setIsStartingOAuth(true);
    setOAuthProvider(provider);

    try {
      const { error } = await signUp.sso({
        redirectCallbackUrl: SSO_CALLBACK_URL,
        redirectUrl: HOME_URL,
        strategy:
          provider === "google" ? "oauth_google" : "oauth_github",
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      setErrorMessage(getClerkErrorMessage(error));
      setIsStartingOAuth(false);
      setOAuthProvider(null);
    }
  }

  return (
    <div className="space-y-4">
      <SocialAuthButtons
        disabled={isBusy}
        loadingProvider={oauthProvider}
        onSelect={handleOAuth}
      />
      {errorMessage ? <Alert variant="error">{errorMessage}</Alert> : null}
      <p className="text-xs leading-5 text-muted-foreground">
        By signing up, you agree to our{" "}
        <Link className="underline underline-offset-4" href="#">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link className="underline underline-offset-4" href="#">
          Privacy Policy
        </Link>
        .
      </p>
      {shouldMountCaptcha ? <div id="clerk-captcha" /> : null}
    </div>
  );
}
