import { MetadataRoute } from 'next'

if (!process.env.NEXT_PUBLIC_BASE_URL) {
    throw new Error('NEXT_PUBLIC_BASE_URL environment variable is not set')
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '')

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/puppies/',
                    '/advice/the-bulldog',
                    '/advice/how-to-purchase',
                    '/advice/fraudulent-breeders',
                    '/financing/',
                    '/contact/',
                    '/privacy/',
                    '/terms/',
                    '/refund/',
                    '/policies/sales',
                    '/policies/shipping',
                    '/policies/warranty'
                ],
                disallow: [
                    '/cart/',
                    '/checkout/',
                    '/order-success/'
                ]
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl
    }
}