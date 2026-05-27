'use strict';

const { requireApiKey }  = require('../middleware/auth');
const { renderHTML, renderURL } = require('../services/renderer');
const { hasQuota, incrementUsage, getPlanLimits } = require('../services/metering');
const { apiError } = require('../utils/errors');

const MB = 1024 * 1024;

async function pdfRoutes(fastify) {

  // ── POST /v1/pdf/from-html ────────────────────────────────────────────────
  fastify.post('/v1/pdf/from-html', {
    preHandler: requireApiKey,
    schema: {
      body: {
        type: 'object',
        required: ['html'],
        properties: {
          html:    { type: 'string', minLength: 1 },
          options: { type: 'object' },
        },
      },
    },
  }, async (req, reply) => {
    const { user } = req;
    const { html, options = {} } = req.body;

    // Quota check
    if (!(await hasQuota(user.id, user.plan))) {
      return apiError(reply, 'QUOTA_EXCEEDED');
    }

    // Size check
    const limits = getPlanLimits(user.plan);
    const htmlBytes = Buffer.byteLength(html, 'utf8');
    if (htmlBytes > limits.max_html_mb * MB) {
      return apiError(reply, 'HTML_TOO_LARGE', {
        message: `HTML exceeds the ${limits.max_html_mb}MB limit for the ${user.plan} plan.`,
      });
    }

    let pdf;
    try {
      pdf = await renderHTML(html, options);
    } catch (err) {
      req.log.error(err, 'render failed');
      return apiError(reply, 'RENDER_FAILED');
    }

    // Meter usage after successful render
    await incrementUsage(user.id);

    return reply
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', 'attachment; filename="document.pdf"')
      .header('X-Renderly-Pages', '-')   // could be populated from pdfInfo
      .send(pdf);
  });

  // ── POST /v1/pdf/from-url ─────────────────────────────────────────────────
  fastify.post('/v1/pdf/from-url', {
    preHandler: requireApiKey,
    schema: {
      body: {
        type: 'object',
        required: ['url'],
        properties: {
          url:     { type: 'string', format: 'uri', minLength: 4 },
          options: { type: 'object' },
        },
      },
    },
  }, async (req, reply) => {
    const { user } = req;
    const { url, options = {} } = req.body;

    // Only allow http(s)
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return apiError(reply, 'INVALID_INPUT', { message: 'URL must start with http:// or https://' });
    }

    if (!(await hasQuota(user.id, user.plan))) {
      return apiError(reply, 'QUOTA_EXCEEDED');
    }

    let pdf;
    try {
      pdf = await renderURL(url, options);
    } catch (err) {
      req.log.error(err, 'render failed');
      return apiError(reply, 'RENDER_FAILED');
    }

    await incrementUsage(user.id);

    return reply
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', 'attachment; filename="document.pdf"')
      .send(pdf);
  });
}

module.exports = pdfRoutes;
