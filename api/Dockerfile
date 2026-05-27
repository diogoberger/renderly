# ──────────────────────────────────────────────────────────────
# Renderly API — Dockerfile
# Uses the official Puppeteer image so Chromium is pre-installed
# ──────────────────────────────────────────────────────────────
FROM ghcr.io/puppeteer/puppeteer:22.15.0

# Run as the non-root puppeteer user that ships with the image
USER pptruser

WORKDIR /home/pptruser/app

# Install production dependencies only
COPY --chown=pptruser:pptruser package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY --chown=pptruser:pptruser src/ ./src/

# Expose port (Railway / Cloud Run will override via $PORT)
EXPOSE 3001

# Run migrations then start the server
CMD ["sh", "-c", "node src/db/migrate.js && node src/server.js"]
