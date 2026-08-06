import { v } from "convex/values";
import { mutation, query, internalQuery } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";


export const getSubjectStats = query({
    args: { subjectId: v.id("subjects") },
    handler: async (ctx, { subjectId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const answers = await ctx.db
            .query("answers")
            .withIndex("by_user_subject", (q) =>
                q.eq("userId", userId).eq("subjectId", subjectId)
            )
            .collect();

        const total = answers.length;
        const correct = answers.filter((a) => a.isCorrect).length;
        return { total, correct, accuracy: total > 0 ? correct / total : 0 };
    },
});



export const getQuestionsForSubject = query({
    args: {
        subjectId: v.id("subjects"),
        count: v.optional(v.number()),
    },
    handler: async (ctx, { subjectId, count = 10 }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Must be authenticated");

        const user = await ctx.db.get(userId);
        const isSubscribed = user?.subscriptionStatus === "active";

        let allQuestions = await ctx.db
            .query("questions")
            .withIndex("by_subject", (q) => q.eq("subjectId", subjectId))
            .collect();


        if (!isSubscribed) {
            allQuestions = allQuestions.filter((q) => q.source === "ai_generated");
        }


        for (let i = allQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
        }

        return allQuestions.slice(0, count).map((q) => ({
            _id: q._id,
            text: q.text,
            options: q.options,
            subjectId: q.subjectId,
            difficulty: q.difficulty,
            source: q.source,

        }));
    },
});


export const getQuestionWithAnswer = internalQuery({
    args: { questionId: v.id("questions") },
    handler: async (ctx, { questionId }) => {
        return ctx.db.get(questionId);
    },
});


export const submitAnswer = mutation({
    args: {
        questionId: v.id("questions"),
        selectedIndex: v.number(),
    },
    handler: async (ctx, { questionId, selectedIndex }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Must be authenticated");

        const question = await ctx.db.get(questionId);
        if (!question) throw new Error("Question not found");

        const isCorrect = selectedIndex === question.correctIndex;
        const xpAwarded = isCorrect ? 10 : 0;


        await ctx.db.insert("answers", {
            userId,
            questionId,
            subjectId: question.subjectId,
            selectedIndex,
            isCorrect,
            xpAwarded,
            answeredAt: Date.now(),
        });


        if (isCorrect) {
            await ctx.runMutation(internal.xp.awardXP, {
                userId,
                subjectId: question.subjectId,
                amount: xpAwarded,
                reason: "correct_answer",
            });
        }


        await ctx.runMutation(internal.streaks.checkAndUpdateStreak, { userId });


        await ctx.runMutation(internal.badges.checkAndAwardBadges, { userId });

        return {
            isCorrect,
            correctIndex: question.correctIndex,
            explanation: question.explanation,
            xpAwarded,
        };
    },
});


export const insertQuestion = mutation({
    args: {
        subjectId: v.id("subjects"),
        text: v.string(),
        options: v.array(v.string()),
        correctIndex: v.number(),
        explanation: v.string(),
        difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
        source: v.union(v.literal("past_paper"), v.literal("ai_generated")),
        year: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        return ctx.db.insert("questions", args);
    },
});
