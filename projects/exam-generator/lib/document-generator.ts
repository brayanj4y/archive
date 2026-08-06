"use server"

import { jsPDF } from "jspdf"
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx"

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

export async function generatePDF(exam: Exam): Promise<Uint8Array> {
  // Create a new PDF document
  const doc = new jsPDF()

  // Set up initial variables
  let y = 20
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const textWidth = pageWidth - 2 * margin

  // Add title
  doc.setFontSize(18)
  doc.text(exam.title, pageWidth / 2, y, { align: "center" })
  y += 10

  // Add metadata
  doc.setFontSize(12)
  doc.text(`Subject: ${exam.subject} | Difficulty: ${exam.difficulty}`, pageWidth / 2, y, { align: "center" })
  y += 8
  doc.text(`Topics: ${exam.topics.join(", ")}`, pageWidth / 2, y, { align: "center" })
  y += 15

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize = 12, isBold = false) => {
    doc.setFontSize(fontSize)
    if (isBold) {
      doc.setFont("helvetica", "bold")
    } else {
      doc.setFont("helvetica", "normal")
    }

    // Check if we need a new page
    if (y > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage()
      y = 20
    }

    const lines = doc.splitTextToSize(text, textWidth)
    doc.text(lines, margin, y)
    y += lines.length * (fontSize / 2) + 5
  }

  // Add multiple choice questions
  if (exam.questions.multipleChoice.length > 0) {
    addText("Multiple Choice Questions", 14, true)

    exam.questions.multipleChoice.forEach((q, i) => {
      addText(`${i + 1}. ${q.question}`)

      q.options.forEach((option, j) => {
        const optionLabel = String.fromCharCode(65 + j) // A, B, C, D
        addText(`   ${optionLabel}. ${option}`)
      })

      y += 5
    })

    y += 10
  }

  // Add true/false questions
  if (exam.questions.trueFalse.length > 0) {
    addText("True/False Questions", 14, true)

    exam.questions.trueFalse.forEach((q, i) => {
      const questionNumber = exam.questions.multipleChoice.length + i + 1
      addText(`${questionNumber}. ${q.question}`)
      addText(`   True (   )    False (   )`)
      y += 5
    })

    y += 10
  }

  // Add short answer questions
  if (exam.questions.shortAnswer.length > 0) {
    addText("Short Answer Questions", 14, true)

    exam.questions.shortAnswer.forEach((q, i) => {
      const questionNumber = exam.questions.multipleChoice.length + exam.questions.trueFalse.length + i + 1
      addText(`${questionNumber}. ${q.question}`)

      // Add lines for answer
      doc.setDrawColor(200)
      doc.line(margin, y, pageWidth - margin, y)
      y += 10
      doc.line(margin, y, pageWidth - margin, y)
      y += 15
    })

    y += 10
  }

  // Add essay questions
  if (exam.questions.essay.length > 0) {
    addText("Essay Questions", 14, true)

    exam.questions.essay.forEach((q, i) => {
      const questionNumber =
        exam.questions.multipleChoice.length +
        exam.questions.trueFalse.length +
        exam.questions.shortAnswer.length +
        i +
        1
      addText(`${questionNumber}. ${q.question}`)

      if (q.guidelines) {
        addText(`   Guidelines: ${q.guidelines}`)
      }

      y += 20 // Space for answer
    })
  }

  // Add answer key if requested
  if (exam.includeAnswerKey) {
    doc.addPage()
    y = 20

    addText("Answer Key", 16, true)
    y += 5

    // Multiple choice answers
    if (exam.questions.multipleChoice.length > 0) {
      addText("Multiple Choice:", 14, true)

      const mcAnswers = exam.questions.multipleChoice.map((q, i) => `${i + 1}. ${q.answer}`).join("   |   ")

      addText(mcAnswers)
      y += 10
    }

    // True/False answers
    if (exam.questions.trueFalse.length > 0) {
      addText("True/False:", 14, true)

      const tfAnswers = exam.questions.trueFalse
        .map((q, i) => {
          const questionNumber = exam.questions.multipleChoice.length + i + 1
          return `${questionNumber}. ${q.answer ? "True" : "False"}`
        })
        .join("   |   ")

      addText(tfAnswers)
      y += 10
    }

    // Short answer answers
    if (exam.questions.shortAnswer.length > 0) {
      addText("Short Answer:", 14, true)

      exam.questions.shortAnswer.forEach((q, i) => {
        const questionNumber = exam.questions.multipleChoice.length + exam.questions.trueFalse.length + i + 1
        addText(`${questionNumber}. ${q.answer}`)
      })

      y += 10
    }
  }

  try {
    // Return the PDF as a Uint8Array
    return doc.output("arraybuffer")
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw new Error("Failed to generate PDF: " + error.message)
  }
}

export async function generateDOCX(exam: Exam): Promise<Uint8Array> {
  try {
    // Create a new document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Title
            new Paragraph({
              text: exam.title,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),

            // Metadata
            new Paragraph({
              text: `Subject: ${exam.subject} | Difficulty: ${exam.difficulty}`,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: `Topics: ${exam.topics.join(", ")}`,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }), // Empty line

            // Multiple Choice Questions
            ...(exam.questions.multipleChoice.length > 0
              ? [
                  new Paragraph({
                    text: "Multiple Choice Questions",
                    heading: HeadingLevel.HEADING_2,
                  }),
                  ...exam.questions.multipleChoice.flatMap((q, i) => [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${i + 1}. ${q.question}`,
                          bold: true,
                        }),
                      ],
                    }),
                    ...q.options.map((option, j) => {
                      const optionLabel = String.fromCharCode(65 + j) // A, B, C, D
                      return new Paragraph({
                        text: `   ${optionLabel}. ${option}`,
                        indent: { left: 720 }, // 0.5 inch indent
                      })
                    }),
                    new Paragraph({ text: "" }), // Empty line
                  ]),
                ]
              : []),

            // True/False Questions
            ...(exam.questions.trueFalse.length > 0
              ? [
                  new Paragraph({
                    text: "True/False Questions",
                    heading: HeadingLevel.HEADING_2,
                  }),
                  ...exam.questions.trueFalse.flatMap((q, i) => [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${exam.questions.multipleChoice.length + i + 1}. ${q.question}`,
                          bold: true,
                        }),
                      ],
                    }),
                    new Paragraph({
                      text: "   True (   )    False (   )",
                      indent: { left: 720 }, // 0.5 inch indent
                    }),
                    new Paragraph({ text: "" }), // Empty line
                  ]),
                ]
              : []),

            // Short Answer Questions
            ...(exam.questions.shortAnswer.length > 0
              ? [
                  new Paragraph({
                    text: "Short Answer Questions",
                    heading: HeadingLevel.HEADING_2,
                  }),
                  ...exam.questions.shortAnswer.flatMap((q, i) => [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${exam.questions.multipleChoice.length + exam.questions.trueFalse.length + i + 1}. ${
                            q.question
                          }`,
                          bold: true,
                        }),
                      ],
                    }),
                    new Paragraph({
                      text: "Answer: _______________________________________________",
                      indent: { left: 720 }, // 0.5 inch indent
                    }),
                    new Paragraph({
                      text: "________________________________________________________",
                      indent: { left: 720 }, // 0.5 inch indent
                    }),
                    new Paragraph({ text: "" }), // Empty line
                  ]),
                ]
              : []),

            // Essay Questions
            ...(exam.questions.essay.length > 0
              ? [
                  new Paragraph({
                    text: "Essay Questions",
                    heading: HeadingLevel.HEADING_2,
                  }),
                  ...exam.questions.essay.flatMap((q, i) => [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${
                            exam.questions.multipleChoice.length +
                            exam.questions.trueFalse.length +
                            exam.questions.shortAnswer.length +
                            i +
                            1
                          }. ${q.question}`,
                          bold: true,
                        }),
                      ],
                    }),
                    ...(q.guidelines
                      ? [
                          new Paragraph({
                            text: `Guidelines: ${q.guidelines}`,
                            indent: { left: 720 }, // 0.5 inch indent
                          }),
                        ]
                      : []),
                    new Paragraph({ text: "" }), // Empty line for answer space
                    new Paragraph({ text: "" }), // Empty line for answer space
                    new Paragraph({ text: "" }), // Empty line for answer space
                    new Paragraph({ text: "" }), // Empty line
                  ]),
                ]
              : []),

            // Answer Key (if requested)
            ...(exam.includeAnswerKey
              ? [
                  new Paragraph({
                    text: "Answer Key",
                    heading: HeadingLevel.HEADING_1,
                    pageBreakBefore: true,
                  }),

                  // Multiple Choice Answers
                  ...(exam.questions.multipleChoice.length > 0
                    ? [
                        new Paragraph({
                          text: "Multiple Choice:",
                          heading: HeadingLevel.HEADING_3,
                        }),
                        new Paragraph({
                          text: exam.questions.multipleChoice.map((q, i) => `${i + 1}. ${q.answer}`).join("   |   "),
                        }),
                        new Paragraph({ text: "" }), // Empty line
                      ]
                    : []),

                  // True/False Answers
                  ...(exam.questions.trueFalse.length > 0
                    ? [
                        new Paragraph({
                          text: "True/False:",
                          heading: HeadingLevel.HEADING_3,
                        }),
                        new Paragraph({
                          text: exam.questions.trueFalse
                            .map(
                              (q, i) =>
                                `${exam.questions.multipleChoice.length + i + 1}. ${q.answer ? "True" : "False"}`,
                            )
                            .join("   |   "),
                        }),
                        new Paragraph({ text: "" }), // Empty line
                      ]
                    : []),

                  // Short Answer Answers
                  ...(exam.questions.shortAnswer.length > 0
                    ? [
                        new Paragraph({
                          text: "Short Answer:",
                          heading: HeadingLevel.HEADING_3,
                        }),
                        ...exam.questions.shortAnswer.map(
                          (q, i) =>
                            new Paragraph({
                              text: `${exam.questions.multipleChoice.length + exam.questions.trueFalse.length + i + 1}. ${
                                q.answer
                              }`,
                            }),
                        ),
                      ]
                    : []),
                ]
              : []),
          ],
        },
      ],
    })

    // Generate the document as a buffer
    const buffer = await Packer.toBuffer(doc)

    // Convert buffer to Uint8Array
    return new Uint8Array(buffer)
  } catch (error) {
    console.error("Error generating DOCX:", error)
    throw new Error("Failed to generate DOCX: " + error.message)
  }
}

