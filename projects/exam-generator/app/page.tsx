import ExamGenerator from "@/components/exam-generator"
import ApiDiagnostics from "@/components/api-diagnostics"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <>
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">AI-Powered Exam Question Generator</h1>
        <ExamGenerator />
        <ApiDiagnostics />
      </main>
      <Footer />
    </>
  )
}

