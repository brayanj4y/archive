import "server-only";

import { auth } from "@clerk/nextjs/server";

export async function getViewerState() {
  const { orgId, userId } = await auth();

  if (!userId) {
    return {
      heardAboutUs: null,
      isAuthenticated: false,
      needsOnboarding: false,
      onboardingComplete: false,
      orgId: null,
      userId: null,
    };
  }

  return {
    heardAboutUs: null,
    isAuthenticated: true,
    needsOnboarding: false,
    onboardingComplete: true,
    orgId,
    userId,
  };
}
