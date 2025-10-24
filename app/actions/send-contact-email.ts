"use server"

import emailjs from "@emailjs/nodejs"

interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}

export async function sendContactEmail(formData: ContactFormData) {
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
  const privateKey = process.env.EMAILJS_PRIVATE_KEY
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const contactTemplateId = process.env.EMAILJS_CONTACT_TEMPLATE_ID
  const businessEmail = process.env.BUSINESS_EMAIL || "info@chfrenchbulldogs.com"

  if (!publicKey || !privateKey || !serviceId || !contactTemplateId) {
    console.error("[v0] Missing EmailJS configuration")
    throw new Error("Email service is not configured. Please contact us directly.")
  }

  try {
    const templateParams = {
      to_email: businessEmail,
      to_name: "CH French Bulldogs",
      from_name: formData.name,
      from_email: formData.email,
      from_phone: formData.phone || "Not provided",
      message: formData.message,
      email_subject: `New Contact Form Inquiry from ${formData.name}`,
      inquiry_date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    console.log("[v0] Sending contact form email...")
    await emailjs.send(serviceId, contactTemplateId, templateParams, {
      publicKey,
      privateKey,
    })

    console.log("[v0] Contact email sent successfully")
    return { success: true }
  } catch (error) {
    console.error("[v0] EmailJS Error:", error)
    throw new Error("Failed to send message. Please try contacting us via phone or WhatsApp.")
  }
}
