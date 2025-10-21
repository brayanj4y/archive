"use server"

import emailjs from "@emailjs/browser"

interface OrderItem {
  puppy: {
    id: string
    name: string
    age: string
    gender: string
    color: string
    price: number
    image: string
  }
  addMicrochip: boolean
}

interface OrderData {
  orderId: string
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  cart: OrderItem[]
  totals: {
    subtotal: number
    shipping: number
    tax: number
    total: number
  }
  specialInstructions: string
  microchipPrice: number
}

export async function sendOrderEmail(orderData: OrderData) {
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
  const serviceId = process.env.EMAILJS_SERVICE_ID
  const templateId = process.env.EMAILJS_TEMPLATE_ID
  const businessEmail = process.env.BUSINESS_EMAIL

  if (!publicKey || !serviceId || !templateId || !businessEmail) {
    throw new Error("EmailJS configuration is missing. Please contact the administrator.")
  }

  try {
    emailjs.init(publicKey)

    // Prepare order items HTML for email template
    const ordersHTML = orderData.cart
      .map(
        (item) => `
        <tr style="vertical-align: top">
          <td style="padding: 24px 8px 0 4px; display: inline-block; width: max-content">
            <img style="height: 64px" height="64px" src="${item.puppy.image}" alt="${item.puppy.name}" />
          </td>
          <td style="padding: 24px 8px 0 8px; width: 100%">
            <div>${item.puppy.name} - ${item.puppy.age}, ${item.puppy.gender}, ${item.puppy.color}</div>
            <div style="font-size: 14px; color: #888; padding-top: 4px">QTY: 1${item.addMicrochip ? " + Microchip" : ""}</div>
          </td>
          <td style="padding: 24px 4px 0 0; white-space: nowrap">
            <strong>$${(item.puppy.price + (item.addMicrochip ? orderData.microchipPrice : 0)).toFixed(2)}</strong>
          </td>
        </tr>
      `,
      )
      .join("")

    const templateParams = {
      order_id: orderData.orderId,
      orders_html: ordersHTML,
      shipping: orderData.totals.shipping.toFixed(2),
      tax: orderData.totals.tax.toFixed(2),
      total: orderData.totals.total.toFixed(2),
      customer_email: orderData.customerInfo.email,
      customer_name: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
      customer_phone: orderData.customerInfo.phone,
      customer_address: `${orderData.customerInfo.address}, ${orderData.customerInfo.city}, ${orderData.customerInfo.state} ${orderData.customerInfo.zipCode}`,
      special_instructions: orderData.specialInstructions || "None",
    }

    // Send email to business
    await emailjs.send(serviceId, templateId, {
      ...templateParams,
      to_email: businessEmail,
      to_name: "CH French Bulldogs",
    })

    // Send confirmation email to customer
    await emailjs.send(serviceId, templateId, {
      ...templateParams,
      to_email: orderData.customerInfo.email,
      to_name: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
    })

    return { success: true }
  } catch (error) {
    console.error(" EmailJS Error:", error)
    throw new Error("Failed to send order confirmation email")
  }
}
