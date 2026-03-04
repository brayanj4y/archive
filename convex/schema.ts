import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

    users: defineTable({

        tokenIdentifier: v.string(),
        email: v.string(),
        name: v.string(),
        username: v.string(),
        avatarUrl: v.optional(v.string()),


        totalXp: v.number(),
        subscriptionStatus: v.union(
            v.literal("free"),
            v.literal("active"),
            v.literal("expired"),
        ),
    })
        .index("by_token", ["tokenIdentifier"])
        .index("by_email", ["email"])
        .index("by_username", ["username"]),


    subjects: defineTable({
        name: v.string(),
        slug: v.string(),
        emoji: v.string(),
    }).index("by_slug", ["slug"]),


    questions: defineTable({
        subjectId: v.id("subjects"),
        text: v.string(),
        options: v.array(v.string()),
        correctIndex: v.number(),
        explanation: v.string(),
        difficulty: v.union(
            v.literal("easy"),
            v.literal("medium"),
            v.literal("hard"),
        ),
        source: v.union(
            v.literal("past_paper"),
            v.literal("ai_generated"),
        ),
        year: v.optional(v.number()),
    })
        .index("by_subject", ["subjectId"])
        .index("by_subject_source", ["subjectId", "source"]),


    answers: defineTable({
        userId: v.id("users"),
        questionId: v.id("questions"),
        subjectId: v.id("subjects"),
        selectedIndex: v.number(),
        isCorrect: v.boolean(),
        xpAwarded: v.number(),
        answeredAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_user_subject", ["userId", "subjectId"])
        .index("by_user_date", ["userId", "answeredAt"]),


    streaks: defineTable({
        userId: v.id("users"),
        currentStreak: v.number(),
        longestStreak: v.number(),
        lastStreakDate: v.optional(v.string()),
    }).index("by_user", ["userId"]),


    xpLedger: defineTable({
        userId: v.id("users"),
        subjectId: v.optional(v.id("subjects")),
        amount: v.number(),
        reason: v.string(),
        createdAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_user_subject", ["userId", "subjectId"])
        .index("by_user_date", ["userId", "createdAt"]),


    leaderboardEntries: defineTable({
        userId: v.id("users"),
        weekLabel: v.string(),
        xp: v.number(),
        subjectId: v.optional(v.id("subjects")),
    })
        .index("by_week", ["weekLabel"])
        .index("by_user_week", ["userId", "weekLabel"])
        .index("by_week_subject", ["weekLabel", "subjectId"]),


    duels: defineTable({
        challengerId: v.id("users"),
        challengeeId: v.id("users"),
        subjectId: v.id("subjects"),
        status: v.union(
            v.literal("pending"),
            v.literal("in_progress"),
            v.literal("completed"),
            v.literal("declined"),
        ),
        questionIds: v.array(v.id("questions")),
        challengerScore: v.optional(v.number()),
        challengeeScore: v.optional(v.number()),
        winnerId: v.optional(v.id("users")),
        createdAt: v.number(),
    })
        .index("by_challenger", ["challengerId"])
        .index("by_challengee", ["challengeeId"])
        .index("by_status", ["status"]),


    duelAnswers: defineTable({
        duelId: v.id("duels"),
        userId: v.id("users"),
        questionId: v.id("questions"),
        selectedIndex: v.number(),
        isCorrect: v.boolean(),
    })
        .index("by_duel", ["duelId"])
        .index("by_duel_user", ["duelId", "userId"]),


    badges: defineTable({
        slug: v.string(),
        name: v.string(),
        description: v.string(),
        iconName: v.string(),
    }).index("by_slug", ["slug"]),


    userBadges: defineTable({
        userId: v.id("users"),
        badgeSlug: v.string(),
        awardedAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_user_badge", ["userId", "badgeSlug"]),


    subscriptions: defineTable({
        userId: v.id("users"),
        status: v.union(
            v.literal("active"),
            v.literal("expired"),
            v.literal("cancelled"),
        ),
        provider: v.union(
            v.literal("momo"),
            v.literal("stripe"),
        ),
        expiresAt: v.number(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_user_status", ["userId", "status"]),
});
