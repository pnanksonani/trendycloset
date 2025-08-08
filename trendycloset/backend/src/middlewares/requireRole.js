// Checks req.user.role (set by requireAuth) against allowed roles.
// Usage: router.get('/admin', requireAuth, requireRole('ADMIN'), handler)

function requireRole(...allowed) {
    const ALLOWED = allowed.map(r => String(r).toUpperCase());
  
    return (req, res, next) => {
      // Must be authenticated first
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthenticated' });
      }
  
      const role = String(req.user.role || '').toUpperCase();
  
      if (!ALLOWED.includes(role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient role' });
      }
  
      next();
    };
  }
  
  module.exports = { requireRole };
  