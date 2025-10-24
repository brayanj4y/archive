"use client"

import emailjs from "@emailjs/browser"

interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}

export async function sendContactEmail(formData: ContactFormData) {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID!
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!

  if (!serviceId || !templateId || !publicKey) {
    console.error("EmailJS is not configured")
    throw new Error("Email service is not configured. Please contact us directly.")
  }

  const templateParams = {
    email_subject: `New Contact Form Inquiry from ${formData.name}`,
    from_name: formData.name,
    from_email: formData.email,
    from_phone: formData.phone || "Not provided",
    message: formData.message,
    inquiry_date: new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }

  try {
    console.log("Sending contact form email...")
    await emailjs.send(serviceId, templateId, templateParams, publicKey)
    console.log("Contact email sent successfully")
    return { success: true }
  } catch (error) {
    console.error("EmailJS Error:", error)
    throw new Error("Failed to send message. Please try contacting us via phone or WhatsApp.")
  }
}
