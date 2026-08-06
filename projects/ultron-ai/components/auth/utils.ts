export function getClerkErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    Array.isArray((error as { errors?: unknown[] }).errors) &&
    (error as { errors: Array<{ longMessage?: string; message?: string }> }).errors
      .length > 0
  ) {
    const firstError = (error as {
      errors: Array<{ longMessage?: string; message?: string }>;
    }).errors[0];

    return (
      firstError.longMessage ??
      firstError.message ??
      "Something went wrong. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
