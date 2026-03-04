import { v } from "convex/values";
import { mutation, query, internalQuery } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";


export const getMe = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;
        return ctx.db.get(userId);
    },
});


export const getUserProfile = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        const user = await ctx.db.get(userId);
        if (!user) return null;
        return {
            _id: user._id,
            name: user.name,
            username: user.username,
            avatarUrl: user.avatarUrl,
            totalXp: user.totalXp,
        };
    },
});


export const findUserByUsername = query({
    args: { username: v.string() },
    handler: async (ctx, { username }) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", username))
            .unique();
        if (!user) return null;
        return {
            _id: user._id,
            name: user.name,
            username: user.username,
            avatarUrl: user.avatarUrl,
            totalXp: user.totalXp,
        };
    },
});


export const isUsernameAvailable = query({
    args: { username: v.string() },
    handler: async (ctx, { username }) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", username.toLowerCase()))
            .unique();
        return existing === null;
    },
});



export const createUser = mutation({
    args: {
        username: v.string(),
    },
    handler: async (ctx, { username }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");


        const existing = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
            .unique();

        if (existing) return existing._id;


        const usernameLower = username.toLowerCase().trim();
        const taken = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", usernameLower))
            .unique();

        if (taken) throw new Error("Username already taken");

        const userId = await ctx.db.insert("users", {
            tokenIdentifier: identity.subject,
            email: identity.email ?? "",
            name: identity.name ?? "Passit User",
            username: usernameLower,
            avatarUrl: identity.pictureUrl ?? undefined,
            totalXp: 0,
            subscriptionStatus: "free",
        });

        return userId;
    },
});


export const updateProfile = mutation({
    args: {
        name: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
    },
    handler: async (ctx, { name, avatarUrl }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Must be authenticated");

        const patch: Record<string, string> = {};
        if (name) patch.name = name;
        if (avatarUrl) patch.avatarUrl = avatarUrl;

        await ctx.db.patch(userId, patch);
    },
});


export const getUser = internalQuery({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        return ctx.db.get(userId);
    },
});
