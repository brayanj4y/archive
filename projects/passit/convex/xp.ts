import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── XP thresholds ────────────────────────────────────────────────────────
// Level = floor(totalXp / XP_PER_LEVEL) + 1, capped at MAX_LEVEL
const XP_PER_LEVEL = 100;
const MAX_LEVEL = 50;

export function computeLevel(xp: number): number {
    return Math.min(Math.floor(xp / XP_PER_LEVEL) + 1, MAX_LEVEL);
}

export function xpToNextLevel(xp: number): number {
    const level = computeLevel(xp);
    if (level >= MAX_LEVEL) return 0;
    return level * XP_PER_LEVEL - xp;
}

// ─── Get current week label ────────────────────────────────────────────────
function getWeekLabel(): string {
    const now = new Date();
    // ISO week: Jan 4 is always in week 1
    const target = new Date(now.valueOf());
    const dayNr = (now.getDay() + 6) % 7; // Mon=0..Sun=6
    target.setDate(target.getDate() - dayNr + 3);
    const jan4 = new Date(target.getFullYear(), 0, 4);
    const weekNum = 1 + Math.round((target.getTime() - jan4.getTime()) / 604_800_000);
    return `${target.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

// ─── Get XP breakdown by subject for current user ─────────────────────────
export const getUserXPBySubject = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const ledger = await ctx.db
            .query("xpLedger")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        // Aggregate per subjectId
        const map: Record<string, number> = {};
        for (const entry of ledger) {
            if (!entry.subjectId) continue;
            const key = entry.subjectId;
            map[key] = (map[key] ?? 0) + entry.amount;
        }
        return Object.entries(map).map(([subjectId, xp]) => ({ subjectId, xp }));
    },
});

// ─── Get total XP + level for current user ────────────────────────────────
export const getMyXP = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const user = await ctx.db.get(userId);
        if (!user) return null;

        return {
            totalXp: user.totalXp,
            level: computeLevel(user.totalXp),
            xpToNext: xpToNextLevel(user.totalXp),
        };
    },
});

// ─── Internal: award XP and update leaderboard ────────────────────────────
export const awardXP = internalMutation({
    args: {
        userId: v.id("users"),
        subjectId: v.optional(v.id("subjects")),
        amount: v.number(),
        reason: v.string(),
    },
    handler: async (ctx, { userId, subjectId, amount, reason }) => {
        const now = Date.now();
        const weekLabel = getWeekLabel();

        // Append to ledger
        await ctx.db.insert("xpLedger", {
            userId,
            subjectId,
            amount,
            reason,
            createdAt: now,
        });

        // Update users.totalXp
        const user = await ctx.db.get(userId);
        if (user) {
            await ctx.db.patch(userId, { totalXp: user.totalXp + amount });
        }

        // Upsert weekly global leaderboard entry
        const globalEntry = await ctx.db
            .query("leaderboardEntries")
            .withIndex("by_user_week", (q) =>
                q.eq("userId", userId).eq("weekLabel", weekLabel)
            )
            .filter((q) => q.eq(q.field("subjectId"), undefined))
            .first();

        if (globalEntry) {
            await ctx.db.patch(globalEntry._id, { xp: globalEntry.xp + amount });
        } else {
            await ctx.db.insert("leaderboardEntries", {
                userId,
                weekLabel,
                xp: amount,
                subjectId: undefined,
            });
        }

        // Upsert weekly per-subject leaderboard entry (if applicable)
        if (subjectId) {
            const subjectEntry = await ctx.db
                .query("leaderboardEntries")
                .withIndex("by_user_week", (q) =>
                    q.eq("userId", userId).eq("weekLabel", weekLabel)
                )
                .filter((q) => q.eq(q.field("subjectId"), subjectId))
                .first();

            if (subjectEntry) {
                await ctx.db.patch(subjectEntry._id, { xp: subjectEntry.xp + amount });
            } else {
                await ctx.db.insert("leaderboardEntries", {
                    userId,
                    weekLabel,
                    xp: amount,
                    subjectId,
                });
            }
        }
    },
});
