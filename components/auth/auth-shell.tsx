import type { ReactNode } from "react";
import Link from "next/link";

type AuthShellProps = {
  children: ReactNode;
  footerHref: string;
  footerLabel: string;
  footerPrompt: string;
};

export function AuthShell({
  children,
  footerHref,
  footerLabel,
  footerPrompt,
}: AuthShellProps) {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10">
      <div className="w-full max-w-80 space-y-4">
        {children}
        <p className="text-sm text-muted-foreground">
          {footerPrompt}{" "}
          <Link
            className="font-medium text-foreground underline underline-offset-4"
            href={footerHref}
          >
            {footerLabel}
          </Link>
        </p>
      </div>
    </main>
  );
}
