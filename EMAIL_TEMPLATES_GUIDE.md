# EmailJS Templates Setup Guide

This guide will help you create the two email templates needed for the CH French Bulldogs website.

## Prerequisites

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Create a new Email Service (Gmail, Outlook, etc.)
3. Enable API requests for non-browser applications in Account > Security settings

## Environment Variables

Add these to your Vercel project or `.env.local` file:

\`\`\`env
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
EMAILJS_ORDER_TEMPLATE_ID=your_order_template_id
EMAILJS_CONTACT_TEMPLATE_ID=your_contact_template_id
BUSINESS_EMAIL=info@chfrenchbulldogs.com
\`\`\`

---

## Template 1: Order Confirmation Email

**Template ID:** Use this as `EMAILJS_ORDER_TEMPLATE_ID`

**Subject:** `{{email_subject}}`

**Template Content:**

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
    .order-id { background: #f8f9fa; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
    .dotted-line { border-bottom: 2px dotted #ccc; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; }
    .total-row { background: #f8f9fa; padding: 15px; margin-top: 10px; font-size: 18px; font-weight: bold; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐾 CH French Bulldogs</h1>
      <p>Order Confirmation</p>
    </div>
    
    <div class="content">
      <h2>Thank You, {{customer_name}}!</h2>
      <p>We've received your order and are excited to help you welcome your new French Bulldog puppy!</p>
      
      <div class="order-id">
        <strong>Order ID:</strong> {{order_id}}<br>
        <strong>Order Date:</strong> {{order_date}}
      </div>
      
      <div class="dotted-line"></div>
      
      <h3>Customer Information</h3>
      <p>
        <strong>Name:</strong> {{customer_name}}<br>
        <strong>Email:</strong> {{customer_email}}<br>
        <strong>Phone:</strong> {{customer_phone}}<br>
        <strong>Address:</strong> {{customer_address}}
      </p>
      
      <div class="dotted-line"></div>
      
      <h3>Order Details</h3>
      <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">{{order_items}}</pre>
      
      <div class="dotted-line"></div>
      
      <h3>Order Summary</h3>
      <div class="info-row">
        <span>Subtotal:</span>
        <span>${{subtotal}}</span>
      </div>
      <div class="info-row">
        <span>Shipping:</span>
        <span>${{shipping}}</span>
      </div>
      <div class="info-row">
        <span>Tax:</span>
        <span>${{tax}}</span>
      </div>
      <div class="total-row">
        <div class="info-row" style="margin: 0;">
          <span>Total:</span>
          <span>${{total}}</span>
        </div>
      </div>
      
      <div class="dotted-line"></div>
      
      <h3>Special Instructions</h3>
      <p>{{special_instructions}}</p>
      
      <div class="dotted-line"></div>
      
      <h3>What's Next?</h3>
      <ul>
        <li>Our team will review your order within 24 hours</li>
        <li>We'll contact you to arrange payment and delivery details</li>
        <li>Your puppy will be prepared for their journey home!</li>
      </ul>
      
      <p style="margin-top: 30px;">
        <strong>Questions?</strong> Contact us at:<br>
        📧 info@chfrenchbulldogs.com<br>
        📱 (503) 555-1234<br>
        💬 WhatsApp: +1 (503) 555-1234
      </p>
    </div>
    
    <div class="footer">
      <p>© 2025 CH French Bulldogs. All rights reserved.</p>
      <p>Dallas, Texas | www.chfrenchbulldogs.com</p>
    </div>
  </div>
</body>
</html>
\`\`\`

**Template Variables:**
- `{{to_email}}` - Recipient email (auto-filled by server action)
- `{{to_name}}` - Recipient name (auto-filled by server action)
- `{{email_subject}}` - Email subject line
- `{{order_id}}` - Order ID
- `{{order_date}}` - Order date
- `{{customer_name}}` - Customer full name
- `{{customer_email}}` - Customer email
- `{{customer_phone}}` - Customer phone
- `{{customer_address}}` - Customer address
- `{{order_items}}` - Formatted list of ordered puppies
- `{{subtotal}}` - Order subtotal
- `{{shipping}}` - Shipping cost
- `{{tax}}` - Tax amount
- `{{total}}` - Total amount
- `{{special_instructions}}` - Special instructions

---

## Template 2: Contact Form Email

**Template ID:** Use this as `EMAILJS_CONTACT_TEMPLATE_ID`

**Subject:** `{{email_subject}}`

**Template Content:**

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
    .dotted-line { border-bottom: 2px dotted #ccc; margin: 20px 0; }
    .info-box { background: #f8f9fa; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
    .message-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐾 CH French Bulldogs</h1>
      <p>New Contact Form Inquiry</p>
    </div>
    
    <div class="content">
      <h2>New Message Received</h2>
      <p>You have received a new inquiry through your website contact form.</p>
      
      <div class="dotted-line"></div>
      
      <h3>Contact Information</h3>
      <div class="info-box">
        <p style="margin: 5px 0;"><strong>Name:</strong> {{from_name}}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:{{from_email}}">{{from_email}}</a></p>
        <p style="margin: 5px 0;"><strong>Phone:</strong> {{from_phone}}</p>
        <p style="margin: 5px 0;"><strong>Date:</strong> {{inquiry_date}}</p>
      </div>
      
      <div class="dotted-line"></div>
      
      <h3>Message</h3>
      <div class="message-box">
        <p style="white-space: pre-wrap;">{{message}}</p>
      </div>
      
      <div class="dotted-line"></div>
      
      <p style="margin-top: 30px;">
        <strong>Quick Actions:</strong><br>
        📧 <a href="mailto:{{from_email}}">Reply via Email</a><br>
        📱 <a href="tel:{{from_phone}}">Call {{from_name}}</a>
      </p>
    </div>
    
    <div class="footer">
      <p>© 2025 CH French Bulldogs. All rights reserved.</p>
      <p>This is an automated notification from your website contact form.</p>
    </div>
  </div>
</body>
</html>
\`\`\`

**Template Variables:**
- `{{to_email}}` - Your business email (auto-filled by server action)
- `{{to_name}}` - Your business name (auto-filled by server action)
- `{{email_subject}}` - Email subject line
- `{{from_name}}` - Contact form sender name
- `{{from_email}}` - Contact form sender email
- `{{from_phone}}` - Contact form sender phone
- `{{message}}` - Contact form message
- `{{inquiry_date}}` - Date and time of inquiry

---

## Setup Instructions

1. **Create Email Service:**
   - Go to EmailJS Dashboard > Email Services
   - Click "Add New Service"
   - Choose your email provider (Gmail recommended)
   - Follow the authentication steps
   - Copy the Service ID

2. **Create Templates:**
   - Go to Email Templates > Create New Template
   - Paste the HTML content above
   - Add all the template variables listed
   - Test the template with sample data
   - Copy the Template ID

3. **Enable API Access:**
   - Go to Account > Security
   - Enable "Allow non-browser requests"
   - This is required for server-side sending

4. **Add Environment Variables:**
   - Add all the environment variables to your Vercel project
   - Or create a `.env.local` file for local development

5. **Test:**
   - Submit a test order or contact form
   - Check that emails are received correctly
   - Verify all variables are populated

---

## Troubleshooting

- **Emails not sending:** Check that API access is enabled in EmailJS Security settings
- **Missing variables:** Ensure all template variables match the ones in the server actions
- **Rate limiting:** EmailJS has a limit of 1 request per second on free tier
- **Spam folder:** Check spam/junk folders if emails aren't appearing in inbox

---

## Support

For EmailJS support, visit: https://www.emailjs.com/docs/
\`\`\`

```typescriptreact file="EMAILJS_SETUP.md" isDeleted="true"
...deleted...
