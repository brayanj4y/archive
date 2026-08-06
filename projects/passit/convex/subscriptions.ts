import { v } from "convex/values";
import { mutation, query, internalQuery } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";


export const getSubscription = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .first();

        return sub ?? null;
    },
});


export const isSubscribed = internalQuery({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        const now = Date.now();
        const sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_user_status", (q) =>
                q.eq("userId", userId).eq("status", "active")
            )
            .first();

        if (!sub) return false;
        return sub.expiresAt > now;
    },
});



export const upsertSubscription = mutation({
    args: {
        userId: v.id("users"),
        status: v.union(
            v.literal("active"),
            v.literal("expired"),
            v.literal("cancelled"),
        ),
        provider: v.union(v.literal("momo"), v.literal("stripe")),
        expiresAt: v.number(),
    },
    handler: async (ctx, { userId, status, provider, expiresAt }) => {
        const now = Date.now();


        const existing = await ctx.db
            .query("subscriptions")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                status,
                provider,
                expiresAt,
                updatedAt: now,
            });
        } else {
            await ctx.db.insert("subscriptions", {
                userId,
                status,
                provider,
                expiresAt,
                createdAt: now,
                updatedAt: now,
            });
        }


        const userStatus = status === "active" ? "active" : "expired";
        await ctx.db.patch(userId, { subscriptionStatus: userStatus });
    },
});


export const cancelSubscription = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Must be authenticated");

        const sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_user_status", (q) =>
                q.eq("userId", userId).eq("status", "active")
            )
            .first();

        if (!sub) throw new Error("No active subscription found");

        const now = Date.now();
        await ctx.db.patch(sub._id, {
            status: "cancelled",
            updatedAt: now,
        });

        await ctx.db.patch(userId, { subscriptionStatus: "free" });
    },
});
