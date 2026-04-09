"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getClerkErrorMessage } from "@/components/auth/utils";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HEARD_ABOUT_OPTIONS = [
  "X / Twitter",
  "GitHub",
  "YouTube",
  "Friend or colleague",
  "Google search",
  "Product Hunt",
  "Another community",
];

type OnboardingFormProps = {
  initialHeardAboutUs: string | null;
};

export function OnboardingForm({
  initialHeardAboutUs,
}: OnboardingFormProps) {
  const router = useRouter();
  const [heardAboutUs, setHeardAboutUs] = React.useState(
    initialHeardAboutUs ?? "",
  );
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!acceptedTerms) {
      setErrorMessage("You must accept the terms to continue.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/onboarding", {
        body: JSON.stringify({
          heardAboutUs,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;

        throw new Error(data?.error ?? "Failed to save onboarding details.");
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      if (isClerkError(error)) {
        setErrorMessage(getClerkErrorMessage(error));
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(String(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10">
      <Form className="max-w-80" onSubmit={handleSubmit}>
        <Field className="gap-2.5">
          <FieldLabel>How did you hear about us?</FieldLabel>
          <Select
            onValueChange={(value) => setHeardAboutUs(value ?? "")}
            value={heardAboutUs}
          >
            <SelectTrigger size="default">
              <SelectValue placeholder="Select a source" />
            </SelectTrigger>
            <SelectPopup>
              {HEARD_ABOUT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </Field>
        {errorMessage ? <Alert variant="error">{errorMessage}</Alert> : null}
        <Button
          className="w-full"
          disabled={isSubmitting || !heardAboutUs || !acceptedTerms}
          loading={isSubmitting}
          type="submit"
        >
          Finish setup
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
      </Form>
    </main>
  );
}

function isClerkError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    Array.isArray((error as { errors?: unknown[] }).errors)
  );
}
