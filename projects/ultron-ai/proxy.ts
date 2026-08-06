import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { CHOOSE_ORGANIZATION_TASK_URL } from "@/lib/routes";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/session-tasks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return;
  }

  const { isAuthenticated, redirectToSignIn, sessionStatus } = await auth();

  if (!isAuthenticated && sessionStatus === "pending") {
    const url = req.nextUrl.clone();
    url.pathname = CHOOSE_ORGANIZATION_TASK_URL;
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (!isAuthenticated) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
