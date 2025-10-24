"use client"

import emailjs from "@emailjs/browser"

interface OrderItem {
    puppy: {
        id: number
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
    specialInstructions?: string
    microchipPrice: number
}

export async function sendOrderEmail(orderData: OrderData) {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID!
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!

    if (!serviceId || !templateId || !publicKey) {
        throw new Error("EmailJS is not configured")
    }

    const orderItemsHTML = orderData.cart
        .map((item, i) => {
            const itemTotal = item.puppy.price + (item.addMicrochip ? orderData.microchipPrice : 0);
            return `
      <div style="padding:8px 0; border-bottom:1px solid #eee;">
        <div><strong>${i + 1}. ${item.puppy.name}</strong></div>
        <div>Age: ${item.puppy.age}</div>
        <div>Gender: ${item.puppy.gender}</div>
        <div>Color: ${item.puppy.color}${item.addMicrochip ? `<div>Microchip: +$${orderData.microchipPrice.toFixed(2)}</div>` : ""}</div>
        <div>Price: <strong>$${itemTotal.toFixed(2)}</strong></div>
      </div>
    `;
        })
        .join("");



    const customerAddress = orderData.customerInfo.address
        ? `${orderData.customerInfo.address}, ${orderData.customerInfo.city}, ${orderData.customerInfo.state} ${orderData.customerInfo.zipCode}`
        : "Not provided"

    const templateParams = {
        email_subject: `New Order Received - ${orderData.orderId}`,
        order_id: orderData.orderId,
        customer_name: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
        customer_email: orderData.customerInfo.email,
        customer_phone: orderData.customerInfo.phone,
        customer_address: customerAddress,
        order_items: orderItemsHTML,
        subtotal: orderData.totals.subtotal.toFixed(2),
        shipping: orderData.totals.shipping.toFixed(2),
        tax: orderData.totals.tax.toFixed(2),
        total: orderData.totals.total.toFixed(2),
        special_instructions: orderData.specialInstructions || "None",
        order_date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
    }

    await emailjs.send(serviceId, templateId, templateParams, publicKey)
}
