import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './server/routes/apiRoutes.js';
import { initDatabase } from './server/services/dbService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isVercelDeployment = process.env.VERCEL === '1' && process.env.VERCEL_ENV !== 'development';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);
  app.set('trust proxy', 1);

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  if (!isVercelDeployment) {
    app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));
  }

  // Database initialization
  await initDatabase();

  // API routes
  app.use('/api', apiRoutes);
  app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found' }));

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
}

startServer();

