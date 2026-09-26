import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const buildDirectory = path.join(projectRoot, 'dist');
const publicDirectory = path.join(projectRoot, 'public');
const uploadsDirectory = path.join(projectRoot, 'uploads');

if (!fs.existsSync(path.join(buildDirectory, 'index.html'))) {
  throw new Error('Vite build output is missing. Run npm run build before preparing Vercel assets.');
}

fs.rmSync(path.join(publicDirectory, 'index.html'), { force: true });
fs.rmSync(path.join(publicDirectory, 'assets'), { force: true, recursive: true });
fs.rmSync(path.join(publicDirectory, 'uploads'), { force: true, recursive: true });
fs.cpSync(buildDirectory, publicDirectory, { recursive: true, force: true });

if (fs.existsSync(uploadsDirectory)) {
  fs.cpSync(uploadsDirectory, path.join(publicDirectory, 'uploads'), { recursive: true, force: true });
}