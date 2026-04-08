import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getViewerState } from "@/lib/auth";
import { ONBOARDING_URL } from "@/lib/routes";

export default async function SignInPage() {
  const viewer = await getViewerState();

  if (viewer.isAuthenticated) {
    redirect(viewer.needsOnboarding ? ONBOARDING_URL : "/");
  }

  return (
    <AuthShell
      footerHref="/sign-up"
      footerLabel="Create an account"
      footerPrompt="New to Ultron?"
    >
      <SignInForm />
    </AuthShell>
  );
}
