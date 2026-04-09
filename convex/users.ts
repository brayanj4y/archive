import {
  mutationGeneric,
  queryGeneric,
  type GenericMutationCtx,
  type GenericQueryCtx,
} from "convex/server";

export const current = queryGeneric({
  args: {},
  handler: async (ctx) => {
    return getCurrentUser(ctx);
  },
});

export const store = mutationGeneric({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Called users.store without authentication present");
    }

    const now = Date.now();
    const userAttributes = {
      email: identity.email,
      emailVerified: identity.emailVerified,
      externalId: identity.subject,
      firstName: identity.givenName,
      fullName: identity.name ?? identity.email ?? "Anonymous",
      imageUrl: identity.pictureUrl,
      lastName: identity.familyName,
      tokenIdentifier: identity.tokenIdentifier,
      updatedAt: now,
      username: identity.nickname ?? identity.preferredUsername,
    };

    const existingUser = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, userAttributes);
      return existingUser._id;
    }

    return await ctx.db.insert("users", {
      ...userAttributes,
      activeOrganizationId: undefined,
      createdAt: now,
      onboardingComplete: false,
    });
  },
});

type UserContext = GenericQueryCtx<any> | GenericMutationCtx<any>;

export async function getCurrentUser(ctx: UserContext) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  return await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
    .unique();
}

export async function getCurrentUserOrThrow(ctx: UserContext) {
  const user = await getCurrentUser(ctx);

  if (!user) {
    throw new Error("Authenticated user is missing from the Convex users table");
  }

  return user;
}
