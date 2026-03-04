const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWTSECRET;

/**
 * Get token from request (cookie or Authorization header).
 * @returns {string|null}
 */
function getToken(req) {
  const fromCookie = req.cookies?.token;
  const fromHeader = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;
  return fromCookie ?? fromHeader ?? null;
}

/**
 * Verify token and return decoded user or null. Single place for auth logic.
 * @returns {{ user: object } | { user: null, status: number, message: string }}
 */
function getUserFromRequest(req) {
  const token = getToken(req);
  if (!token) return { user: null, status: 401, message: 'Access denied' };

  try {
    const decoded = jwt.verify(token, jwtSecret);
    return { user: decoded };
  } catch (err) {
    return { user: null, status: 403, message: 'Invalid or expired token' };
  }
}

/** Express middleware: set req.user and call next(), or send 401/403. */
function authenticate(req, res, next) {
  const result = getUserFromRequest(req);
  if (result.user) {
    req.user = result.user;
    next();
  } else {
    res.status(result.status).json({ error: result.message });
  }
}

module.exports = {
  getToken,
  getUserFromRequest,
  authenticate,
};
