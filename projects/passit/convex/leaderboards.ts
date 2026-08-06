import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";


function getWeekLabel(): string {
    const now = new Date();
    const target = new Date(now.valueOf());
    const dayNr = (now.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const jan4 = new Date(target.getFullYear(), 0, 4);
    const weekNum = 1 + Math.round((target.getTime() - jan4.getTime()) / 604_800_000);
    return `${target.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}


export const getWeeklyLeaderboard = query({
    args: {
        subjectId: v.optional(v.id("subjects")),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, { subjectId, limit = 50 }) => {
        const weekLabel = getWeekLabel();

        let entries = await ctx.db
            .query("leaderboardEntries")
            .withIndex("by_week", (q) => q.eq("weekLabel", weekLabel))
            .collect();


        entries = entries.filter((e) =>
            subjectId ? e.subjectId === subjectId : e.subjectId === undefined
        );


        entries.sort((a, b) => b.xp - a.xp);
        entries = entries.slice(0, limit);


        const hydrated = await Promise.all(
            entries.map(async (entry, index) => {
                const user = await ctx.db.get(entry.userId);
                return {
                    rank: index + 1,
                    userId: entry.userId,
                    name: user?.name ?? "Unknown",
                    avatarUrl: user?.avatarUrl,
                    xp: entry.xp,
                };
            })
        );

        return hydrated;
    },
});


export const getFriendsLeaderboard = query({
    args: {
        friendIds: v.array(v.id("users")),
        subjectId: v.optional(v.id("subjects")),
    },
    handler: async (ctx, { friendIds, subjectId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const weekLabel = getWeekLabel();
        const relevantIds = [...friendIds, userId];

        const entries = await ctx.db
            .query("leaderboardEntries")
            .withIndex("by_week", (q) => q.eq("weekLabel", weekLabel))
            .collect();

        const filtered = entries
            .filter((e) =>
                relevantIds.includes(e.userId) &&
                (subjectId ? e.subjectId === subjectId : e.subjectId === undefined)
            )
            .sort((a, b) => b.xp - a.xp);

        const hydrated = await Promise.all(
            filtered.map(async (entry, index) => {
                const user = await ctx.db.get(entry.userId);
                return {
                    rank: index + 1,
                    userId: entry.userId,
                    name: user?.name ?? "Unknown",
                    avatarUrl: user?.avatarUrl,
                    xp: entry.xp,
                    isMe: entry.userId === userId,
                };
            })
        );

        return hydrated;
    },
});


export const getMyRank = query({
    args: { subjectId: v.optional(v.id("subjects")) },
    handler: async (ctx, { subjectId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const weekLabel = getWeekLabel();

        const entries = await ctx.db
            .query("leaderboardEntries")
            .withIndex("by_week", (q) => q.eq("weekLabel", weekLabel))
            .collect();

        const relevant = entries.filter((e) =>
            subjectId ? e.subjectId === subjectId : e.subjectId === undefined
        );
        relevant.sort((a, b) => b.xp - a.xp);

        const myIndex = relevant.findIndex((e) => e.userId === userId);
        if (myIndex === -1) return { rank: null, xp: 0, total: relevant.length };

        return {
            rank: myIndex + 1,
            xp: relevant[myIndex].xp,
            total: relevant.length,
        };
    },
});
