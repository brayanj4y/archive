"use server"

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"

// Initialize the Google Generative AI client
const googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

// Safety settings to ensure appropriate content
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
]

// Rate limiting variables
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 15000 // 15 seconds between requests (Flash model has higher throughput)
const MAX_RETRIES = 3

// Get the Gemini model - using Gemini 1.5 Flash as specified
export async function getGeminiModel() {
  return googleAI.getGenerativeModel({
    model: "gemini-1.5-flash", // Changed from Pro to Flash
    safetySettings,
  })
}

// Sleep function for rate limiting and retries
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Generate content with the model
export async function generateContent(prompt: string, retryCount = 0) {
  try {
    // Check if we need to wait due to rate limiting
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL && lastRequestTime !== 0) {
      console.log(`Rate limiting: waiting ${MIN_REQUEST_INTERVAL - timeSinceLastRequest}ms before next request`)

      // If we have retries left, wait and retry
      if (retryCount < MAX_RETRIES) {
        await sleep(MIN_REQUEST_INTERVAL - timeSinceLastRequest + 1000) // Add 1 second buffer
        return generateContent(prompt, retryCount + 1)
      }

      // If we've exhausted retries, use fallback
      return fallbackGenerateContent(prompt, "Rate limit - too many requests")
    }

    // Update last request time
    lastRequestTime = now

    // Get the model and generate content
    const model = await getGeminiModel()
    console.log(`Sending prompt to Google AI (attempt ${retryCount + 1}):`, prompt.substring(0, 100) + "...")

    // Explicitly instruct the model to only return JSON
    const enhancedPrompt = `${prompt}

IMPORTANT: Return ONLY the JSON array with no additional text, markdown formatting, or code blocks. Do not include backticks, the word 'json', or any other text.`

    const result = await model.generateContent(enhancedPrompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error(`Error generating content (attempt ${retryCount + 1}):`, error)

    // Check if it's a rate limit error (429) or a server error (5xx)
    if ((error.message && error.message.includes("429")) || (error.message && error.message.includes("5"))) {
      // If we have retries left, wait and retry with exponential backoff
      if (retryCount < MAX_RETRIES) {
        const backoffTime = Math.pow(2, retryCount) * 5000 // Exponential backoff: 5s, 10s, 20s
        console.log(`Retrying in ${backoffTime}ms...`)
        await sleep(backoffTime)
        return generateContent(prompt, retryCount + 1)
      }
    }

    // Return fallback content for other errors or if retries exhausted
    return fallbackGenerateContent(prompt, error.message || "Unknown error")
  }
}

// Extract JSON from a potentially formatted response
async function extractJsonFromResponse(response: string): Promise<any> {
  console.log("Attempting to extract JSON from response")

  try {
    // First try: direct JSON parsing
    return JSON.parse(response)
  } catch (error) {
    console.log("Direct JSON parsing failed, trying to extract JSON from text")

    try {
      // Second try: Remove markdown code block formatting
      // This handles responses like: \`\`\`json [...] \`\`\` or \`\`\`[...] \`\`\`
      const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      if (codeBlockMatch && codeBlockMatch[1]) {
        return JSON.parse(codeBlockMatch[1])
      }

      // Third try: Look for array pattern with any characters before or after
      const arrayMatch = response.match(/(\[[\s\S]*\])/)
      if (arrayMatch && arrayMatch[1]) {
        return JSON.parse(arrayMatch[1])
      }

      // Fourth try: More aggressive extraction - find anything between [ and ]
      const bracketMatch = response.match(/\[([\s\S]*)\]/)
      if (bracketMatch) {
        return JSON.parse(`[${bracketMatch[1]}]`)
      }

      // If all extraction attempts fail, throw an error
      throw new Error("Could not extract valid JSON from response")
    } catch (extractError) {
      console.error("JSON extraction failed:", extractError)
      console.log("Response content:", response)
      throw new Error("Failed to parse response as JSON")
    }
  }
}

// Batch generate content for multiple questions
export async function batchGenerateContent(
  questionType: string,
  count: number,
  subject: string,
  topics: string,
  difficulty: string,
) {
  // For efficiency, we'll generate all questions of the same type in a single API call
  try {
    let prompt = ""
    let jsonStructure = ""

    if (questionType === "multipleChoice") {
      prompt = `Generate ${count} multiple-choice questions about ${subject} focusing on ${topics} at a ${difficulty} difficulty level.`
      jsonStructure = `
    [
      {
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answer": "The correct option text"
      }
    ]`
    } else if (questionType === "trueFalse") {
      prompt = `Generate ${count} true/false questions about ${subject} focusing on ${topics} at a ${difficulty} difficulty level.`
      jsonStructure = `
    [
      {
        "question": "Statement that is either true or false.",
        "answer": true or false
      }
    ]`
    } else if (questionType === "shortAnswer") {
      prompt = `Generate ${count} short answer questions about ${subject} focusing on ${topics} at a ${difficulty} difficulty level. Each question should be answerable in 1-3 sentences.`
      jsonStructure = `
    [
      {
        "question": "Question text here?",
        "answer": "Sample correct answer here."
      }
    ]`
    } else if (questionType === "essay") {
      prompt = `Generate ${count} essay questions about ${subject} focusing on ${topics} at a ${difficulty} difficulty level. Each question should require a detailed response and include guidelines for answering.`
      jsonStructure = `
    [
      {
        "question": "Essay question text here?",
        "guidelines": "Guidelines for answering the question."
      }
    ]`
    }

    prompt += `

Format the response as a JSON array with this structure: ${jsonStructure}

IMPORTANT: Return ONLY the JSON array with no additional text, markdown formatting, or code blocks. Do not include backticks, the word 'json', or any other text.`

    const response = await generateContent(prompt)

    try {
      // Try to extract and parse the JSON from the response
      return await extractJsonFromResponse(response)
    } catch (parseError) {
      console.error("Error parsing response:", parseError)
      console.log("Raw response:", response)

      // If parsing fails, use fallback questions
      throw new Error("Failed to parse response")
    }
  } catch (error) {
    console.error(`Error in batch generation for ${questionType}:`, error)
    return await getFallbackQuestions(questionType, count, subject, topics, difficulty)
  }
}

// Get fallback questions by type
async function getFallbackQuestions(type: string, count: number, subject: string, topics: string, difficulty: string) {
  const topicsArray = topics.split(",").map((t) => t.trim())

  if (type === "multipleChoice") {
    return Array(count)
      .fill(0)
      .map((_, i) => generateMockMultipleChoiceQuestion(subject, topicsArray, difficulty, i))
  } else if (type === "trueFalse") {
    return Array(count)
      .fill(0)
      .map((_, i) => generateMockTrueFalseQuestion(subject, topicsArray, difficulty, i))
  } else if (type === "shortAnswer") {
    return Array(count)
      .fill(0)
      .map((_, i) => generateMockShortAnswerQuestion(subject, topicsArray, difficulty, i))
  } else if (type === "essay") {
    return Array(count)
      .fill(0)
      .map((_, i) => generateMockEssayQuestion(subject, topicsArray, difficulty, i))
  }

  return []
}

// Fallback content generation for when the API fails
async function fallbackGenerateContent(prompt: string, reason: string): Promise<string> {
  console.log(`Using fallback content generation. Reason: ${reason}`)

  // Check if we're generating multiple choice questions
  if (prompt.includes("multiple-choice questions")) {
    return JSON.stringify([
      {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        answer: "Paris",
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: "Mars",
      },
      {
        question: "What is the largest mammal on Earth?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
        answer: "Blue Whale",
      },
      {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
        answer: "Oxygen",
      },
      {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Mark Twain"],
        answer: "William Shakespeare",
      },
    ])
  }

  // Check if we're generating true/false questions
  if (prompt.includes("true/false questions")) {
    return JSON.stringify([
      {
        question: "The Earth is flat.",
        answer: false,
      },
      {
        question: "Water boils at 100 degrees Celsius at sea level.",
        answer: true,
      },
      {
        question: "Humans have 206 bones in their body.",
        answer: true,
      },
      {
        question: "The Great Wall of China is visible from space with the naked eye.",
        answer: false,
      },
      {
        question: "The Sun revolves around the Earth.",
        answer: false,
      },
    ])
  }

  // Check if we're generating short answer questions
  if (prompt.includes("short answer questions")) {
    return JSON.stringify([
      {
        question: "What is the chemical symbol for water?",
        answer: "H2O",
      },
      {
        question: "Who wrote Romeo and Juliet?",
        answer: "William Shakespeare",
      },
      {
        question: "What is photosynthesis?",
        answer:
          "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water.",
      },
      {
        question: "What is the capital of Japan?",
        answer: "Tokyo",
      },
      {
        question: "What is the law of conservation of energy?",
        answer:
          "The law of conservation of energy states that energy cannot be created or destroyed, only transformed from one form to another.",
      },
    ])
  }

  // Check if we're generating essay questions
  if (prompt.includes("essay questions")) {
    return JSON.stringify([
      {
        question: "Discuss the causes and effects of climate change.",
        guidelines: "Include scientific evidence and potential solutions.",
      },
      {
        question: "Analyze the themes in a novel of your choice.",
        guidelines: "Focus on character development, setting, and symbolism.",
      },
      {
        question: "Compare and contrast renewable and non-renewable energy sources.",
        guidelines: "Consider environmental impact, cost, and sustainability.",
      },
      {
        question: "Explain the importance of biodiversity in ecosystems.",
        guidelines: "Discuss the consequences of biodiversity loss and conservation strategies.",
      },
      {
        question: "Evaluate the impact of social media on modern society.",
        guidelines:
          "Consider both positive and negative effects on communication, mental health, and information sharing.",
      },
    ])
  }

  // Default fallback
  return "Fallback content generation activated."
}

// Mock question generators
function generateMockMultipleChoiceQuestion(subject: string, topics: string[], difficulty: string, index: number) {
  const subjectQuestions = {
    Mathematics: [
      {
        question: "What is the derivative of f(x) = x²?",
        options: ["f'(x) = x", "f'(x) = 2x", "f'(x) = 2", "f'(x) = x²"],
        answer: "f'(x) = 2x",
      },
      {
        question: "Which of the following is a prime number?",
        options: ["15", "21", "57", "23"],
        answer: "23",
      },
      {
        question: "What is the value of π (pi) to two decimal places?",
        options: ["3.14", "3.41", "3.12", "3.16"],
        answer: "3.14",
      },
    ],
    Physics: [
      {
        question: "What is the SI unit of force?",
        options: ["Watt", "Joule", "Newton", "Pascal"],
        answer: "Newton",
      },
      {
        question: "Which law of motion states that for every action, there is an equal and opposite reaction?",
        options: ["First law", "Second law", "Third law", "Fourth law"],
        answer: "Third law",
      },
      {
        question: "What is the speed of light in vacuum?",
        options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10⁷ m/s", "3 × 10⁹ m/s"],
        answer: "3 × 10⁸ m/s",
      },
    ],
    "Computer Science": [
      {
        question: "Which data structure operates on a LIFO principle?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        answer: "Stack",
      },
      {
        question: "What does CPU stand for?",
        options: [
          "Central Processing Unit",
          "Computer Processing Unit",
          "Central Program Unit",
          "Central Processor Unit",
        ],
        answer: "Central Processing Unit",
      },
      {
        question: "Which of the following is not a programming paradigm?",
        options: ["Object-Oriented", "Functional", "Procedural", "Systematic"],
        answer: "Systematic",
      },
    ],
  }

  // Default questions if subject not found
  const defaultQuestions = [
    {
      question: `Question about ${subject} related to ${topics[0] || "general knowledge"}`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: "Option B",
    },
    {
      question: `Another question about ${subject}`,
      options: ["First choice", "Second choice", "Third choice", "Fourth choice"],
      answer: "Third choice",
    },
  ]

  const availableQuestions = subjectQuestions[subject] || defaultQuestions
  return availableQuestions[index % availableQuestions.length]
}

function generateMockTrueFalseQuestion(subject: string, topics: string[], difficulty: string, index: number) {
  const subjectQuestions = {
    Mathematics: [
      {
        question: "The sum of the angles in a triangle is 180 degrees.",
        answer: true,
      },
      {
        question: "Every even number greater than 2 is a prime number.",
        answer: false,
      },
    ],
    Physics: [
      {
        question: "The acceleration due to gravity on Earth is approximately 9.8 m/s².",
        answer: true,
      },
      {
        question: "Sound travels faster in air than in water.",
        answer: false,
      },
    ],
    "Computer Science": [
      {
        question: "HTML is a programming language.",
        answer: false,
      },
      {
        question: "Binary code consists of 0s and 1s.",
        answer: true,
      },
    ],
  }

  // Default questions if subject not found
  const defaultQuestions = [
    {
      question: `True or False: ${subject} is related to ${topics[0] || "science"}.`,
      answer: true,
    },
    {
      question: `True or False: ${topics[0] || subject} was discovered in the 21st century.`,
      answer: false,
    },
  ]

  const availableQuestions = subjectQuestions[subject] || defaultQuestions
  return availableQuestions[index % availableQuestions.length]
}

function generateMockShortAnswerQuestion(subject: string, topics: string[], difficulty: string, index: number) {
  const subjectQuestions = {
    Mathematics: [
      {
        question: "What is the formula for the area of a circle?",
        answer: "A = πr²",
      },
      {
        question: "Define what a prime number is.",
        answer:
          "A prime number is a natural number greater than 1 that is not a product of two smaller natural numbers.",
      },
    ],
    Physics: [
      {
        question: "State Newton's First Law of Motion.",
        answer:
          "An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.",
      },
      {
        question: "What is the formula for kinetic energy?",
        answer: "KE = (1/2)mv²",
      },
    ],
    "Computer Science": [
      {
        question: "What does API stand for?",
        answer: "Application Programming Interface",
      },
      {
        question: "Explain what a variable is in programming.",
        answer:
          "A variable is a named storage location in a program that contains data which can be modified during program execution.",
      },
    ],
  }

  // Default questions if subject not found
  const defaultQuestions = [
    {
      question: `Briefly explain the importance of ${topics[0] || subject}.`,
      answer: `${topics[0] || subject} is important because it helps us understand and solve problems in the field.`,
    },
    {
      question: `Define the term "${topics[0] || "key concept"}" as it relates to ${subject}.`,
      answer: `The term refers to a fundamental concept in ${subject} that helps explain various phenomena.`,
    },
  ]

  const availableQuestions = subjectQuestions[subject] || defaultQuestions
  return availableQuestions[index % availableQuestions.length]
}

function generateMockEssayQuestion(subject: string, topics: string[], difficulty: string, index: number) {
  const subjectQuestions = {
    Mathematics: [
      {
        question: "Explain the importance of calculus in real-world applications.",
        guidelines: "Include examples from physics, engineering, and economics.",
      },
      {
        question: "Discuss the historical development of geometry and its impact on modern mathematics.",
        guidelines: "Consider contributions from different civilizations and time periods.",
      },
    ],
    Physics: [
      {
        question: "Analyze the implications of Einstein's Theory of Relativity on our understanding of space and time.",
        guidelines: "Discuss both Special and General Relativity.",
      },
      {
        question: "Evaluate the potential of renewable energy sources to replace fossil fuels.",
        guidelines: "Consider technological, economic, and environmental factors.",
      },
    ],
    "Computer Science": [
      {
        question: "Discuss the ethical implications of artificial intelligence in society.",
        guidelines: "Consider privacy, employment, and decision-making concerns.",
      },
      {
        question: "Analyze the evolution of programming languages and their impact on software development.",
        guidelines: "Include examples of how different paradigms have shaped modern programming.",
      },
    ],
  }

  // Default questions if subject not found
  const defaultQuestions = [
    {
      question: `Discuss the major developments in ${subject} over the past century.`,
      guidelines: `Consider technological advancements, theoretical breakthroughs, and the impact on ${topics[0] || "the field"}.`,
    },
    {
      question: `Analyze the relationship between ${topics[0] || subject} and ${topics[1] || "related fields"}.`,
      guidelines: "Include historical context, current applications, and future possibilities.",
    },
  ]

  const availableQuestions = subjectQuestions[subject] || defaultQuestions
  return availableQuestions[index % availableQuestions.length]
}

