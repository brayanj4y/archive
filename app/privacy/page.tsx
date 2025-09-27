import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <main className="flex min-h-screen flex-col pt-24 pb-16">
      <div className="container px-4 md:px-6 max-w-4xl">
        <div className="flex flex-col items-start mb-12">
          <Link href="/" className="flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: April 19, 2025</p>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p>
            At DevStudio, a trademark of CodeHive, we take your privacy seriously. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>

          <h2>Information We Collect</h2>
          <p>We may collect information about you in a variety of ways, including:</p>
          <ul>
            <li>
              <strong>Personal Data:</strong> Voluntarily provided information which may include your name, email
              address, and phone number that you provide when filling out contact forms or requesting information about
              our services.
            </li>
            <li>
              <strong>Usage Data:</strong> Information our servers automatically collect when you access our website,
              such as your IP address, browser type, operating system, access times, and the pages you have viewed.
            </li>
            <li>
              <strong>Cookies and Tracking Technologies:</strong> We may use cookies and similar tracking technologies
              to track activity on our website and hold certain information to improve and analyze our service.
            </li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We may use the information we collect about you for various purposes, including to:</p>
          <ul>
            <li>Provide, maintain, and improve our website and services</li>
            <li>Respond to your inquiries and fulfill your requests</li>
            <li>Send you administrative information, such as updates, security alerts, and support messages</li>
            <li>Personalize your experience on our website</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our website</li>
            <li>Detect, prevent, and address technical issues</li>
          </ul>

          <h2>Disclosure of Your Information</h2>
          <p>We may share information we have collected about you in certain situations, including:</p>
          <ul>
            <li>
              <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a
              portion of our assets, your information may be transferred as part of that transaction.
            </li>
            <li>
              <strong>Third-Party Service Providers:</strong> We may share your information with third-party service
              providers who perform services on our behalf, such as payment processing, data analysis, email delivery,
              hosting services, and customer service.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your information where required to do so by law or in
              response to valid requests by public authorities.
            </li>
          </ul>

          <h2>Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information.
            While we have taken reasonable steps to secure the personal information you provide to us, please be aware
            that despite our efforts, no security measures are perfect or impenetrable, and no method of data
            transmission can be guaranteed against any interception or other type of misuse.
          </p>

          <h2>Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, such as the
            right to access, correct, delete, or restrict processing of your personal information. To make such a
            request, please contact us using the contact information provided below.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last Updated" date at the top of this page. You are advised to
            review this Privacy Policy periodically for any changes.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:souopsilvain@gmail.com">souopsilvain@gmail.com</a> or call us at{" "}
            <a href="tel:+237652570592">+237 652 570 592</a>.
          </p>
        </div>
      </div>
    </main>
  )
}
