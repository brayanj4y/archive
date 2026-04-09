import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { TasksView } from "@/components/tasks-view";
import { getViewerState } from "@/lib/auth";
import { ONBOARDING_URL, SIGN_IN_URL } from "@/lib/routes";

export default async function TasksPage() {
  const viewer = await getViewerState();

  if (!viewer.isAuthenticated) {
    redirect(SIGN_IN_URL);
  }

  if (viewer.needsOnboarding) {
    redirect(ONBOARDING_URL);
  }

  return (
    <AppShell title="Tasks">
      <TasksView />
    </AppShell>
  );
}
