"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { getClerkErrorMessage } from "@/components/auth/utils";
import { ONBOARDING_URL, SSO_CALLBACK_URL } from "@/lib/routes";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function SignUpForm() {
  const router = useRouter();
  const { fetchStatus, signUp } = useSignUp();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isSendingLink, setIsSendingLink] = React.useState(false);
  const [isWaitingForLink, setIsWaitingForLink] = React.useState(false);
  const [isStartingOAuth, setIsStartingOAuth] = React.useState(false);
  const [oauthProvider, setOAuthProvider] = React.useState<
    "google" | "github" | null
  >(null);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

  const isLoaded = fetchStatus !== "fetching";
  const isBusy = isSendingLink || isWaitingForLink || isStartingOAuth;

  async function handleMagicLinkSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!isLoaded) {
      return;
    }

    if (!acceptedTerms) {
      setErrorMessage("You must accept the terms to continue.");
      return;
    }

    setErrorMessage("");
    setIsSendingLink(true);
    setIsWaitingForLink(false);

    try {
      if (!signUp) {
        setErrorMessage("Sign-up is not ready yet. Please try again.");
        setIsSendingLink(false);
        setIsWaitingForLink(false);
        return;
      }

      const { error: createError } = await signUp.create({ emailAddress });

      if (createError) {
        throw createError;
      }

      const { error: sendLinkError } = await signUp.verifications.sendEmailLink(
        {
          verificationUrl: `${window.location.origin}/sign-up/verify`,
        },
      );

      if (sendLinkError) {
        throw sendLinkError;
      }

      setIsWaitingForLink(true);
      setIsSendingLink(false);

      const waitResult =
        await signUp.verifications.waitForEmailLinkVerification();

      if (waitResult.error) {
        throw waitResult.error;
      }

      if (signUp.status === "complete") {
        const { error: finalizeError } = await signUp.finalize();

        if (finalizeError) {
          throw finalizeError;
        }

        router.replace(ONBOARDING_URL);
        return;
      }

      throw new Error("Sign-up did not complete. Please try again.");
    } catch (error) {
      setErrorMessage(getClerkErrorMessage(error));
      setIsSendingLink(false);
      setIsWaitingForLink(false);
    }
  }

  async function handleOAuth(provider: "google" | "github") {
    if (!isLoaded || !signUp) {
      return;
    }

    if (!acceptedTerms) {
      setErrorMessage("You must accept the terms to continue.");
      return;
    }

    setErrorMessage("");
    setIsStartingOAuth(true);
    setOAuthProvider(provider);

    try {
      const { error } = await signUp.sso({
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
        disabled={!isLoaded || isBusy || !acceptedTerms}
        loadingProvider={oauthProvider}
        onSelect={handleOAuth}
      />
      <Form className="max-w-80" onSubmit={handleMagicLinkSubmit}>
        <Field className="gap-2.5">
          <FieldLabel htmlFor="sign-up-email">Email</FieldLabel>
          <Input
            autoComplete="email"
            id="sign-up-email"
            name="email"
            onChange={(event) => setEmailAddress(event.target.value)}
            placeholder="you@company.com"
            required
            type="email"
            value={emailAddress}
          />
          <FieldError>Please enter a valid email.</FieldError>
        </Field>
        {errorMessage ? <Alert variant="error">{errorMessage}</Alert> : null}
        {isWaitingForLink ? (
          <Alert>
            Your magic link is on the way. Open it from your inbox to continue.
          </Alert>
        ) : null}
        <Button
          className="w-full"
          disabled={!isLoaded || isBusy || !acceptedTerms}
          loading={isSendingLink}
          type="submit"
        >
          Continue with magic link
        </Button>
        <label className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
          <Checkbox
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
          />
          <span>
            I agree to the{" "}
            <Link className="underline underline-offset-4" href="#">
              Terms
            </Link>{" "}
            and{" "}
            <Link className="underline underline-offset-4" href="#">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        <div id="clerk-captcha" />
      </Form>
    </div>
  );
}
