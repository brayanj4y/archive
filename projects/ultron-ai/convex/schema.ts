import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    activeOrganizationId: v.optional(v.string()),
    createdAt: v.number(),
    email: v.optional(v.string()),
    emailVerified: v.optional(v.boolean()),
    externalId: v.string(),
    firstName: v.optional(v.string()),
    fullName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    lastName: v.optional(v.string()),
    onboardingComplete: v.optional(v.boolean()),
    tokenIdentifier: v.string(),
    updatedAt: v.number(),
    username: v.optional(v.string()),
  })
    .index("byExternalId", ["externalId"])
    .index("byTokenIdentifier", ["tokenIdentifier"])
    .index("byEmail", ["email"]),
});
