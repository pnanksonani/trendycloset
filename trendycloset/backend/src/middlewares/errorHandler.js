// Centralized Express error handler
// Usage: app.use(errorHandler) AFTER all routes.

const { ZodError } = require('zod');

function errorHandler(err, req, res, next) {
  // Default response
  let status = err.status || 500;
  let body = { error: 'Internal Server Error' };

  // ---- Known error shapes we normalize ----

  // 1) Zod validation errors (if you ever throw them instead of safeParse)
  if (err instanceof ZodError) {
    status = 400;
    body = { error: 'Validation error', details: err.flatten() };
  }
  // 2) JWT errors
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    status = 401;
    body = { error: 'Invalid or expired token' };
  }
  // 3) Mongoose validation errors
  else if (err.name === 'ValidationError') {
    status = 400;
    body = { error: 'Validation error', details: mapMongooseErrors(err) };
  }
  // 4) Mongo duplicate key error (e.g., email unique)
  else if (err.code === 11000) {
    status = 409;
    body = { error: 'Duplicate key', key: err.keyValue };
  }
  // 5) If a controller set err.status + err.message
  else if (err.message) {
    body = { error: err.message };
  }

  // Log full error (stack) in development; sanitize in production
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    // eslint-disable-next-line no-console
    console.error('Error:', err);
    body.stack = err.stack;
  } else {
    // eslint-disable-next-line no-console
    console.error(err.message || err);
  }

  res.status(status).json(body);
}

// Helper: make Mongoose validation errors readable
function mapMongooseErrors(err) {
  const out = {};
  for (const [field, detail] of Object.entries(err.errors || {})) {
    out[field] = detail.message || 'Invalid';
  }
  return out;
}

module.exports = { errorHandler };
