# EmailJS Setup Instructions

This project uses EmailJS to send order confirmation emails. Follow these steps to configure it:

## 1. Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## 2. Create an Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account
5. Note down your **Service ID** (e.g., `service_abc123`)

## 3. Create an Email Template

1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Copy and paste the HTML template from the email template file provided
4. Make sure to use these variable names in your template:
   - `{{order_id}}` - Order ID
   - `{{orders_html}}` - HTML string of order items (pre-formatted)
   - `{{shipping}}` - Shipping cost
   - `{{tax}}` - Tax amount
   - `{{total}}` - Total cost
   - `{{customer_email}}` - Customer email
   - `{{customer_name}}` - Customer full name
   - `{{customer_phone}}` - Customer phone
   - `{{customer_address}}` - Customer address
   - `{{special_instructions}}` - Special instructions
   - `{{to_email}}` - Recipient email (dynamic for business/customer)
   - `{{to_name}}` - Recipient name (dynamic for business/customer)
5. Note down your **Template ID** (e.g., `template_xyz789`)

## 4. Get Your Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `abcdefghijklmnop`)

## 5. Configure Environment Variables

You need to add your EmailJS credentials to the environment variables. In v0:

1. Click on the **Vars** section in the in-chat sidebar (left side of screen)
2. Add the following environment variables:

\`\`\`
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
EMAILJS_SERVICE_ID=your_service_id_here
EMAILJS_TEMPLATE_ID=your_template_id_here
BUSINESS_EMAIL=your_business_email@example.com
\`\`\`

Replace the placeholder values with your actual EmailJS credentials.

**Important Notes:**
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` must have the `NEXT_PUBLIC_` prefix (this is safe to expose)
- The other variables should NOT have the `NEXT_PUBLIC_` prefix (they stay server-side only)
- Make sure to use your actual business email address for `BUSINESS_EMAIL`

## 6. Test Your Setup

1. Add a puppy to cart
2. Go through the checkout process
3. Fill in your email address
4. Click "Order via Email"
5. Check both your business email and the customer email for the confirmation

## Email Template Structure

The email uses the HTML template provided with the following structure:
- Header with logo and "Thank You for Your Order" message
- Order ID
- List of ordered puppies with images, details, and prices
- Order summary with shipping, tax, and total
- Footer with customer email information

The system automatically:
- Generates a unique order ID
- Formats order items as HTML table rows
- Calculates totals including microchip additions
- Sends emails to both business and customer

## Important Notes

- EmailJS free tier allows 200 emails per month
- Make sure to add your logo image as an attachment in the EmailJS template settings (name it `logo.png`)
- The template uses inline CSS for better email client compatibility
- Both you and the customer will receive order confirmation emails
- The WhatsApp option is also available and doesn't require EmailJS setup
- Email sending is handled securely via server actions to protect your credentials

## Troubleshooting

- **Emails not sending**: Check your EmailJS dashboard for error logs and verify all configuration values in the Vars section
- **Template not rendering**: Verify all variable names match exactly (case-sensitive)
- **Images not showing**: Make sure to upload the logo in EmailJS template settings and use `cid:logo.png` in the template
- **Configuration errors**: Double-check that all environment variables are set correctly in the Vars section
- **Customer not receiving email**: Verify the customer's email address is valid and check spam folder

## Alternative: WhatsApp Checkout

If you prefer not to set up EmailJS, customers can still complete orders via WhatsApp. The WhatsApp option:
- Sends a formatted message to +237695950610
- Includes all order details, customer information, and totals
- Works immediately without any configuration
- Opens in a new window for easy sending
