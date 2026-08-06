import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";


function todayISO(): string {
    return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
    const msPerDay = 86_400_000;
    return Math.round(
        (new Date(b).getTime() - new Date(a).getTime()) / msPerDay
    );
}


export const getStreak = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const streak = await ctx.db
            .query("streaks")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        if (!streak) return { currentStreak: 0, longestStreak: 0, lastStreakDate: null };
        return streak;
    },
});


export const getStreakForUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        const streak = await ctx.db
            .query("streaks")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        if (!streak) return { currentStreak: 0, longestStreak: 0 };
        return { currentStreak: streak.currentStreak, longestStreak: streak.longestStreak };
    },
});


export const checkAndUpdateStreak = internalMutation({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        const today = todayISO();

        const existing = await ctx.db
            .query("streaks")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        if (!existing) {

            await ctx.db.insert("streaks", {
                userId,
                currentStreak: 1,
                longestStreak: 1,
                lastStreakDate: today,
            });
            return;
        }

        const { lastStreakDate, currentStreak, longestStreak } = existing;

        if (lastStreakDate === today) {

            return;
        }

        const gap = lastStreakDate ? daysBetween(lastStreakDate, today) : 999;

        let newCurrent: number;
        if (gap === 1) {

            newCurrent = currentStreak + 1;
        } else {

            newCurrent = 1;
        }

        const newLongest = Math.max(longestStreak, newCurrent);

        await ctx.db.patch(existing._id, {
            currentStreak: newCurrent,
            longestStreak: newLongest,
            lastStreakDate: today,
        });
    },
});
