"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Download, FileText, Eye, Loader2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import QuestionTypeDistribution from "./question-type-distribution"
import GeneratedExam from "./generated-exam"
import { generateQuestions } from "@/lib/question-generator"
import { useToast } from "@/hooks/use-toast"

// Mock data for subjects
const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "History",
  "Geography",
  "Literature",
  "Economics",
]

export default function ExamGenerator() {
  const [subject, setSubject] = useState("")
  const [topics, setTopics] = useState("")
  const [questionCount, setQuestionCount] = useState(10)
  const [difficulty, setDifficulty] = useState(50)
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true)
  const [questionTypes, setQuestionTypes] = useState({
    multipleChoice: 40,
    trueFalse: 20,
    shortAnswer: 30,
    essay: 10,
  })
  const [activeTab, setActiveTab] = useState("configure")
  const [generatedExam, setGeneratedExam] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [usingFallback, setUsingFallback] = useState(false)
  const [rateLimitInfo, setRateLimitInfo] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [errorDetails, setErrorDetails] = useState("")
  const [pdfLoading, setPdfLoading] = useState(false)
  const [docxLoading, setDocxLoading] = useState(false)
  const { toast } = useToast()

  const handleQuestionTypeChange = (type, value) => {
    setQuestionTypes((prev) => {
      const newDistribution = { ...prev, [type]: value }

      // Ensure total is 100%
      const total = Object.values(newDistribution).reduce((sum, val) => sum + val, 0)
      if (total !== 100) {
        const diff = 100 - total
        // Distribute the difference among other types
        const otherTypes = Object.keys(newDistribution).filter((t) => t !== type)
        if (otherTypes.length > 0) {
          const adjustPerType = diff / otherTypes.length
          otherTypes.forEach((t) => {
            newDistribution[t] = Math.max(0, Math.min(100, newDistribution[t] + adjustPerType))
          })
        }
      }

      return newDistribution
    })
  }

  const generateExam = async () => {
    if (!subject || !topics) {
      toast({
        title: "Missing information",
        description: "Please select a subject and enter topics.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setUsingFallback(false)
    setRateLimitInfo(false)
    setGenerationProgress(0)
    setErrorDetails("")

    try {
      // Calculate number of questions per type
      const mcCount = Math.round((questionTypes.multipleChoice / 100) * questionCount)
      const tfCount = Math.round((questionTypes.trueFalse / 100) * questionCount)
      const saCount = Math.round((questionTypes.shortAnswer / 100) * questionCount)
      const essayCount = Math.round((questionTypes.essay / 100) * questionCount)

      // Adjust to ensure we get exactly the requested number of questions
      const totalCalculated = mcCount + tfCount + saCount + essayCount
      const adjustedCounts = { mcCount, tfCount, saCount, essayCount }

      if (totalCalculated !== questionCount) {
        const diff = questionCount - totalCalculated
        // Add or subtract from the largest category
        const largest = Object.entries(questionTypes).reduce(
          (max, [key, val]) => (val > max.val ? { key, val } : max),
          { key: "", val: 0 },
        )

        if (largest.key === "multipleChoice") adjustedCounts.mcCount += diff
        else if (largest.key === "trueFalse") adjustedCounts.tfCount += diff
        else if (largest.key === "shortAnswer") adjustedCounts.saCount += diff
        else adjustedCounts.essayCount += diff
      }

      const difficultyLevel = difficulty === 0 ? "easy" : difficulty === 50 ? "medium" : "hard"

      // Show progress toast for large question sets
      if (questionCount > 20) {
        toast({
          title: "Generating Questions",
          description: "This may take a moment for large question sets...",
        })
      }

      try {
        // Set up progress updates
        setGenerationProgress(10) // Initial progress

        const questions = await generateQuestions({
          subject,
          topics: topics.split(",").map((t) => t.trim()),
          difficulty: difficultyLevel,
          counts: adjustedCounts,
        })

        setGenerationProgress(90) // Almost done

        // Check if we're using fallback content (this is a heuristic)
        const isFallback =
          (questions.multipleChoice.length > 0 && questions.multipleChoice[0].question.includes("Fallback")) ||
          (questions.trueFalse.length > 0 && questions.trueFalse[0].question.includes("Fallback"))

        if (isFallback) {
          setUsingFallback(true)
          setRateLimitInfo(true)
          toast({
            title: "Using Fallback Questions",
            description: "Rate limit reached for Google AI. Using pre-defined questions instead.",
            variant: "warning",
          })
        } else {
          toast({
            title: "Exam Generated",
            description: `Successfully generated ${questionCount} questions with Gemini 1.5 Flash.`,
          })
        }

        setGeneratedExam({
          title: `${subject} Exam${isFallback ? " (Fallback)" : ""}`,
          subject,
          topics: topics.split(",").map((t) => t.trim()),
          difficulty: difficultyLevel,
          questions,
          includeAnswerKey,
        })

        setGenerationProgress(100) // Complete
        setActiveTab("preview")
      } catch (error) {
        console.error("Error in question generation:", error)
        setErrorDetails(error.message || "Unknown error during question generation")

        // Show a warning but continue with mock data
        setUsingFallback(true)
        setRateLimitInfo(true)

        toast({
          title: "Using Fallback Questions",
          description: "Error generating questions with Google AI. Using pre-defined questions instead.",
          variant: "destructive",
        })

        // Create mock questions
        const mockQuestions = {
          multipleChoice: Array(adjustedCounts.mcCount)
            .fill(0)
            .map((_, i) => ({
              question: `Sample multiple choice question ${i + 1} about ${subject}`,
              options: ["Option A", "Option B", "Option C", "Option D"],
              answer: "Option A",
            })),
          trueFalse: Array(adjustedCounts.tfCount)
            .fill(0)
            .map((_, i) => ({
              question: `Sample true/false statement ${i + 1} about ${subject}`,
              answer: i % 2 === 0,
            })),
          shortAnswer: Array(adjustedCounts.saCount)
            .fill(0)
            .map((_, i) => ({
              question: `Sample short answer question ${i + 1} about ${subject}`,
              answer: "Sample answer to the question.",
            })),
          essay: Array(adjustedCounts.essayCount)
            .fill(0)
            .map((_, i) => ({
              question: `Sample essay question ${i + 1} about ${subject}`,
              guidelines: "Write a comprehensive essay addressing the key points.",
            })),
        }

        setGeneratedExam({
          title: `${subject} Exam (Fallback)`,
          subject,
          topics: topics.split(",").map((t) => t.trim()),
          difficulty: difficultyLevel,
          questions: mockQuestions,
          includeAnswerKey,
        })

        setActiveTab("preview")
      }
    } catch (error) {
      console.error("Error generating exam:", error)
      setErrorDetails(error.message || "Unknown error")
      toast({
        title: "Error",
        description: "Failed to generate exam. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  const handleExport = async (format) => {
    if (!generatedExam) return

    try {
      // Set the appropriate loading state
      if (format === "pdf") {
        setPdfLoading(true)
      } else if (format === "docx") {
        setDocxLoading(true)
      }

      toast({
        title: "Preparing export",
        description: `Exporting exam as ${format.toUpperCase()}...`,
      })

      // Call the API to generate the document
      const response = await fetch("/api/export-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exam: generatedExam,
          format,
        }),
      })

      if (!response.ok) {
        // Try to get detailed error message from response
        let errorMessage = `Export failed with status: ${response.status}`
        try {
          const errorData = await response.json()
          if (errorData && errorData.error) {
            errorMessage = errorData.error
          }
        } catch (e) {
          // If we can't parse the error response, use the default message
        }
        throw new Error(errorMessage)
      }

      // Get the blob from the response
      const blob = await response.blob()

      // Validate the blob
      if (blob.size === 0) {
        throw new Error("Generated file is empty")
      }

      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `${generatedExam.subject.replace(/\s+/g, "_")}_Exam.${format}`
      document.body.appendChild(a)
      a.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Export complete",
        description: `Your exam has been exported as ${format.toUpperCase()}.`,
      })
    } catch (error) {
      console.error("Error exporting exam:", error)
      toast({
        title: "Export failed",
        description: error.message || "There was an error exporting your exam.",
        variant: "destructive",
      })
    } finally {
      // Reset loading state
      if (format === "pdf") {
        setPdfLoading(false)
      } else if (format === "docx") {
        setDocxLoading(false)
      }
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        {rateLimitInfo && (
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>API Limit Reached</AlertTitle>
            <AlertDescription>
              The Google AI API has rate limits that may affect question generation. Your exam was generated using
              fallback questions. Gemini 1.5 Flash has higher throughput than Pro, but still has limits.
            </AlertDescription>
          </Alert>
        )}

        {errorDetails && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription>{errorDetails}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="configure">Configure Exam</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedExam}>
              Preview Exam
            </TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="topics">Topics (comma separated)</Label>
                  <Textarea
                    id="topics"
                    placeholder="Algebra, Geometry, Calculus..."
                    value={topics}
                    onChange={(e) => setTopics(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="questionCount">Number of Questions: {questionCount}</Label>
                  <Slider
                    id="questionCount"
                    min={5}
                    max={50}
                    step={1}
                    value={[questionCount]}
                    onValueChange={(value) => setQuestionCount(value[0])}
                    className="my-4"
                  />
                  {questionCount > 30 && (
                    <p className="text-xs text-amber-600">
                      Note: Generating {questionCount} questions may take longer and could hit API rate limits.
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="difficulty">
                    Difficulty: {difficulty === 0 ? "Easy" : difficulty === 50 ? "Medium" : "Hard"}
                  </Label>
                  <Slider
                    id="difficulty"
                    min={0}
                    max={100}
                    step={50}
                    value={[difficulty]}
                    onValueChange={(value) => setDifficulty(value[0])}
                    className="my-4"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="answerKey" checked={includeAnswerKey} onCheckedChange={setIncludeAnswerKey} />
                  <Label htmlFor="answerKey">Include Answer Key</Label>
                </div>
              </div>

              <div>
                <Label className="block mb-4">Question Type Distribution</Label>
                <QuestionTypeDistribution distribution={questionTypes} onChange={handleQuestionTypeChange} />
              </div>
            </div>

            <Button onClick={generateExam} className="w-full" disabled={!subject || !topics || isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {generationProgress > 0 ? `Generating... ${generationProgress}%` : "Generating Exam..."}
                </>
              ) : (
                "Generate Exam"
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-2">
              Using Gemini 1.5 Flash for faster question generation. This model has higher throughput than Pro.
            </p>
          </TabsContent>

          <TabsContent value="preview">
            {generatedExam && (
              <div className="space-y-6">
                {usingFallback && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                    <p className="text-yellow-800 text-sm flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Using fallback questions due to API rate limits or parsing errors. These are generic questions not
                      specifically tailored to your topics.
                    </p>
                  </div>
                )}

                <GeneratedExam exam={generatedExam} />

                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    onClick={() => handleExport("pdf")}
                    className="flex items-center gap-2"
                    disabled={pdfLoading || docxLoading}
                  >
                    {pdfLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Exporting PDF...
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        Export as PDF
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleExport("docx")}
                    className="flex items-center gap-2"
                    disabled={pdfLoading || docxLoading}
                  >
                    {docxLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Exporting DOCX...
                      </>
                    ) : (
                      <>
                        <FileText size={16} />
                        Export as DOCX
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("configure")}
                    className="flex items-center gap-2"
                    disabled={pdfLoading || docxLoading}
                  >
                    <Eye size={16} />
                    Back to Configure
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

