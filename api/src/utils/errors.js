'use strict';

const ERRORS = {
  UNAUTHORIZED:     { status: 401, code: 'unauthorized',      message: 'Missing or invalid API key.' },
  FORBIDDEN:        { status: 403, code: 'forbidden',         message: 'Access denied.' },
  QUOTA_EXCEEDED:   { status: 429, code: 'quota_exceeded',    message: 'Monthly document quota exceeded. Upgrade your plan at https://renderly.dev/dashboard.' },
  RATE_LIMITED:     { status: 429, code: 'rate_limited',      message: 'Too many requests. Slow down.' },
  INVALID_INPUT:    { status: 400, code: 'invalid_input',     message: 'Request body is missing required fields.' },
  HTML_TOO_LARGE:   { status: 400, code: 'html_too_large',    message: 'HTML payload exceeds the size limit for your plan.' },
  RENDER_FAILED:    { status: 500, code: 'render_failed',     message: 'PDF generation failed. Please try again.' },
  NOT_FOUND:        { status: 404, code: 'not_found',         message: 'Resource not found.' },
  INTERNAL:         { status: 500, code: 'internal_error',    message: 'An unexpected error occurred.' },
};

function apiError(reply, type, extra = {}) {
  const err = ERRORS[type] ?? ERRORS.INTERNAL;
  return reply.status(err.status).send({
    error: { code: err.code, message: extra.message ?? err.message },
  });
}

module.exports = { apiError, ERRORS };
