import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login', '/status'],
      },
    ],
    sitemap: 'https://jonnyai.co.uk/sitemap.xml',
    host: 'https://jonnyai.co.uk',
  };
}
