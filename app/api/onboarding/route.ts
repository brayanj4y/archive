import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

type RequestPayload = {
  heardAboutUs?: string;
};

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as RequestPayload | null;
  const heardAboutUs = body?.heardAboutUs?.trim();

  if (!heardAboutUs) {
    return NextResponse.json(
      { error: "Please tell us how you heard about Ultron." },
      { status: 400 },
    );
  }

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    unsafeMetadata: {
      heardAboutUs,
      onboardingComplete: true,
    },
  });

  return NextResponse.json({ ok: true });
}
