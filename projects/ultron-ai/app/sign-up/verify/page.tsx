import { redirect } from "next/navigation";
import { SIGN_UP_URL } from "@/lib/routes";

export default function VerifySignUpPage() {
  redirect(SIGN_UP_URL);
}
