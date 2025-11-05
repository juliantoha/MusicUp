import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://musicup.app' // Update with your actual domain

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/series',
          '/library',
          '/signup',
          '/login',
        ],
        disallow: [
          '/performer/',
          '/admin/',
          '/super/',
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
