import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { getViewerState } from "@/lib/auth";
import { ONBOARDING_URL } from "@/lib/routes";

export default async function SignUpPage() {
  const viewer = await getViewerState();

  if (viewer.isAuthenticated) {
    redirect(viewer.needsOnboarding ? ONBOARDING_URL : "/");
  }

  return (
    <AuthShell
      footerHref="/sign-in"
      footerLabel="Sign in"
      footerPrompt="Already have an account?"
    >
      <SignUpForm />
    </AuthShell>
  );
}
