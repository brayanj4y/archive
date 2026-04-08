"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { getClerkErrorMessage } from "@/components/auth/utils";
import { ONBOARDING_URL, SSO_CALLBACK_URL } from "@/lib/routes";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function SignInForm() {
  const router = useRouter();
  const { fetchStatus, signIn } = useSignIn();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isSendingLink, setIsSendingLink] = React.useState(false);
  const [isWaitingForLink, setIsWaitingForLink] = React.useState(false);
  const [isStartingOAuth, setIsStartingOAuth] = React.useState(false);
  const [oauthProvider, setOAuthProvider] = React.useState<
    "google" | "github" | null
  >(null);

  const isLoaded = fetchStatus !== "fetching";
  const isBusy = isSendingLink || isWaitingForLink || isStartingOAuth;

  async function handleMagicLinkSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!isLoaded || !signIn) {
      return;
    }

    setErrorMessage("");
    setIsSendingLink(true);
    setIsWaitingForLink(false);

    try {
      const { error } = await signIn.emailLink.sendLink({
        emailAddress,
        verificationUrl: `${window.location.origin}/sign-in/verify`,
      });

      if (error) {
        throw error;
      }

      setIsWaitingForLink(true);
      setIsSendingLink(false);

      const waitResult = await signIn.emailLink.waitForVerification();

      if (waitResult.error) {
        throw waitResult.error;
      }

      if (signIn.status === "complete") {
        const { error: finalizeError } = await signIn.finalize();

        if (finalizeError) {
          throw finalizeError;
        }

        router.replace(ONBOARDING_URL);
        return;
      }

      throw new Error("Sign-in did not complete. Please try again.");
    } catch (error) {
      setErrorMessage(getClerkErrorMessage(error));
      setIsSendingLink(false);
      setIsWaitingForLink(false);
    }
  }

  async function handleOAuth(provider: "google" | "github") {
    if (!isLoaded || !signIn) {
      return;
    }

    setErrorMessage("");
    setIsStartingOAuth(true);
    setOAuthProvider(provider);

    try {
      const { error } = await signIn.sso({
        redirectCallbackUrl: SSO_CALLBACK_URL,
        redirectUrl: ONBOARDING_URL,
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
        disabled={!isLoaded || isBusy}
        loadingProvider={oauthProvider}
        onSelect={handleOAuth}
      />
      <Form className="max-w-80" onSubmit={handleMagicLinkSubmit}>
        <Field className="gap-2.5">
          <FieldLabel htmlFor="sign-in-email">Email address</FieldLabel>
          <Input
            autoComplete="email"
            id="sign-in-email"
            name="email"
            onChange={(event) => setEmailAddress(event.target.value)}
            placeholder="founder@ultron.ai"
            required
            type="email"
            value={emailAddress}
          />
          <FieldError>Please enter a valid email.</FieldError>
        </Field>
        {errorMessage ? <Alert variant="error">{errorMessage}</Alert> : null}
        {isWaitingForLink ? (
          <Alert>
            Check your inbox and open the magic link to finish signing in.
          </Alert>
        ) : null}
        <Button
          className="w-full"
          disabled={!isLoaded || isBusy}
          loading={isSendingLink}
          type="submit"
        >
          Send magic link
        </Button>
        <div id="clerk-captcha" />
      </Form>
    </div>
  );
}
