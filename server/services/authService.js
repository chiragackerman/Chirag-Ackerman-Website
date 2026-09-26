import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { Admin } from '../models/Admin.js';
import { AdminSession } from '../models/AdminSession.js';

const SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;
const BCRYPT_ROUNDS = 12;

export function getAuthConfig() {
  const missing = ['ADMIN_EMAIL', 'ADMIN_PASSWORD', 'SESSION_SECRET']
    .filter((key) => !process.env[key]);

  if (missing.length > 0) {
    return { valid: false, missing };
  }

  if (process.env.ADMIN_PASSWORD.length < 10) {
    return { valid: false, missing: [], error: 'ADMIN_PASSWORD must be at least 10 characters long' };
  }

  return { valid: true };
}

export async function ensureAdminAccount() {
  const config = getAuthConfig();
  if (!config.valid) return config;

  if (mongoose.connection.readyState !== 1) {
    return { valid: false, error: 'Database is not connected to initialize admin account.' };
  }

  try {
    const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
    let existing = await Admin.findOne({ email }).select('+passwordHash');
    if (!existing) {
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, BCRYPT_ROUNDS);
      try {
        await Admin.updateOne(
          { email },
          {
            $setOnInsert: {
              email,
              name: process.env.ADMIN_NAME?.trim() || 'Site Administrator',
              passwordHash,
              role: 'superadmin',
              isActive: true
            }
          },
          { upsert: true, runValidators: true }
        );
      } catch (error) {
        if (error.code !== 11000) throw error;
      }
      existing = await Admin.findOne({ email }).select('+passwordHash');
    }

    if (!existing) {
      throw new Error('Admin account initialization did not produce an account.');
    }

    if (!existing.passwordHash) {
      existing.passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, BCRYPT_ROUNDS);
      existing.role = 'superadmin';
      existing.isActive = true;
      await existing.save();
    }
  } catch (err) {
    console.error('Admin account initialization error:', err.message);
    throw err;
  }

  return { valid: true };
}

function getSessionSecret() {
  return process.env.SESSION_SECRET;
}

function hashSessionToken(token) {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error('SESSION_SECRET is not configured.');
  }
  return crypto.createHmac('sha256', secret).update(token).digest('hex');
}

export function getSessionCookieOptions() {
  return [
    `${SESSION_COOKIE}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    process.env.NODE_ENV === 'production' || process.env.VERCEL === '1' ? 'Secure' : '',
    'Max-Age=0'
  ].filter(Boolean).join('; ');
}

export async function createAdminSession(admin) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);
  const tokenHash = hashSessionToken(token);

  await AdminSession.create({
    tokenHash,
    adminId: admin._id,
    expiresAt
  });

  const cookie = [
    `${SESSION_COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    process.env.NODE_ENV === 'production' || process.env.VERCEL === '1' ? 'Secure' : '',
    `Max-Age=${Math.floor(SESSION_MAX_AGE_MS / 1000)}`
  ].filter(Boolean).join('; ');

  return { cookie, expiresAt };
}

export function readSessionToken(req) {
  const cookies = (req.headers.cookie || '').split(';');
  const sessionCookie = cookies.find((cookie) => cookie.trim().startsWith(`${SESSION_COOKIE}=`));
  return sessionCookie ? decodeURIComponent(sessionCookie.trim().slice(SESSION_COOKIE.length + 1)) : null;
}

export async function findAdminSession(req) {
  const token = readSessionToken(req);
  if (!token) return null;

  try {
    const tokenHash = hashSessionToken(token);

    if (mongoose.connection.readyState !== 1) {
      return null;
    }

    const session = await AdminSession.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() }
    }).populate('adminId');

    if (session?.adminId?.isActive) {
      return { session, admin: session.adminId };
    }
  } catch (e) {
    console.error('Session validation error:', e.message);
  }

  return null;
}

export async function destroyAdminSession(req) {
  const token = readSessionToken(req);
  if (token && mongoose.connection.readyState === 1) {
    try {
      const tokenHash = hashSessionToken(token);
      await AdminSession.deleteOne({ tokenHash });
    } catch {
      // ignore deletion errors
    }
  }
}

export async function verifyAdminCredentials(email, password) {
  if (!email || !password) return null;
  const normalizedEmail = String(email).trim().toLowerCase();
  const inputPassword = String(password);

  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database is offline. MongoDB Atlas connection is required.');
  }

  const admin = await Admin.findOne({ email: normalizedEmail, isActive: true }).select('+passwordHash');
  if (admin && admin.passwordHash && (await bcrypt.compare(inputPassword, admin.passwordHash))) {
    return admin;
  }

  return null;
}

export function publicAdmin(admin) {
  return {
    name: admin.name,
    email: admin.email,
    role: admin.role,
    avatar: admin.avatar || null
  };
}

export { SESSION_COOKIE };
