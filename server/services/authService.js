import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
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

  const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
  const existing = await Admin.findOne({ email }).select('+passwordHash');
  if (!existing) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, BCRYPT_ROUNDS);
    await Admin.create({
      email,
      name: process.env.ADMIN_NAME?.trim() || 'Site Administrator',
      passwordHash,
      role: 'superadmin',
      isActive: true
    });
  } else if (!existing.passwordHash) {
    existing.passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, BCRYPT_ROUNDS);
    existing.role = 'superadmin';
    existing.isActive = true;
    await existing.save();
  }

  return { valid: true };
}

function hashSessionToken(token) {
  return crypto.createHmac('sha256', process.env.SESSION_SECRET).update(token).digest('hex');
}

export function getSessionCookieOptions() {
  return [
    `${SESSION_COOKIE}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    process.env.NODE_ENV === 'production' ? 'Secure' : '',
    'Max-Age=0'
  ].filter(Boolean).join('; ');
}

export async function createAdminSession(admin) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);
  await AdminSession.create({
    tokenHash: hashSessionToken(token),
    adminId: admin._id,
    expiresAt
  });

  const cookie = [
    `${SESSION_COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    process.env.NODE_ENV === 'production' ? 'Secure' : '',
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

  const session = await AdminSession.findOne({
    tokenHash: hashSessionToken(token),
    expiresAt: { $gt: new Date() }
  }).populate('adminId');

  if (!session?.adminId?.isActive) return null;
  return { session, admin: session.adminId };
}

export async function destroyAdminSession(req) {
  const token = readSessionToken(req);
  if (token) await AdminSession.deleteOne({ tokenHash: hashSessionToken(token) });
}

export async function verifyAdminCredentials(email, password) {
  if (!email || !password) return null;
  const admin = await Admin.findOne({ email: String(email).trim().toLowerCase(), isActive: true }).select('+passwordHash');
  if (!admin || !(await bcrypt.compare(String(password), admin.passwordHash))) return null;
  return admin;
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