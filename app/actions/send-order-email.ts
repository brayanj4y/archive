"use server"

import emailjs from "@emailjs/nodejs"

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
    specialInstructions: string
    microchipPrice: number
}

export async function sendOrderEmail(orderData: OrderData) {
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    const privateKey = process.env.EMAILJS_PRIVATE_KEY
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const orderTemplateId = process.env.EMAILJS_ORDER_TEMPLATE_ID
    const businessEmail = process.env.BUSINESS_EMAIL || "info@chfrenchbulldogs.com"

    if (!publicKey || !privateKey || !serviceId || !orderTemplateId) {
        console.error("[v0] Missing EmailJS configuration")
        throw new Error("Email service is not configured. Please contact support.")
    }

    try {
        // Format order items for email
        const orderItemsList = orderData.cart
            .map((item, index) => {
                const itemTotal = item.puppy.price + (item.addMicrochip ? orderData.microchipPrice : 0)
                return `${index + 1}. ${item.puppy.name}
   Age: ${item.puppy.age}
   Gender: ${item.puppy.gender}
   Color: ${item.puppy.color}
   Price: $${item.puppy.price.toFixed(2)}${item.addMicrochip ? `\n   Microchip: +$${orderData.microchipPrice.toFixed(2)}` : ""}
   Item Total: $${itemTotal.toFixed(2)}`
            })
            .join("\n\n")

        const customerAddress = orderData.customerInfo.address
            ? `${orderData.customerInfo.address}, ${orderData.customerInfo.city}, ${orderData.customerInfo.state} ${orderData.customerInfo.zipCode}`
            : "Not provided"

        const templateParams = {
            order_id: orderData.orderId,
            customer_name: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
            customer_email: orderData.customerInfo.email,
            customer_phone: orderData.customerInfo.phone,
            customer_address: customerAddress,
            order_items: orderItemsList,
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

        console.log("[v0] Sending customer confirmation email...")
        // Send confirmation email to customer
        await emailjs.send(
            serviceId,
            orderTemplateId,
            {
                ...templateParams,
                to_email: orderData.customerInfo.email,
                to_name: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
                email_subject: `Order Confirmation - ${orderData.orderId}`,
            },
            {
                publicKey,
                privateKey,
            },
        )

        console.log("[v0] Sending breeder notification email...")
        // Send notification email to breeder
        await emailjs.send(
            serviceId,
            orderTemplateId,
            {
                ...templateParams,
                to_email: businessEmail,
                to_name: "CH French Bulldogs",
                email_subject: `New Order Received - ${orderData.orderId}`,
            },
            {
                publicKey,
                privateKey,
            },
        )

        console.log("[v0] Order emails sent successfully")
        return { success: true }
    } catch (error) {
        console.error("[v0] EmailJS Error:", error)
        throw new Error("Failed to send order confirmation. Please contact us directly.")
    }
}
