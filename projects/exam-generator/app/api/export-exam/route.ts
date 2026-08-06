import { type NextRequest, NextResponse } from "next/server"
import { generatePDF, generateDOCX } from "@/lib/document-generator"

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()

    // Extract parameters
    const { exam, format } = body

    // Validate input
    if (!exam) {
      return NextResponse.json({ success: false, error: "Missing exam data" }, { status: 400 })
    }

    if (!format || (format !== "pdf" && format !== "docx")) {
      return NextResponse.json({ success: false, error: "Invalid or missing format" }, { status: 400 })
    }

    let fileBuffer: Uint8Array
    let contentType: string
    let filename: string

    // Generate the document in the requested format
    try {
      if (format === "pdf") {
        fileBuffer = await generatePDF(exam)
        contentType = "application/pdf"
        filename = `${exam.subject.replace(/\s+/g, "_")}_Exam.pdf`
      } else if (format === "docx") {
        fileBuffer = await generateDOCX(exam)
        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        filename = `${exam.subject.replace(/\s+/g, "_")}_Exam.docx`
      } else {
        return NextResponse.json({ success: false, error: "Unsupported format" }, { status: 400 })
      }
    } catch (error) {
      console.error(`Error generating ${format} file:`, error)
      return NextResponse.json(
        { success: false, error: `Failed to generate ${format.toUpperCase()} file: ${error.message}` },
        { status: 500 },
      )
    }

    // Return the document
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error exporting exam:", error)
    return NextResponse.json({ success: false, error: `Failed to export exam: ${error.message}` }, { status: 500 })
  }
}

