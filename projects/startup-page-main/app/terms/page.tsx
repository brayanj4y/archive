import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col pt-24 pb-16">
      <div className="container px-4 md:px-6 max-w-4xl">
        <div className="flex flex-col items-start mb-12">
          <Link href="/" className="flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: April 19, 2025</p>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p>
            Please read these Terms of Service ("Terms") carefully before using the DevStudio website or services. These
            Terms constitute a legally binding agreement between you and DevStudio, a trademark of CodeHive, regarding
            your use of our website and services.
          </p>

          <h2>Acceptance of Terms</h2>
          <p>
            By accessing or using our website or services, you agree to be bound by these Terms. If you do not agree to
            these Terms, you may not access or use our website or services.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice of any material changes by
            posting the updated Terms on this page and updating the "Last Updated" date. Your continued use of our
            website or services after any such changes constitutes your acceptance of the new Terms.
          </p>

          <h2>Services</h2>
          <p>
            DevStudio provides no-code mobile application development using FlutterFlow and custom website development
            using Next.js. The specific services to be provided will be outlined in a separate agreement or statement of
            work between DevStudio and the client.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content, features, and functionality of our website, including but not limited to text, graphics, logos,
            icons, images, audio clips, digital downloads, data compilations, and software, are the property of
            DevStudio or its licensors and are protected by copyright, trademark, and other intellectual property laws.
          </p>
          <p>
            For client projects, ownership of intellectual property will be specified in the separate agreement or
            statement of work between DevStudio and the client.
          </p>

          <h2>User Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use our website or services in any way that violates any applicable law or regulation</li>
            <li>
              Engage in any conduct that restricts or inhibits anyone's use or enjoyment of our website or services
            </li>
            <li>
              Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of our website or
              services
            </li>
            <li>Use our website or services for any purpose that is unlawful or prohibited by these Terms</li>
          </ul>

          <h2>Limitation of Liability</h2>
          <p>
            In no event shall DevStudio, its directors, employees, partners, agents, suppliers, or affiliates be liable
            for any indirect, incidental, special, consequential, or punitive damages, including without limitation,
            loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or
            inability to access or use our website or services.
          </p>

          <h2>Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless DevStudio, its directors, employees, partners, agents,
            suppliers, and affiliates from and against any claims, liabilities, damages, judgments, awards, losses,
            costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation
            of these Terms or your use of our website or services.
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which
            DevStudio is located, without regard to its conflict of law provisions.
          </p>

          <h2>Severability</h2>
          <p>
            If any provision of these Terms is held to be invalid or unenforceable, such provision shall be struck and
            the remaining provisions shall be enforced.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at{" "}
            <a href="mailto:souopsilvain@gmail.com">souopsilvain@gmail.com</a> or call us at{" "}
            <a href="tel:+237652570592">+237 652 570 592</a>.
          </p>
        </div>
      </div>
    </main>
  )
}
