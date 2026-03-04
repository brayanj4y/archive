import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";


const BADGE_DEFINITIONS = [
    {
        slug: "first_answer",
        name: "First Step",
        description: "Answer your first question",
        iconName: "star-01",
    },
    {
        slug: "streak_3",
        name: "On a Roll",
        description: "Maintain a 3-day streak",
        iconName: "fire",
    },
    {
        slug: "streak_7",
        name: "Week Warrior",
        description: "Maintain a 7-day streak",
        iconName: "fire",
    },
    {
        slug: "streak_30",
        name: "Iron Will",
        description: "Maintain a 30-day streak",
        iconName: "fire",
    },
    {
        slug: "perfect_duel",
        name: "Perfect Score",
        description: "Score 10/10 in a duel",
        iconName: "checkmark-badge-01",
    },
    {
        slug: "duel_winner",
        name: "Duel Champion",
        description: "Win your first duel",
        iconName: "trophy",
    },
    {
        slug: "level_5",
        name: "Getting Started",
        description: "Reach Level 5 in any subject",
        iconName: "graduation-scroll",
    },
    {
        slug: "level_10",
        name: "Subject Master",
        description: "Reach Level 10 in any subject",
        iconName: "medal-01",
    },
    {
        slug: "answer_50",
        name: "Dedicated",
        description: "Answer 50 questions total",
        iconName: "book-open-01",
    },
    {
        slug: "answer_250",
        name: "Scholar",
        description: "Answer 250 questions total",
        iconName: "mortarboard-01",
    },
];


export const seedBadges = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("badges").collect();
        if (existing.length > 0) return { seeded: false };

        for (const badge of BADGE_DEFINITIONS) {
            await ctx.db.insert("badges", badge);
        }
        return { seeded: true, count: BADGE_DEFINITIONS.length };
    },
});


export const getUserBadges = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const earned = await ctx.db
            .query("userBadges")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const earnedSlugs = new Set(earned.map((b) => b.badgeSlug));

        const allBadges = await ctx.db.query("badges").collect();

        return allBadges.map((badge) => ({
            ...badge,
            earned: earnedSlugs.has(badge.slug),
            awardedAt: earned.find((e) => e.badgeSlug === badge.slug)?.awardedAt ?? null,
        }));
    },
});


export const getUserBadgesPublic = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        const earned = await ctx.db
            .query("userBadges")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        return earned;
    },
});


async function awardBadgeIfNew(
    ctx: any,
    userId: string,
    badgeSlug: string
): Promise<boolean> {
    const existing = await ctx.db
        .query("userBadges")
        .withIndex("by_user_badge", (q: any) =>
            q.eq("userId", userId).eq("badgeSlug", badgeSlug)
        )
        .unique();

    if (existing) return false;

    await ctx.db.insert("userBadges", {
        userId,
        badgeSlug,
        awardedAt: Date.now(),
    });
    return true;
}


export const checkAndAwardBadges = internalMutation({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        const awarded: string[] = [];


        const answers = await ctx.db
            .query("answers")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const totalAnswers = answers.length;

        if (totalAnswers >= 1) {
            if (await awardBadgeIfNew(ctx, userId, "first_answer")) awarded.push("first_answer");
        }
        if (totalAnswers >= 50) {
            if (await awardBadgeIfNew(ctx, userId, "answer_50")) awarded.push("answer_50");
        }
        if (totalAnswers >= 250) {
            if (await awardBadgeIfNew(ctx, userId, "answer_250")) awarded.push("answer_250");
        }


        const streak = await ctx.db
            .query("streaks")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        if (streak) {
            if (streak.currentStreak >= 3) {
                if (await awardBadgeIfNew(ctx, userId, "streak_3")) awarded.push("streak_3");
            }
            if (streak.currentStreak >= 7) {
                if (await awardBadgeIfNew(ctx, userId, "streak_7")) awarded.push("streak_7");
            }
            if (streak.currentStreak >= 30) {
                if (await awardBadgeIfNew(ctx, userId, "streak_30")) awarded.push("streak_30");
            }
        }


        const wonDuels = await ctx.db
            .query("duels")
            .withIndex("by_status", (q) => q.eq("status", "completed"))
            .filter((q) => q.eq(q.field("winnerId"), userId))
            .collect();

        if (wonDuels.length >= 1) {
            if (await awardBadgeIfNew(ctx, userId, "duel_winner")) awarded.push("duel_winner");
        }




        for (const duel of wonDuels) {
            const duelAnswerSet = await ctx.db
                .query("duelAnswers")
                .withIndex("by_duel_user", (q) =>
                    q.eq("duelId", duel._id).eq("userId", userId)
                )
                .collect();
            if (
                duelAnswerSet.length === 10 &&
                duelAnswerSet.every((a) => a.isCorrect)
            ) {
                if (await awardBadgeIfNew(ctx, userId, "perfect_duel")) {
                    awarded.push("perfect_duel");
                    break;
                }
            }
        }


        const user = await ctx.db.get(userId);
        if (user) {
            const { computeLevel } = await import("./xp");
            const level = computeLevel(user.totalXp ?? 0);
            if (level >= 5) {
                if (await awardBadgeIfNew(ctx, userId, "level_5")) awarded.push("level_5");
            }
            if (level >= 10) {
                if (await awardBadgeIfNew(ctx, userId, "level_10")) awarded.push("level_10");
            }
        }

        return { awarded };
    },
});
