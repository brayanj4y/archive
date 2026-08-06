import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";


const DEFAULT_SUBJECTS = [
    { name: "English Language", slug: "english", emoji: "📝" },
    { name: "Mathematics", slug: "maths", emoji: "📐" },
    { name: "Biology", slug: "biology", emoji: "🧬" },
    { name: "Chemistry", slug: "chemistry", emoji: "⚗️" },
    { name: "Physics", slug: "physics", emoji: "⚛️" },
    { name: "Economics", slug: "economics", emoji: "📊" },
    { name: "Geography", slug: "geography", emoji: "🌍" },
];


export const listSubjects = query({
    args: {},
    handler: async (ctx) => {
        return ctx.db.query("subjects").collect();
    },
});


export const getSubjectBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, { slug }) => {
        return ctx.db
            .query("subjects")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .unique();
    },
});



export const seedSubjects = internalMutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("subjects").collect();
        if (existing.length > 0) return { seeded: false, message: "Already seeded" };

        for (const subject of DEFAULT_SUBJECTS) {
            await ctx.db.insert("subjects", subject);
        }

        return { seeded: true, count: DEFAULT_SUBJECTS.length };
    },
});


export const seedSubjectsPublic = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("subjects").collect();
        if (existing.length > 0) return { seeded: false, message: "Already seeded" };

        for (const subject of DEFAULT_SUBJECTS) {
            await ctx.db.insert("subjects", subject);
        }

        return { seeded: true, count: DEFAULT_SUBJECTS.length };
    },
});
