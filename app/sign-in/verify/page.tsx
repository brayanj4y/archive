import { redirect } from "next/navigation";
import { SIGN_IN_URL } from "@/lib/routes";

export default function VerifySignInPage() {
  redirect(SIGN_IN_URL);
}
