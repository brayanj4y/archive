"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

export async function checkAvailableModels() {
  try {
    const googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

    // Test only Gemini 1.5 Flash as specified
    try {
      const model = googleAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const testResult = await model.generateContent("Test")
      return [
        {
          modelName: "gemini-1.5-flash",
          available: true,
          response: testResult.response.text().substring(0, 20) + "...",
        },
      ]
    } catch (error) {
      return [
        {
          modelName: "gemini-1.5-flash",
          available: false,
          error: error.message,
        },
      ]
    }
  } catch (error) {
    console.error("Error checking models:", error)
    return [{ error: "Failed to check models: " + error.message }]
  }
}

