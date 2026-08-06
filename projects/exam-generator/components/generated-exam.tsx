"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Exam {
  title: string
  subject: string
  topics: string[]
  difficulty: string
  questions: {
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
  includeAnswerKey: boolean
}

interface GeneratedExamProps {
  exam: Exam
}

export default function GeneratedExam({ exam }: GeneratedExamProps) {
  const [showAnswers, setShowAnswers] = useState(false)
  const [userAnswers, setUserAnswers] = useState({
    multipleChoice: {},
    trueFalse: {},
    shortAnswer: {},
    essay: {},
  })
  const { toast } = useToast()

  const handleMultipleChoiceAnswer = (questionIndex, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      multipleChoice: {
        ...prev.multipleChoice,
        [questionIndex]: answer,
      },
    }))
  }

  const handleTrueFalseAnswer = (questionIndex, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      trueFalse: {
        ...prev.trueFalse,
        [questionIndex]: answer,
      },
    }))
  }

  const handleShortAnswerChange = (questionIndex, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      shortAnswer: {
        ...prev.shortAnswer,
        [questionIndex]: answer,
      },
    }))
  }

  const handleEssayChange = (questionIndex, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      essay: {
        ...prev.essay,
        [questionIndex]: answer,
      },
    }))
  }

  const calculateScore = () => {
    if (!exam) return 0

    let correctAnswers = 0
    let totalAnswered = 0

    // Check multiple choice
    Object.entries(userAnswers.multipleChoice).forEach(([index, answer]) => {
      const questionIndex = Number.parseInt(index)
      if (
        exam.questions.multipleChoice[questionIndex] &&
        answer === exam.questions.multipleChoice[questionIndex].answer
      ) {
        correctAnswers++
      }
      totalAnswered++
    })

    // Check true/false
    Object.entries(userAnswers.trueFalse).forEach(([index, answer]) => {
      const questionIndex = Number.parseInt(index)
      if (exam.questions.trueFalse[questionIndex] && answer === exam.questions.trueFalse[questionIndex].answer) {
        correctAnswers++
      }
      totalAnswered++
    })

    // Short answer and essay questions would need manual grading in a real system

    return {
      correct: correctAnswers,
      total: totalAnswered,
      percentage: totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0,
    }
  }

  const handleSubmitExam = () => {
    const score = calculateScore()

    toast({
      title: "Exam Submitted",
      description: `You scored ${score.correct}/${score.total} (${score.percentage}%) on the objective questions.`,
    })

    setShowAnswers(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{exam.title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            Subject: {exam.subject} | Topics: {exam.topics.join(", ")} | Difficulty: {exam.difficulty}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="multipleChoice">Multiple Choice</TabsTrigger>
              <TabsTrigger value="trueFalse">True/False</TabsTrigger>
              <TabsTrigger value="shortAnswer">Short Answer</TabsTrigger>
              <TabsTrigger value="essay">Essay</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {/* Multiple Choice */}
              {exam.questions.multipleChoice.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Multiple Choice Questions</h3>
                  {exam.questions.multipleChoice.map((q, i) => (
                    <div key={`mc-${i}`} className="p-4 border rounded-md">
                      <div className="flex justify-between">
                        <p className="font-medium mb-2">
                          {i + 1}. {q.question}
                        </p>
                        {showAnswers && (
                          <div className="flex items-center">
                            <span className="text-sm mr-2">Correct: {q.answer}</span>
                            {userAnswers.multipleChoice[i] === q.answer ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : userAnswers.multipleChoice[i] ? (
                              <X className="h-4 w-4 text-red-500" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      <RadioGroup
                        value={userAnswers.multipleChoice[i] || ""}
                        onValueChange={(value) => handleMultipleChoiceAnswer(i, value)}
                      >
                        {q.options.map((option, j) => (
                          <div key={`mc-${i}-${j}`} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`mc-${i}-${j}`} />
                            <Label htmlFor={`mc-${i}-${j}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                </div>
              )}

              {/* True/False */}
              {exam.questions.trueFalse.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">True/False Questions</h3>
                  {exam.questions.trueFalse.map((q, i) => (
                    <div key={`tf-${i}`} className="p-4 border rounded-md">
                      <div className="flex justify-between">
                        <p className="font-medium mb-2">
                          {exam.questions.multipleChoice.length + i + 1}. {q.question}
                        </p>
                        {showAnswers && (
                          <div className="flex items-center">
                            <span className="text-sm mr-2">Correct: {q.answer ? "True" : "False"}</span>
                            {userAnswers.trueFalse[i] === q.answer ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : userAnswers.trueFalse[i] !== undefined ? (
                              <X className="h-4 w-4 text-red-500" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      <RadioGroup
                        value={userAnswers.trueFalse[i] !== undefined ? userAnswers.trueFalse[i].toString() : ""}
                        onValueChange={(value) => handleTrueFalseAnswer(i, value === "true")}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id={`tf-${i}-true`} />
                          <Label htmlFor={`tf-${i}-true`}>True</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id={`tf-${i}-false`} />
                          <Label htmlFor={`tf-${i}-false`}>False</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  ))}
                </div>
              )}

              {/* Short Answer */}
              {exam.questions.shortAnswer.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Short Answer Questions</h3>
                  {exam.questions.shortAnswer.map((q, i) => (
                    <div key={`sa-${i}`} className="p-4 border rounded-md">
                      <p className="font-medium mb-2">
                        {exam.questions.multipleChoice.length + exam.questions.trueFalse.length + i + 1}. {q.question}
                      </p>
                      <Textarea
                        placeholder="Your answer..."
                        value={userAnswers.shortAnswer[i] || ""}
                        onChange={(e) => handleShortAnswerChange(i, e.target.value)}
                        className="mt-2"
                      />
                      {showAnswers && (
                        <div className="mt-2 p-2 bg-muted rounded-md">
                          <p className="text-sm font-medium">Sample Answer:</p>
                          <p className="text-sm">{q.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Essay */}
              {exam.questions.essay.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Essay Questions</h3>
                  {exam.questions.essay.map((q, i) => (
                    <div key={`essay-${i}`} className="p-4 border rounded-md">
                      <p className="font-medium mb-2">
                        {exam.questions.multipleChoice.length +
                          exam.questions.trueFalse.length +
                          exam.questions.shortAnswer.length +
                          i +
                          1}
                        . {q.question}
                      </p>
                      {q.guidelines && <p className="text-sm text-muted-foreground mb-2">{q.guidelines}</p>}
                      <Textarea
                        placeholder="Your answer..."
                        value={userAnswers.essay[i] || ""}
                        onChange={(e) => handleEssayChange(i, e.target.value)}
                        className="mt-2"
                        rows={6}
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="multipleChoice" className="space-y-4">
              <h3 className="text-lg font-semibold">Multiple Choice Questions</h3>
              {exam.questions.multipleChoice.map((q, i) => (
                <div key={`mc-tab-${i}`} className="p-4 border rounded-md">
                  <div className="flex justify-between">
                    <p className="font-medium mb-2">
                      {i + 1}. {q.question}
                    </p>
                    {showAnswers && (
                      <div className="flex items-center">
                        <span className="text-sm mr-2">Correct: {q.answer}</span>
                        {userAnswers.multipleChoice[i] === q.answer ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : userAnswers.multipleChoice[i] ? (
                          <X className="h-4 w-4 text-red-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  <RadioGroup
                    value={userAnswers.multipleChoice[i] || ""}
                    onValueChange={(value) => handleMultipleChoiceAnswer(i, value)}
                  >
                    {q.options.map((option, j) => (
                      <div key={`mc-tab-${i}-${j}`} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`mc-tab-${i}-${j}`} />
                        <Label htmlFor={`mc-tab-${i}-${j}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="trueFalse" className="space-y-4">
              <h3 className="text-lg font-semibold">True/False Questions</h3>
              {exam.questions.trueFalse.map((q, i) => (
                <div key={`tf-tab-${i}`} className="p-4 border rounded-md">
                  <div className="flex justify-between">
                    <p className="font-medium mb-2">
                      {i + 1}. {q.question}
                    </p>
                    {showAnswers && (
                      <div className="flex items-center">
                        <span className="text-sm mr-2">Correct: {q.answer ? "True" : "False"}</span>
                        {userAnswers.trueFalse[i] === q.answer ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : userAnswers.trueFalse[i] !== undefined ? (
                          <X className="h-4 w-4 text-red-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  <RadioGroup
                    value={userAnswers.trueFalse[i] !== undefined ? userAnswers.trueFalse[i].toString() : ""}
                    onValueChange={(value) => handleTrueFalseAnswer(i, value === "true")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id={`tf-tab-${i}-true`} />
                      <Label htmlFor={`tf-tab-${i}-true`}>True</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id={`tf-tab-${i}-false`} />
                      <Label htmlFor={`tf-tab-${i}-false`}>False</Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="shortAnswer" className="space-y-4">
              <h3 className="text-lg font-semibold">Short Answer Questions</h3>
              {exam.questions.shortAnswer.map((q, i) => (
                <div key={`sa-tab-${i}`} className="p-4 border rounded-md">
                  <p className="font-medium mb-2">
                    {i + 1}. {q.question}
                  </p>
                  <Textarea
                    placeholder="Your answer..."
                    value={userAnswers.shortAnswer[i] || ""}
                    onChange={(e) => handleShortAnswerChange(i, e.target.value)}
                    className="mt-2"
                  />
                  {showAnswers && (
                    <div className="mt-2 p-2 bg-muted rounded-md">
                      <p className="text-sm font-medium">Sample Answer:</p>
                      <p className="text-sm">{q.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="essay" className="space-y-4">
              <h3 className="text-lg font-semibold">Essay Questions</h3>
              {exam.questions.essay.map((q, i) => (
                <div key={`essay-tab-${i}`} className="p-4 border rounded-md">
                  <p className="font-medium mb-2">
                    {i + 1}. {q.question}
                  </p>
                  {q.guidelines && <p className="text-sm text-muted-foreground mb-2">{q.guidelines}</p>}
                  <Textarea
                    placeholder="Your answer..."
                    value={userAnswers.essay[i] || ""}
                    onChange={(e) => handleEssayChange(i, e.target.value)}
                    className="mt-2"
                    rows={6}
                  />
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4 justify-center">
        {!showAnswers && (
          <Button onClick={handleSubmitExam} className="w-full md:w-auto">
            Submit Exam & View Score
          </Button>
        )}

        {exam.includeAnswerKey && (
          <Button
            variant={showAnswers ? "outline" : "secondary"}
            onClick={() => setShowAnswers(!showAnswers)}
            className="w-full md:w-auto"
          >
            {showAnswers ? "Hide Answer Key" : "Show Answer Key"}
          </Button>
        )}
      </div>
    </div>
  )
}

