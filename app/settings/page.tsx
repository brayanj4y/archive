import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getViewerState } from "@/lib/auth";
import { ONBOARDING_URL, SIGN_IN_URL } from "@/lib/routes";

export default async function SettingsPage() {
  const viewer = await getViewerState();

  if (!viewer.isAuthenticated) {
    redirect(SIGN_IN_URL);
  }

  if (viewer.needsOnboarding) {
    redirect(ONBOARDING_URL);
  }

  return <AppShell title="Settings" />;
}
