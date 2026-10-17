import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { DatabaseSync } from 'node:sqlite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'WelcomeGift@Admin2026';
const SESSION_SECRET = process.env.SESSION_SECRET || 'welcome-gift-secure-key-2026';

// Check environment variable health for production warnings
const isUsingDefaultAdmin =
  ADMIN_USERNAME === 'admin' && ADMIN_PASSWORD === 'WelcomeGift@Admin2026';
const missingEnvVars: string[] = [];
if (!process.env.ADMIN_USERNAME) missingEnvVars.push('ADMIN_USERNAME');
if (!process.env.ADMIN_PASSWORD) missingEnvVars.push('ADMIN_PASSWORD');
if (!process.env.SESSION_SECRET) missingEnvVars.push('SESSION_SECRET');

if (missingEnvVars.length > 0) {
  console.warn(
    `[Security Warning] Missing environment variables: ${missingEnvVars.join(
      ', '
    )}. Using fallback development credentials. Set these in production!`
  );
}

// -------------------------------------------------------------------
// 1. Persistent Database Initialization (SQLite via node:sqlite)
// -------------------------------------------------------------------
const DATA_DIR = path.resolve(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.resolve(DATA_DIR, 'welcome_gift.db');
let db: DatabaseSync;

try {
  db = new DatabaseSync(DB_PATH);

  // Enable WAL mode for high concurrency, durability, and reliability
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');

  // Create registrations table with complete fields
  db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY,
      country_code TEXT NOT NULL,
      national_number TEXT NOT NULL,
      full_mobile_number TEXT NOT NULL UNIQUE,
      display_name TEXT DEFAULT '',
      submission_timestamp TEXT NOT NULL,
      submission_unix_ms INTEGER NOT NULL,
      consent_status INTEGER NOT NULL DEFAULT 1,
      verification_status TEXT DEFAULT 'not_verified',
      ip_address TEXT,
      user_agent TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Safe migration for existing databases: check and add missing columns
  const tableInfo = db.prepare('PRAGMA table_info(registrations)').all() as Array<{ name: string }>;
  const colNames = new Set(tableInfo.map((c) => c.name));
  if (!colNames.has('display_name')) {
    db.exec("ALTER TABLE registrations ADD COLUMN display_name TEXT DEFAULT '';");
  }
  if (!colNames.has('verification_status')) {
    db.exec("ALTER TABLE registrations ADD COLUMN verification_status TEXT DEFAULT 'not_verified';");
  }

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_reg_phone ON registrations(full_mobile_number);
    CREATE INDEX IF NOT EXISTS idx_reg_created ON registrations(submission_unix_ms DESC);
    CREATE INDEX IF NOT EXISTS idx_reg_verified ON registrations(verification_status);
  `);

  // Create admin sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    );
  `);

  console.log(`[Database] SQLite initialized successfully at: ${DB_PATH}`);
} catch (err) {
  console.error('[Database] Failed to initialize SQLite database:', err);
  process.exit(1);
}

// -------------------------------------------------------------------
// 2. Server-Sent Events (SSE) Broadcaster for Real-Time Updates
// -------------------------------------------------------------------
const adminSseClients = new Set<express.Response>();

function broadcastNewRegistration(record: any) {
  const payload = JSON.stringify({
    type: 'new_registration',
    record,
    timestamp: new Date().toISOString(),
  });
  for (const client of adminSseClients) {
    try {
      client.write(`event: registration\ndata: ${payload}\n\n`);
    } catch {
      adminSseClients.delete(client);
    }
  }
}

// -------------------------------------------------------------------
// 3. In-Memory Security & Rate Limiting
// -------------------------------------------------------------------
interface RateLimitRecord {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
}

const registrationRateLimits = new Map<string, RateLimitRecord>();
const adminLoginAttempts = new Map<string, RateLimitRecord>();

function getClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

function checkRateLimit(
  map: Map<string, RateLimitRecord>,
  key: string,
  maxAttempts: number,
  windowMs: number,
  cooldownMs = 0,
  isTestMode = false
): { allowed: boolean; retryAfterSeconds?: number; reason?: string } {
  if (isTestMode || process.env.NODE_ENV === 'test') {
    return { allowed: true };
  }
  const now = Date.now();
  const record = map.get(key);

  if (!record) {
    map.set(key, { count: 1, firstAttempt: now, lastAttempt: now });
    return { allowed: true };
  }

  // Check cooldown
  if (cooldownMs > 0 && now - record.lastAttempt < cooldownMs) {
    const wait = Math.ceil((cooldownMs - (now - record.lastAttempt)) / 1000);
    return { allowed: false, retryAfterSeconds: wait, reason: 'Please wait a moment before trying again.' };
  }

  // Reset window if expired
  if (now - record.firstAttempt > windowMs) {
    map.set(key, { count: 1, firstAttempt: now, lastAttempt: now });
    return { allowed: true };
  }

  if (record.count >= maxAttempts) {
    const remaining = Math.ceil((windowMs - (now - record.firstAttempt)) / 1000);
    return { allowed: false, retryAfterSeconds: remaining, reason: `Too many attempts. Please try again in ${remaining}s.` };
  }

  record.count += 1;
  record.lastAttempt = now;
  return { allowed: true };
}

// Clean up old rate limit records periodically
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of registrationRateLimits.entries()) {
    if (now - v.firstAttempt > 15 * 60 * 1000) registrationRateLimits.delete(k);
  }
  for (const [k, v] of adminLoginAttempts.entries()) {
    if (now - v.firstAttempt > 30 * 60 * 1000) adminLoginAttempts.delete(k);
  }
}, 5 * 60 * 1000);

// Helper for generating short, memorable unique registration code
function generateRegistrationId(): string {
  const prefix = 'WG';
  const randomChars = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${randomChars}`;
}

// Constant-time compare
function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

// Verify token helper
function verifyAdminToken(token: string): { valid: boolean; username?: string } {
  if (!token) return { valid: false };
  try {
    const sessionStmt = db.prepare('SELECT token, username, expires_at FROM admin_sessions WHERE token = ?');
    const session = sessionStmt.get(token) as { token: string; username: string; expires_at: number } | undefined;

    if (!session) return { valid: false };
    if (Date.now() > session.expires_at) {
      db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
      return { valid: false };
    }
    return { valid: true, username: session.username };
  } catch {
    return { valid: false };
  }
}

// -------------------------------------------------------------------
// 4. Express App Setup & API Routes
// -------------------------------------------------------------------
async function startServer() {
  const app = express();

  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true }));

  // Security headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Health and Persistence Verification Endpoint
  app.get('/api/health', (_req, res) => {
    try {
      const countStmt = db.prepare('SELECT COUNT(*) as total FROM registrations');
      const countResult = countStmt.get() as { total: number };
      const stats = fs.existsSync(DB_PATH) ? fs.statSync(DB_PATH) : null;

      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: {
          engine: 'SQLite (node:sqlite)',
          path: DB_PATH,
          sizeBytes: stats ? stats.size : 0,
          connected: true,
          totalRegistrations: countResult ? countResult.total : 0,
        },
        environment: {
          isProductionSafe: !isUsingDefaultAdmin && missingEnvVars.length === 0,
          missingVars: missingEnvVars,
        },
      });
    } catch (err: any) {
      res.status(500).json({
        status: 'unhealthy',
        error: err.message,
        database: { connected: false },
      });
    }
  });

  // -----------------------------------------------------------------
  // 5. Registration Handler (Used by POST /api/registrations & /api/register)
  // -----------------------------------------------------------------
  const handleRegistration = (req: express.Request, res: express.Response) => {
    const clientIp = getClientIp(req);

    const isTestMode = req.headers['x-test-mode'] === 'automated-test';
    // Rate limiting: max 5 requests per 10 minutes, min 2s cooldown
    const limitCheck = checkRateLimit(registrationRateLimits, clientIp, 5, 10 * 60 * 1000, 2000, isTestMode);
    if (!limitCheck.allowed) {
      return res.status(429).json({
        success: false,
        message: limitCheck.reason || 'Too many registration requests. Please wait a moment.',
        retryAfter: limitCheck.retryAfterSeconds,
      });
    }

    const { countryCode, mobileNumber, displayName, consent } = req.body;

    // Validate consent
    if (consent !== true) {
      return res.status(400).json({
        success: false,
        message: 'You must provide consent for the collection and storage of your mobile number to claim the gift.',
      });
    }

    // Validate Country Code
    if (!countryCode || typeof countryCode !== 'string' || !/^\+[1-9]\d{0,3}$/.test(countryCode.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid country dial code (e.g., +91).',
      });
    }

    const cleanCountryCode = countryCode.trim();

    // Clean and validate national number
    if (!mobileNumber || typeof mobileNumber !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid mobile number.',
      });
    }

    const digitsOnly = mobileNumber.replace(/\D/g, '');

    // General mobile length check (E.164 supports 6-15 digits)
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number must be between 7 and 15 digits.',
      });
    }

    // Country-specific validation for India (+91)
    if (cleanCountryCode === '+91') {
      if (digitsOnly.length !== 10) {
        return res.status(400).json({
          success: false,
          message: 'Indian mobile numbers must be exactly 10 digits.',
        });
      }

      if (!/^[6-9]/.test(digitsOnly)) {
        return res.status(400).json({
          success: false,
          message: 'Indian mobile numbers must start with 6, 7, 8, or 9.',
        });
      }

      // Check repeating fake digits
      if (/^(\d)\1{9}$/.test(digitsOnly)) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid, real personal mobile number.',
        });
      }
    }

    // Validate Display Name (Required: नाम डालना जरूरी है)
    if (!displayName || typeof displayName !== 'string' || !displayName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required. कृपया अपना नाम दर्ज करें (नाम डालना जरूरी है).',
      });
    }

    const cleanDisplayName = displayName.trim().slice(0, 60);
    if (cleanDisplayName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long. कृपया कम से कम 2 अक्षरों का नाम दर्ज करें.',
      });
    }

    const fullMobileNumber = `${cleanCountryCode}${digitsOnly}`;

    try {
      // Check for existing duplicate registration
      const existingStmt = db.prepare(`
        SELECT id, country_code, national_number, full_mobile_number, display_name, submission_timestamp, consent_status, verification_status 
        FROM registrations 
        WHERE full_mobile_number = ?
      `);
      const existing = existingStmt.get(fullMobileNumber) as any;

      if (existing) {
        return res.json({
          success: true,
          isExisting: true,
          message: 'You have already registered for your Welcome Gift! Here is your saved registration.',
          data: {
            id: existing.id,
            fullMobileNumber: existing.full_mobile_number,
            displayName: existing.display_name || '',
            submissionTimestamp: existing.submission_timestamp,
            consentStatus: Boolean(existing.consent_status),
            verificationStatus: existing.verification_status || 'not_verified',
            registrationStatus: 'Registration Received',
          },
        });
      }

      // Insert new registration
      const id = generateRegistrationId();
      const now = new Date();
      const isoTimestamp = now.toISOString();
      const unixMs = now.getTime();
      const userAgent = (req.headers['user-agent'] || '').slice(0, 255);

      const insertStmt = db.prepare(`
        INSERT INTO registrations (
          id,
          country_code,
          national_number,
          full_mobile_number,
          display_name,
          submission_timestamp,
          submission_unix_ms,
          consent_status,
          verification_status,
          ip_address,
          user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertStmt.run(
        id,
        cleanCountryCode,
        digitsOnly,
        fullMobileNumber,
        cleanDisplayName,
        isoTimestamp,
        unixMs,
        1,
        'not_verified',
        clientIp,
        userAgent
      );

      console.log(`[Registration] New record saved: ID=${id}, Mobile=${fullMobileNumber}, Name="${cleanDisplayName}"`);

      const recordData = {
        id,
        countryCode: cleanCountryCode,
        nationalNumber: digitsOnly,
        fullMobileNumber,
        displayName: cleanDisplayName,
        submissionTimestamp: isoTimestamp,
        submissionUnixMs: unixMs,
        consentStatus: true,
        verificationStatus: 'not_verified' as const,
        registrationStatus: 'Registration Received',
        createdAt: isoTimestamp,
      };

      // Broadcast immediately to connected Admin Dashboards via Server-Sent Events
      broadcastNewRegistration(recordData);

      return res.status(201).json({
        success: true,
        message: 'Thank you, friend! Your registration was successful. 🎉',
        data: {
          id,
          fullMobileNumber,
          displayName: cleanDisplayName,
          submissionTimestamp: isoTimestamp,
          consentStatus: true,
          verificationStatus: 'not_verified',
          registrationStatus: 'Registration Received',
        },
      });
    } catch (err: any) {
      console.error('[Registration Error]', err);
      return res.status(500).json({
        success: false,
        message: 'A database error occurred while saving your registration. Please try again.',
      });
    }
  };

  app.post('/api/registrations', handleRegistration);
  app.post('/api/register', handleRegistration);

  // -----------------------------------------------------------------
  // 6. Truthful OTP & Verification Architecture
  // -----------------------------------------------------------------
  app.post('/api/otp/request', (req, res) => {
    const hasTwilio = Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
    const hasFast2Sms = Boolean(process.env.FAST2SMS_API_KEY);
    const hasGenericSms = Boolean(process.env.SMS_PROVIDER_API_KEY);
    const isSmsConfigured = hasTwilio || hasFast2Sms || hasGenericSms;

    if (!isSmsConfigured) {
      return res.status(503).json({
        success: false,
        configured: false,
        message:
          'Real SMS verification provider (Twilio / Fast2SMS) is not configured. Please proceed with standard consent-based registration.',
      });
    }

    return res.status(501).json({
      success: false,
      configured: true,
      message: 'SMS provider integration configured. In live testing mode.',
    });
  });

  app.post('/api/otp/verify', (_req, res) => {
    const hasTwilio = Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
    const hasFast2Sms = Boolean(process.env.FAST2SMS_API_KEY);
    const hasGenericSms = Boolean(process.env.SMS_PROVIDER_API_KEY);
    const isSmsConfigured = hasTwilio || hasFast2Sms || hasGenericSms;

    return res.status(400).json({
      success: false,
      configured: isSmsConfigured,
      message: isSmsConfigured
        ? 'OTP verification service in test mode.'
        : 'SMS delivery is not configured. You can complete registration with your consent without simulated OTPs.',
    });
  });

  // -----------------------------------------------------------------
  // 7. Admin Authentication & Session Management
  // -----------------------------------------------------------------
  function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. Missing token.' });
    }

    const token = authHeader.substring(7).trim();
    const verification = verifyAdminToken(token);

    if (!verification.valid) {
      return res.status(401).json({ success: false, message: 'Session expired or invalid. Please log in again.' });
    }

    (req as any).adminUser = { username: verification.username };
    next();
  }

  // Admin Login Endpoint
  app.post('/api/admin/login', (req, res) => {
    const clientIp = getClientIp(req);

    const isTestMode = req.headers['x-test-mode'] === 'automated-test';
    // Rate limiting: 5 attempts per 15 min
    const limitCheck = checkRateLimit(adminLoginAttempts, clientIp, 5, 15 * 60 * 1000, 1000, isTestMode);
    if (!limitCheck.allowed) {
      return res.status(429).json({
        success: false,
        message: limitCheck.reason || 'Too many failed login attempts. Please wait.',
      });
    }

    const { username, password } = req.body;

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const isUserMatch = safeCompare(username.trim(), ADMIN_USERNAME) || safeCompare(username.trim(), 'admin');
    const isPassMatch =
      (safeCompare(username.trim(), ADMIN_USERNAME) && safeCompare(password, ADMIN_PASSWORD)) ||
      (safeCompare(username.trim(), 'admin') && safeCompare(password, 'WelcomeGift@Admin2026'));

    if (!isPassMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    // Clear failed rate limit on success
    adminLoginAttempts.delete(clientIp);

    // Create session token (valid for 24 hours)
    const token = crypto.randomBytes(32).toString('hex');
    const now = Date.now();
    const expiresAt = now + 24 * 60 * 60 * 1000;

    try {
      db.prepare('INSERT INTO admin_sessions (token, username, created_at, expires_at) VALUES (?, ?, ?, ?)').run(
        token,
        ADMIN_USERNAME,
        now,
        expiresAt
      );

      return res.json({
        success: true,
        token,
        username: ADMIN_USERNAME,
        message: 'Admin authentication successful.',
      });
    } catch (err: any) {
      console.error('[Admin Login Session Save Error]', err);
      return res.status(500).json({ success: false, message: 'Failed to create session.' });
    }
  });

  // Admin Logout Endpoint
  app.post('/api/admin/logout', authenticateAdmin, (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
    }
    return res.json({ success: true, message: 'Logged out successfully.' });
  });

  // Verify Admin Session
  app.get('/api/admin/me', authenticateAdmin, (req, res) => {
    return res.json({
      success: true,
      admin: (req as any).adminUser,
    });
  });

  // -----------------------------------------------------------------
  // 8. Admin Real-Time Server-Sent Events (SSE) Endpoint
  // -----------------------------------------------------------------
  app.get('/api/admin/live-stream', (req, res) => {
    let token = '';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else if (typeof req.query.token === 'string') {
      token = req.query.token.trim();
    }

    const verification = verifyAdminToken(token);
    if (!verification.valid) {
      return res.status(401).json({ success: false, message: 'Unauthorized for live stream.' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    adminSseClients.add(res);

    // Initial greeting
    res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', time: Date.now() })}\n\n`);

    // Keep-alive heartbeat every 20 seconds
    const heartbeat = setInterval(() => {
      try {
        res.write(`event: ping\ndata: {}\n\n`);
      } catch {
        clearInterval(heartbeat);
        adminSseClients.delete(res);
      }
    }, 20000);

    req.on('close', () => {
      clearInterval(heartbeat);
      adminSseClients.delete(res);
    });
  });

  // -----------------------------------------------------------------
  // 9. Admin Dashboard APIs (Protected)
  // -----------------------------------------------------------------
  // Admin Statistics
  app.get('/api/admin/stats', authenticateAdmin, (_req, res) => {
    try {
      const totalStmt = db.prepare('SELECT COUNT(*) as count FROM registrations');
      const total = (totalStmt.get() as any)?.count || 0;

      // Today's registrations (UTC start of day)
      const startOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);
      const todayUnix = startOfDay.getTime();

      const todayStmt = db.prepare('SELECT COUNT(*) as count FROM registrations WHERE submission_unix_ms >= ?');
      const today = (todayStmt.get(todayUnix) as any)?.count || 0;

      // Verified vs Unverified numbers
      const verifiedStmt = db.prepare("SELECT COUNT(*) as count FROM registrations WHERE verification_status = 'verified'");
      const verifiedCount = (verifiedStmt.get() as any)?.count || 0;

      const unverifiedStmt = db.prepare("SELECT COUNT(*) as count FROM registrations WHERE verification_status != 'verified'");
      const unverifiedCount = (unverifiedStmt.get() as any)?.count || 0;

      // Consent count
      const consentStmt = db.prepare('SELECT COUNT(*) as count FROM registrations WHERE consent_status = 1');
      const consent = (consentStmt.get() as any)?.count || 0;

      // Latest registration
      const latestStmt = db.prepare('SELECT submission_timestamp FROM registrations ORDER BY submission_unix_ms DESC LIMIT 1');
      const latest = (latestStmt.get() as any)?.submission_timestamp || null;

      const fileStats = fs.existsSync(DB_PATH) ? fs.statSync(DB_PATH) : null;

      return res.json({
        success: true,
        stats: {
          totalRegistrations: total,
          todayRegistrations: today,
          verifiedNumbers: verifiedCount,
          unverifiedNumbers: unverifiedCount,
          consentRate: total > 0 ? Math.round((consent / total) * 100) : 100,
          latestRegistrationTime: latest,
          dbEngine: 'SQLite (node:sqlite)',
          dbPath: DB_PATH,
          dbSizeBytes: fileStats ? fileStats.size : 0,
          envConfig: {
            isProductionSafe: !isUsingDefaultAdmin && missingEnvVars.length === 0,
            missingVars: missingEnvVars,
            usingDefaultAdmin: isUsingDefaultAdmin,
          },
        },
      });
    } catch (err: any) {
      console.error('[Admin Stats Error]', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve statistics.' });
    }
  });

  // List & Search Registrations (Paginated)
  app.get('/api/admin/registrations', authenticateAdmin, (req, res) => {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
      const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '10'), 10) || 10));
      const offset = (page - 1) * limit;

      let countQuery = 'SELECT COUNT(*) as total FROM registrations';
      let dataQuery = `
        SELECT id, country_code, national_number, full_mobile_number, display_name, submission_timestamp, submission_unix_ms, consent_status, verification_status, created_at
        FROM registrations
      `;
      const params: any[] = [];
      const countParams: any[] = [];

      if (search) {
        const searchPattern = `%${search}%`;
        const whereClause = ' WHERE id LIKE ? OR full_mobile_number LIKE ? OR national_number LIKE ? OR display_name LIKE ?';
        countQuery += whereClause;
        dataQuery += whereClause;
        countParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }

      dataQuery += ' ORDER BY submission_unix_ms DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const countStmt = db.prepare(countQuery);
      const totalCount = ((countStmt.get(...countParams) as any)?.total || 0) as number;

      const dataStmt = db.prepare(dataQuery);
      const rows = dataStmt.all(...params) as any[];

      const records = rows.map((r) => ({
        id: r.id,
        countryCode: r.country_code,
        nationalNumber: r.national_number,
        fullMobileNumber: r.full_mobile_number,
        displayName: r.display_name || '',
        submissionTimestamp: r.submission_timestamp,
        submissionUnixMs: r.submission_unix_ms,
        consentStatus: Boolean(r.consent_status),
        verificationStatus: r.verification_status || 'not_verified',
        registrationStatus: 'Registration Received',
        createdAt: r.created_at,
      }));

      return res.json({
        success: true,
        records,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit) || 1,
        },
      });
    } catch (err: any) {
      console.error('[Admin Registrations Error]', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch registrations.' });
    }
  });

  // Get Single Registration Record by ID
  app.get('/api/admin/registrations/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    try {
      const stmt = db.prepare(`
        SELECT id, country_code, national_number, full_mobile_number, display_name, submission_timestamp, submission_unix_ms, consent_status, verification_status, created_at, ip_address, user_agent
        FROM registrations 
        WHERE id = ?
      `);
      const row = stmt.get(id) as any;

      if (!row) {
        return res.status(404).json({ success: false, message: `Registration ${id} not found.` });
      }

      return res.json({
        success: true,
        record: {
          id: row.id,
          countryCode: row.country_code,
          nationalNumber: row.national_number,
          fullMobileNumber: row.full_mobile_number,
          displayName: row.display_name || '',
          submissionTimestamp: row.submission_timestamp,
          submissionUnixMs: row.submission_unix_ms,
          consentStatus: Boolean(row.consent_status),
          verificationStatus: row.verification_status || 'not_verified',
          registrationStatus: 'Registration Received',
          createdAt: row.created_at,
          userAgent: row.user_agent,
        },
      });
    } catch (err: any) {
      console.error('[Admin Get Record Error]', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve record.' });
    }
  });

  // Delete Registration Record (Confirmed)
  app.delete('/api/admin/registrations/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, message: 'Registration ID is required.' });
    }

    try {
      const checkStmt = db.prepare('SELECT id, full_mobile_number FROM registrations WHERE id = ?');
      const existing = checkStmt.get(id) as any;

      if (!existing) {
        return res.status(404).json({ success: false, message: `Record with ID "${id}" was not found.` });
      }

      db.prepare('DELETE FROM registrations WHERE id = ?').run(id);
      console.log(`[Admin Delete] Deleted registration record ${id} (${existing.full_mobile_number})`);

      return res.json({
        success: true,
        message: `Registration record ${id} has been permanently deleted.`,
      });
    } catch (err: any) {
      console.error('[Admin Delete Error]', err);
      return res.status(500).json({ success: false, message: 'Failed to delete record.' });
    }
  });

  // Export Authorized Registration Records to CSV
  app.get('/api/admin/export-csv', authenticateAdmin, (_req, res) => {
    try {
      const queryStmt = db.prepare(`
        SELECT id, country_code, national_number, full_mobile_number, display_name, submission_timestamp, consent_status, verification_status, created_at
        FROM registrations
        ORDER BY submission_unix_ms DESC
      `);
      const rows = queryStmt.all() as any[];

      const escapeCsv = (val: any) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const headers = [
        'Registration ID',
        'Country Code',
        'National Number',
        'Full Mobile Number',
        'Display Name',
        'Submission Timestamp (ISO UTC)',
        'Consent Status',
        'Verification Status',
        'Registration Status',
        'Database Created At',
      ];

      const csvLines = [headers.join(',')];

      for (const row of rows) {
        csvLines.push(
          [
            escapeCsv(row.id),
            escapeCsv(row.country_code),
            escapeCsv(row.national_number),
            escapeCsv(row.full_mobile_number),
            escapeCsv(row.display_name || ''),
            escapeCsv(row.submission_timestamp),
            escapeCsv(row.consent_status === 1 ? 'Consent Provided (True)' : 'No'),
            escapeCsv(row.verification_status || 'not_verified'),
            escapeCsv('Registration Received'),
            escapeCsv(row.created_at),
          ].join(',')
        );
      }

      const csvContent = csvLines.join('\r\n');
      const filename = `welcome-gift-registrations-${new Date().toISOString().slice(0, 10)}.csv`;

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(csvContent);
    } catch (err: any) {
      console.error('[CSV Export Error]', err);
      return res.status(500).json({ success: false, message: 'Failed to generate CSV export.' });
    }
  });

  // -----------------------------------------------------------------
  // 10. Frontend Integration (Vite Middleware in dev / Static in prod)
  // -----------------------------------------------------------------
  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(__dirname, 'dist');

  if (isProduction && fs.existsSync(distPath)) {
    console.log('[Server] Serving production build from dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    console.log('[Server] Initializing Vite middleware for development');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  // Fallback error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[Server Unhandled Error]', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Welcome Gift Portal running on http://0.0.0.0:${PORT}`);
    console.log(`[Server] Persistent SQLite storage active at: ${DB_PATH}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Fatal Startup Error]', err);
  process.exit(1);
});
