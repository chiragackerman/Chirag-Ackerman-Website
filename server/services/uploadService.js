import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root uploads directory for server storage (never inside src/assets or frontend code)
const uploadsDir = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
  );
}

// Initialize Cloudinary if credentials are provided in environment
if (isCloudinaryConfigured()) {
  if (process.env.CLOUDINARY_URL) {
    // cloudinary automatically uses CLOUDINARY_URL
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
  }
}

/**
 * Uploads an image either to Cloudinary (if configured) or to server storage.
 * Supported formats: JPG, JPEG, PNG, WEBP.
 * 
 * @param {Object} params
 * @param {string} params.dataUrl - Base64 data URL ('data:image/...;base64,...')
 * @param {string} params.fileName - Original file name
 * @param {string} [params.mimeType] - MIME type
 * @returns {Promise<{ url: string, provider: string, fileName?: string }>}
 */
export async function uploadImage({ dataUrl, fileName, mimeType }) {
  if (!dataUrl || typeof dataUrl !== 'string') {
    throw new Error('No image data provided for upload.');
  }

  // Validate MIME type
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const extractedMime = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-+.]+);base64,/)?.[1]?.toLowerCase() || mimeType?.toLowerCase();

  if (!extractedMime || !allowedMimeTypes.includes(extractedMime)) {
    throw new Error('Unsupported image format. Supported formats: JPG, JPEG, PNG, WEBP.');
  }

  // 1. Try Cloudinary if configured
  if (isCloudinaryConfigured()) {
    try {
      const uploadResult = await cloudinary.uploader.upload(dataUrl, {
        folder: 'chirag_ackerman_gear',
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
      });

      return {
        url: uploadResult.secure_url,
        provider: 'cloudinary',
        publicId: uploadResult.public_id,
        format: uploadResult.format
      };
    } catch (cldErr) {
      console.warn('Cloudinary upload returned an error; falling back to secure server storage:', cldErr.message);
    }
  }

  // 2. Server-side storage fallback (stored in /uploads, served via /uploads/*)
  const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Malformed base64 image data payload.');
  }

  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  // Max 10MB check
  if (buffer.length > 10 * 1024 * 1024) {
    throw new Error('File size exceeds the 10MB limit.');
  }

  const ext = extractedMime.includes('webp')
    ? 'webp'
    : extractedMime.includes('png')
    ? 'png'
    : 'jpg';

  const baseName = (fileName || 'product')
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9_-]/g, '-');

  const safeFileName = `${baseName}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}.${ext}`;
  const targetPath = path.join(uploadsDir, safeFileName);

  await fs.promises.writeFile(targetPath, buffer);

  const hostedUrl = `/uploads/${safeFileName}`;

  return {
    url: hostedUrl,
    provider: 'server_storage',
    fileName: safeFileName
  };
}
