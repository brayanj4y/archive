"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Provider = "google" | "github";

type SocialAuthButtonsProps = {
  disabled?: boolean;
  loadingProvider?: Provider | null;
  onSelect: (provider: Provider) => void;
};

export function SocialAuthButtons({
  disabled = false,
  loadingProvider = null,
  onSelect,
}: SocialAuthButtonsProps) {
  return (
    <div className="space-y-3">
      <Button
        className="w-full justify-center"
        disabled={disabled}
        loading={loadingProvider === "google"}
        onClick={() => onSelect("google")}
        type="button"
        variant="outline"
      >
        <GoogleIcon />
        Continue with Google
      </Button>
      <Button
        className="w-full justify-center"
        disabled={disabled}
        loading={loadingProvider === "github"}
        onClick={() => onSelect("github")}
        type="button"
        variant="outline"
      >
        <GitHubMark />
        Continue with GitHub
      </Button>
      <Separator />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.6 12.227c0-.818-.073-1.6-.209-2.355H12v4.455h5.382a4.604 4.604 0 0 1-1.996 3.021v2.507h3.227c1.89-1.741 2.987-4.309 2.987-7.628Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.964-.895 6.618-2.418l-3.227-2.507c-.895.6-2.041.954-3.39.954-2.607 0-4.816-1.76-5.606-4.127H3.059v2.585A9.995 9.995 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.395 13.902A5.997 5.997 0 0 1 6.081 12c0-.66.113-1.3.314-1.902V7.513H3.06A9.995 9.995 0 0 0 2 12c0 1.612.386 3.139 1.06 4.487l3.335-2.585Z"
        fill="#FBBC04"
      />
      <path
        d="M12 5.971c1.468 0 2.787.505 3.824 1.496l2.868-2.868C16.96 2.985 14.696 2 12 2a9.995 9.995 0 0 0-8.94 5.513l3.335 2.585C7.184 7.73 9.393 5.971 12 5.971Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 fill-current"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 .5a12 12 0 0 0-3.794 23.385c.6.11.82-.261.82-.58 0-.287-.01-1.047-.016-2.055-3.338.726-4.042-1.608-4.042-1.608-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.206.085 1.84 1.239 1.84 1.239 1.072 1.837 2.813 1.307 3.497 1 .108-.776.42-1.307.763-1.607-2.665-.303-5.466-1.333-5.466-5.932 0-1.31.468-2.381 1.236-3.22-.123-.304-.536-1.527.117-3.183 0 0 1.008-.322 3.3 1.23a11.49 11.49 0 0 1 6.008 0c2.29-1.552 3.297-1.23 3.297-1.23.655 1.656.242 2.879.12 3.183.77.839 1.235 1.91 1.235 3.22 0 4.61-2.806 5.626-5.479 5.921.431.372.816 1.102.816 2.222 0 1.604-.014 2.898-.014 3.293 0 .322.216.694.825.576A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}
