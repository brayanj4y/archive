export {};

declare global {
  interface UserUnsafeMetadata {
    heardAboutUs?: string;
    onboardingComplete?: boolean;
  }

  interface SignUpUnsafeMetadata {
    heardAboutUs?: string;
    onboardingComplete?: boolean;
  }
}
