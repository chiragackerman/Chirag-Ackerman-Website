import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './server/routes/apiRoutes.js';
import { initDatabase, dbService } from './server/services/dbService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isVercelDeployment = process.env.VERCEL === '1' && process.env.VERCEL_ENV !== 'development';

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.set('trust proxy', 1);
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

if (!isVercelDeployment) {
  app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));
}

// Database initialization for serverless requests
if (isVercelDeployment) {
  app.use(async (_req, _res, next) => {
    try {
      await initDatabase();
    } catch (err: any) {
      console.error('Database connection error in Vercel runtime:', err.message);
    }
    next();
  });
}

// API routes
app.use('/api', apiRoutes);
app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found' }));

// SEO endpoints: robots.txt and dynamic sitemap.xml
app.get('/robots.txt', (req, res) => {
  const host = (req.headers['x-forwarded-host'] as string) || req.get('host') || 'chiragackerman.dev';
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
  const protocol = (req.headers['x-forwarded-proto'] as string) || (isLocal ? 'http' : 'https');
  const domain = isLocal ? (process.env.SITE_URL || 'https://chiragackerman.dev') : `${protocol}://${host}`;

  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${domain}/sitemap.xml
`);
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const host = (req.headers['x-forwarded-host'] as string) || req.get('host') || 'chiragackerman.dev';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
    const protocol = (req.headers['x-forwarded-proto'] as string) || (isLocal ? 'http' : 'https');
    const domain = isLocal ? (process.env.SITE_URL || 'https://chiragackerman.dev') : `${protocol}://${host}`;

    let products: any[] = [];
    let categories: any[] = [];

    try {
      products = await dbService.getProducts({ published: true });
      categories = await dbService.getCategories();
    } catch {
      // In case database is temporarily disconnected
    }

    interface SitemapEntry {
      path: string;
      priority: string;
      changefreq: string;
      lastmod?: string;
    }

    const staticPages: SitemapEntry[] = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: '/#shop', priority: '0.9', changefreq: 'daily' },
      { path: '/#setup', priority: '0.9', changefreq: 'weekly' },
      { path: '/#categories', priority: '0.8', changefreq: 'weekly' },
      { path: '/#about', priority: '0.7', changefreq: 'monthly' },
      { path: '/#collaborate', priority: '0.7', changefreq: 'monthly' },
      { path: '/#affiliate-disclosure', priority: '0.5', changefreq: 'monthly' },
      { path: '/#privacy', priority: '0.5', changefreq: 'monthly' }
    ];

    const categoryPages: SitemapEntry[] = (categories || []).map((cat: any) => ({
      path: `/#category/${encodeURIComponent(cat.slug || cat.id)}`,
      priority: '0.8',
      changefreq: 'weekly'
    }));

    const productPages: SitemapEntry[] = (products || []).map((prod: any) => ({
      path: `/#product/${encodeURIComponent(prod.id)}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: prod.updatedAt ? new Date(prod.updatedAt).toISOString().split('T')[0] : undefined
    }));

    const allUrls: SitemapEntry[] = [...staticPages, ...categoryPages, ...productPages];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${domain}${u.path}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  } catch {
    res.status(500).send('Error generating sitemap');
  }
});

async function startServer() {
  // Initialize database in background on startup
  initDatabase().catch((err: any) => {
    console.warn('Initial MongoDB connection attempt in local dev:', err.message);
  });

  // Vite integration
  if (!isVercelDeployment && process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else if (!isVercelDeployment) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Chirag Ackerman Creator HQ running on http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${PORT} already in use. A dev server process is already active on this port.`);
    } else {
      console.error('Server listen error:', err);
    }
  });

  return server;
}

if (!isVercelDeployment) {
  startServer();
}

export { app, startServer };
export default app;

