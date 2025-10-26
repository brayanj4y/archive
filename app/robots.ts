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
                allow: '/',
                disallow: [
                    '/policies/',
                    '/privacy/',
                    '/terms/',
                    '/refund/',
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