import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";


export const createDuel = mutation({
    args: {
        challengeeId: v.id("users"),
        subjectId: v.id("subjects"),
    },
    handler: async (ctx, { challengeeId, subjectId }) => {
        const challengerId = await getAuthUserId(ctx);
        if (!challengerId) throw new Error("Must be authenticated");

        if (challengerId === challengeeId) {
            throw new Error("Cannot duel yourself");
        }


        const allQuestions = await ctx.db
            .query("questions")
            .withIndex("by_subject", (q) => q.eq("subjectId", subjectId))
            .collect();

        if (allQuestions.length < 5) {
            throw new Error("Not enough questions in this subject for a duel");
        }


        const shuffled = [...allQuestions];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        const questionIds = shuffled.slice(0, 10).map((q) => q._id);

        const duelId = await ctx.db.insert("duels", {
            challengerId,
            challengeeId,
            subjectId,
            status: "pending",
            questionIds,
            createdAt: Date.now(),
        });

        return duelId;
    },
});


export const acceptDuel = mutation({
    args: { duelId: v.id("duels") },
    handler: async (ctx, { duelId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Must be authenticated");

        const duel = await ctx.db.get(duelId);
        if (!duel) throw new Error("Duel not found");
        if (duel.challengeeId !== userId) throw new Error("Not your duel to accept");
        if (duel.status !== "pending") throw new Error("Duel is no longer pending");

        await ctx.db.patch(duelId, { status: "in_progress" });
    },
});


export const declineDuel = mutation({
    args: { duelId: v.id("duels") },
    handler: async (ctx, { duelId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Must be authenticated");

        const duel = await ctx.db.get(duelId);
        if (!duel) throw new Error("Duel not found");
        if (duel.challengeeId !== userId) throw new Error("Not your duel");
        if (duel.status !== "pending") throw new Error("Duel is no longer pending");

        await ctx.db.patch(duelId, { status: "declined" });
    },
});


export const submitDuelAnswers = mutation({
    args: {
        duelId: v.id("duels"),
        answers: v.array(
            v.object({
                questionId: v.id("questions"),
                selectedIndex: v.number(),
            })
        ),
    },
    handler: async (ctx, { duelId, answers }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Must be authenticated");

        const duel = await ctx.db.get(duelId);
        if (!duel) throw new Error("Duel not found");
        if (duel.status !== "in_progress") throw new Error("Duel is not in progress");

        const isChallenger = duel.challengerId === userId;
        const isChallengee = duel.challengeeId === userId;
        if (!isChallenger && !isChallengee) throw new Error("You are not part of this duel");


        const existingAnswers = await ctx.db
            .query("duelAnswers")
            .withIndex("by_duel_user", (q) => q.eq("duelId", duelId).eq("userId", userId))
            .collect();

        if (existingAnswers.length > 0) throw new Error("Already submitted answers for this duel");


        let score = 0;
        for (const answer of answers) {
            const question = await ctx.db.get(answer.questionId);
            if (!question) continue;

            const isCorrect = answer.selectedIndex === question.correctIndex;
            if (isCorrect) score++;

            await ctx.db.insert("duelAnswers", {
                duelId,
                userId,
                questionId: answer.questionId,
                selectedIndex: answer.selectedIndex,
                isCorrect,
            });
        }


        const patchData = isChallenger
            ? { challengerScore: score }
            : { challengeeScore: score };
        await ctx.db.patch(duelId, patchData);


        const updatedDuel = await ctx.db.get(duelId);
        if (
            updatedDuel?.challengerScore !== undefined &&
            updatedDuel?.challengeeScore !== undefined
        ) {

            const { challengerScore, challengeeScore, challengerId, challengeeId } = updatedDuel;
            let winnerId: string | undefined;

            if (challengerScore > challengeeScore!) {
                winnerId = challengerId;
            } else if (challengeeScore! > challengerScore) {
                winnerId = challengeeId;
            }


            await ctx.db.patch(duelId, {
                status: "completed",
                winnerId: winnerId as any,
            });


            const participationXP = 5;
            const winBonus = 30;

            await ctx.runMutation(internal.xp.awardXP, {
                userId: challengerId,
                amount: participationXP,
                reason: "duel_participation",
            });
            await ctx.runMutation(internal.xp.awardXP, {
                userId: challengeeId,
                amount: participationXP,
                reason: "duel_participation",
            });

            if (winnerId) {
                await ctx.runMutation(internal.xp.awardXP, {
                    userId: winnerId as any,
                    amount: winBonus,
                    reason: "duel_win",
                });

                await ctx.runMutation(internal.badges.checkAndAwardBadges, {
                    userId: winnerId as any,
                });
            }
        }

        return { score, totalQuestions: answers.length };
    },
});


export const getDuel = query({
    args: { duelId: v.id("duels") },
    handler: async (ctx, { duelId }) => {
        const userId = await getAuthUserId(ctx);
        const duel = await ctx.db.get(duelId);
        if (!duel) return null;

        const challenger = await ctx.db.get(duel.challengerId);
        const challengee = await ctx.db.get(duel.challengeeId);


        let myAnswers: any[] = [];
        if (userId) {
            myAnswers = await ctx.db
                .query("duelAnswers")
                .withIndex("by_duel_user", (q) => q.eq("duelId", duelId).eq("userId", userId))
                .collect();
        }

        return {
            ...duel,
            challenger: { name: challenger?.name, avatarUrl: challenger?.avatarUrl },
            challengee: { name: challengee?.name, avatarUrl: challengee?.avatarUrl },
            myAnswers,
        };
    },
});


export const getMyDuels = query({
    args: { status: v.optional(v.string()) },
    handler: async (ctx, { status }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const asChallengerRaw = await ctx.db
            .query("duels")
            .withIndex("by_challenger", (q) => q.eq("challengerId", userId))
            .collect();

        const asChallengeeRaw = await ctx.db
            .query("duels")
            .withIndex("by_challengee", (q) => q.eq("challengeeId", userId))
            .collect();

        let all = [...asChallengerRaw, ...asChallengeeRaw];
        if (status) all = all.filter((d) => d.status === status);
        all.sort((a, b) => b.createdAt - a.createdAt);

        return all;
    },
});
