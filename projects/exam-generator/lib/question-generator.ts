"use server"

import { batchGenerateContent } from "./google-ai-client"

interface GenerateQuestionsParams {
  subject: string
  topics: string[]
  difficulty: string
  counts: {
    mcCount: number
    tfCount: number
    saCount: number
    essayCount: number
  }
}

interface GeneratedQuestions {
  multipleChoice: {
    question: string
    options: string[]
    answer: string
  }[]
  trueFalse: {
    question: string
    answer: boolean
  }[]
  shortAnswer: {
    question: string
    answer: string
  }[]
  essay: {
    question: string
    guidelines?: string
  }[]
}

export async function generateQuestions(params: GenerateQuestionsParams): Promise<GeneratedQuestions> {
  const { subject, topics, difficulty, counts } = params
  const topicsString = topics.join(", ")

  // Initialize the result object
  const result: GeneratedQuestions = {
    multipleChoice: [],
    trueFalse: [],
    shortAnswer: [],
    essay: [],
  }

  // Use Promise.allSettled to run all question generation in parallel
  // This is more efficient than sequential calls
  const promises = []

  // Only make API calls for question types with a count > 0
  if (counts.mcCount > 0) {
    promises.push(
      batchGenerateContent("multipleChoice", counts.mcCount, subject, topicsString, difficulty)
        .then((data) => ({ type: "multipleChoice", data }))
        .catch((error) => {
          console.error("Error generating multiple choice questions:", error)
          return {
            type: "multipleChoice",
            data: Array(counts.mcCount)
              .fill(0)
              .map((_, i) => ({
                question: `Fallback multiple choice question ${i + 1} about ${subject}`,
                options: ["Option A", "Option B", "Option C", "Option D"],
                answer: "Option A",
              })),
          }
        }),
    )
  }

  if (counts.tfCount > 0) {
    promises.push(
      batchGenerateContent("trueFalse", counts.tfCount, subject, topicsString, difficulty)
        .then((data) => ({ type: "trueFalse", data }))
        .catch((error) => {
          console.error("Error generating true/false questions:", error)
          return {
            type: "trueFalse",
            data: Array(counts.tfCount)
              .fill(0)
              .map((_, i) => ({
                question: `Fallback true/false statement ${i + 1} about ${subject}`,
                answer: i % 2 === 0,
              })),
          }
        }),
    )
  }

  if (counts.saCount > 0) {
    promises.push(
      batchGenerateContent("shortAnswer", counts.saCount, subject, topicsString, difficulty)
        .then((data) => ({ type: "shortAnswer", data }))
        .catch((error) => {
          console.error("Error generating short answer questions:", error)
          return {
            type: "shortAnswer",
            data: Array(counts.saCount)
              .fill(0)
              .map((_, i) => ({
                question: `Fallback short answer question ${i + 1} about ${subject}`,
                answer: "Sample answer to the question.",
              })),
          }
        }),
    )
  }

  if (counts.essayCount > 0) {
    promises.push(
      batchGenerateContent("essay", counts.essayCount, subject, topicsString, difficulty)
        .then((data) => ({ type: "essay", data }))
        .catch((error) => {
          console.error("Error generating essay questions:", error)
          return {
            type: "essay",
            data: Array(counts.essayCount)
              .fill(0)
              .map((_, i) => ({
                question: `Fallback essay question ${i + 1} about ${subject}`,
                guidelines: "Write a comprehensive essay addressing the key points.",
              })),
          }
        }),
    )
  }

  // Wait for all promises to resolve
  const responses = await Promise.all(promises)

  // Process the results
  responses.forEach((response) => {
    if (response.type === "multipleChoice") {
      result.multipleChoice = response.data
    } else if (response.type === "trueFalse") {
      result.trueFalse = response.data
    } else if (response.type === "shortAnswer") {
      result.shortAnswer = response.data
    } else if (response.type === "essay") {
      result.essay = response.data
    }
  })

  // Ensure we have the correct number of questions for each type
  // This handles cases where the API returns fewer questions than requested
  if (result.multipleChoice.length < counts.mcCount) {
    const additional = counts.mcCount - result.multipleChoice.length
    for (let i = 0; i < additional; i++) {
      result.multipleChoice.push({
        question: `Additional multiple choice question ${i + 1} about ${subject}`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: "Option A",
      })
    }
  }

  if (result.trueFalse.length < counts.tfCount) {
    const additional = counts.tfCount - result.trueFalse.length
    for (let i = 0; i < additional; i++) {
      result.trueFalse.push({
        question: `Additional true/false statement ${i + 1} about ${subject}`,
        answer: i % 2 === 0,
      })
    }
  }

  if (result.shortAnswer.length < counts.saCount) {
    const additional = counts.saCount - result.shortAnswer.length
    for (let i = 0; i < additional; i++) {
      result.shortAnswer.push({
        question: `Additional short answer question ${i + 1} about ${subject}`,
        answer: "Sample answer to the question.",
      })
    }
  }

  if (result.essay.length < counts.essayCount) {
    const additional = counts.essayCount - result.essay.length
    for (let i = 0; i < additional; i++) {
      result.essay.push({
        question: `Additional essay question ${i + 1} about ${subject}`,
        guidelines: "Write a comprehensive essay addressing the key points.",
      })
    }
  }

  return result
}

