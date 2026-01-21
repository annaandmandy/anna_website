
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, 'public');
const BLOGS_FILE = path.join(PUBLIC_DIR, 'blogs.json');
const SITEMAP_FILE = path.join(PUBLIC_DIR, 'sitemap.xml');
const BASE_URL = 'https://www.hsiangyuhuang.com';

const staticRoutes = [
    '/',
    '/about',
    '/projects',
    '/hire-me',
    '/interests',
    '/weekend_report',
    '/blogs'
];

async function generateSitemap() {
    try {
        const blogsData = JSON.parse(fs.readFileSync(BLOGS_FILE, 'utf8'));

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Add static routes
        staticRoutes.forEach(route => {
            sitemap += `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
    <changefreq>weekly</changefreq>
  </url>`;
        });

        // Add dynamic blog routes
        blogsData.forEach(blog => {
            if (blog.slug) {
                // Determine priority and frequency based on date or importance if needed
                sitemap += `
  <url>
    <loc>${BASE_URL}/blogs/${blog.slug}</loc>
    <priority>0.8</priority>
    <changefreq>${blog.date ? 'monthly' : 'weekly'}</changefreq>
    <lastmod>${blog.date || new Date().toISOString().split('T')[0]}</lastmod>
  </url>`;
            }
        });

        sitemap += `
</urlset>`;

        fs.writeFileSync(SITEMAP_FILE, sitemap);
        console.log('Sitemap generated successfully!');
    } catch (error) {
        console.error('Error generating sitemap:', error);
    }
}

generateSitemap();
