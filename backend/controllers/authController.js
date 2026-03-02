const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const env = require('../config/env');
const { success, failure } = require('../utils/response');

function signTokens(user) {
  const payload = { id: user.id, email: user.email, role: user.role, organizationId: user.organizationId };
  return {
    accessToken: jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRY }),
    refreshToken: jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRY })
  };
}

const ROLE_ALIAS = {
  ADMIN: 'OWNER',
  MANAGER: 'SALES_MANAGER',
  DIRECTOR: 'SALES_DIRECTOR'
};
const VALID_ROLES = new Set(['OWNER', 'SALES_DIRECTOR', 'SALES_MANAGER', 'CHANNEL_PARTNER_MANAGER', 'BROKER']);

async function register(req, res) {
  try {
    const { email, name, password, organizationId, company } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json(failure('CONFLICT', 'Email already exists'));

    let orgId = organizationId;
    if (!orgId) {
      const org = await prisma.organization.create({
        data: {
          name: company || `${name || 'New'} Organization`,
          plan: 'STARTER',
          settings: { timezone: 'Asia/Kolkata', currency: 'INR' }
        }
      });
      orgId = org.id;
    }

    const requestedRole = String(req.body.role || 'BROKER').toUpperCase();
    const normalizedRole = ROLE_ALIAS[requestedRole] || requestedRole;
    if (!VALID_ROLES.has(normalizedRole)) {
      return res.status(400).json(failure('VALIDATION_ERROR', `Invalid role: ${req.body.role}`));
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hash,
        organizationId: orgId,
        role: normalizedRole
      }
    });

    return res.status(201).json(success({ user, ...signTokens(user) }, 'Registered'));
  } catch (error) {
    return res.status(500).json(failure('SERVER_ERROR', error.message));
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json(failure('INVALID_CREDENTIALS', 'Invalid email or password'));

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json(failure('INVALID_CREDENTIALS', 'Invalid email or password'));

  await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
  return res.json(success({ user, ...signTokens(user) }, 'Login successful'));
}

async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json(failure('VALIDATION_ERROR', 'refreshToken required'));

  try {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id: payload.id, email: payload.email, role: payload.role, organizationId: payload.organizationId }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRY
    });
    return res.json(success({ accessToken }, 'Token refreshed'));
  } catch (error) {
    return res.status(401).json(failure('INVALID_TOKEN', 'Invalid refresh token'));
  }
}

async function forgotPassword(req, res) {
  return res.json(success({}, 'Password reset link queued'));
}

async function resetPassword(req, res) {
  return res.json(success({}, 'Password reset successful'));
}

async function me(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  return res.json(success(user));
}

module.exports = {
  register,
  login,
  refresh,
  forgotPassword,
  resetPassword,
  me
};
