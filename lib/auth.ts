import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";

export async function getViewerState() {
  const { orgId, userId } = await auth({ treatPendingAsSignedOut: false });

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

  const user = await currentUser();
  const onboardingComplete = user?.unsafeMetadata?.onboardingComplete === true;
  const heardAboutUs =
    typeof user?.unsafeMetadata?.heardAboutUs === "string"
      ? user.unsafeMetadata.heardAboutUs
      : null;

  return {
    heardAboutUs,
    isAuthenticated: true,
    needsOnboarding: !onboardingComplete,
    onboardingComplete,
    orgId,
    userId,
  };
}
