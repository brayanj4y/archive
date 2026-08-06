import type { Puppy } from "@/lib/types"

interface OrganizationSchemaProps {
    baseUrl: string
}

export function OrganizationSchema({ baseUrl }: OrganizationSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Country Home French Bulldogs",
        url: baseUrl,
        logo: `${baseUrl}/logo-hori.png`,
        description:
            "Premium French Bulldog breeder since 2008. Champion bloodlines, health guarantees, and family-raised puppies.",
        address: {
            "@type": "PostalAddress",
            addressLocality: "Dallas",
            addressRegion: "TX",
            addressCountry: "US",
        },
        contactPoint: {
            "@type": "ContactPoint",
            telephone: "+1-210-460-4183",
            contactType: "Customer Service",
        },
        sameAs: [
            "https://www.facebook.com/share/176W7Li8Hr/?mibextid=wwXIfr",
        ],
    }

    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

interface ProductSchemaProps {
    puppy: Puppy
    baseUrl: string
}

export function ProductSchema({ puppy, baseUrl }: ProductSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: `${puppy.name} - ${puppy.color} French Bulldog Puppy`,
        description: puppy.description,
        image: puppy.images.map((img) => (img.startsWith("http") ? img : `${baseUrl}${img}`)),
        brand: {
            "@type": "Brand",
            name: "Country Home French Bulldogs",
        },
        offers: {
            "@type": "Offer",
            price: puppy.price,
            priceCurrency: "USD",
            availability:
                puppy.status === "Available" || puppy.status === "New Arrival"
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
            url: `${baseUrl}/puppies/${puppy.id}`,
            seller: {
                "@type": "Organization",
                name: "Country Home French Bulldogs",
            },
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5",
            reviewCount: "50",
        },
    }

    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

interface BreadcrumbSchemaProps {
    items: Array<{ name: string; url: string }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    }

    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
