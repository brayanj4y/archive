import { redirect } from "next/navigation";
import { getViewerState } from "@/lib/auth";
import { SIGN_IN_URL } from "@/lib/routes";

export default async function OnboardingPage() {
  const viewer = await getViewerState();

  if (!viewer.isAuthenticated) {
    redirect(SIGN_IN_URL);
  }

  redirect("/");
}
