import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { HOME_URL, SIGN_IN_URL, SIGN_UP_URL } from "@/lib/routes";

export default function SsoCallbackPage() {
  return (
    <AuthenticateWithRedirectCallback
      continueSignUpUrl={HOME_URL}
      signInFallbackRedirectUrl={HOME_URL}
      signInUrl={SIGN_IN_URL}
      signUpFallbackRedirectUrl={HOME_URL}
      signUpUrl={SIGN_UP_URL}
    />
  );
}
