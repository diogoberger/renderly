'use strict';

const puppeteer = require('puppeteer');

// Keep a single browser instance alive and reuse it across requests.
// We launch lazily on first use and reuse across requests for performance.
let browserInstance = null;
let renderCount = 0;
const RECYCLE_AFTER = 200; // restart browser every 200 renders to avoid memory creep

async function getBrowser() {
  if (!browserInstance || !browserInstance.connected) {
    browserInstance = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',      // required in Docker/Railway
        '--disable-gpu',
        '--font-render-hinting=none',
      ],
    });
    renderCount = 0;
    console.log('[renderer] browser launched');
  }
  renderCount++;
  if (renderCount >= RECYCLE_AFTER) {
    console.log('[renderer] recycling browser after', renderCount, 'renders');
    await browserInstance.close().catch(() => {});
    browserInstance = null;
    return getBrowser();
  }
  return browserInstance;
}

/**
 * Normalise the options object coming from API request bodies.
 * All fields are optional — sensible defaults are applied.
 */
function normaliseOptions(opts = {}) {
  const format  = ['A4', 'A3', 'A5', 'Letter', 'Legal', 'Tabloid'].includes(opts.format) ? opts.format : 'A4';
  const landscape = opts.landscape === true;
  const scale     = typeof opts.scale === 'number' && opts.scale > 0 && opts.scale <= 2 ? opts.scale : 1;

  // Margins: accept shorthand ('1cm') or object ({top,right,bottom,left})
  let margin = { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' };
  if (typeof opts.margin === 'string') {
    margin = { top: opts.margin, right: opts.margin, bottom: opts.margin, left: opts.margin };
  } else if (opts.margin && typeof opts.margin === 'object') {
    margin = { ...margin, ...opts.margin };
  }

  const headerTemplate = typeof opts.headerTemplate === 'string' ? opts.headerTemplate : '';
  const footerTemplate = typeof opts.footerTemplate === 'string' ? opts.footerTemplate : '';
  const displayHeaderFooter = !!(headerTemplate || footerTemplate);

  const printBackground = opts.printBackground !== false; // default: true

  return { format, landscape, scale, margin, headerTemplate, footerTemplate, displayHeaderFooter, printBackground };
}

/**
 * Render raw HTML → PDF buffer.
 * @param {string} html - Full HTML document string
 * @param {object} options - Rendering options
 * @returns {Promise<Buffer>}
 */
async function renderHTML(html, options = {}) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    const opts = normaliseOptions(options);

    // Set content and wait for network and fonts to settle
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30_000 });

    const pdf = await page.pdf({
      format: opts.format,
      landscape: opts.landscape,
      scale: opts.scale,
      margin: opts.margin,
      headerTemplate: opts.headerTemplate || '<span></span>',
      footerTemplate: opts.footerTemplate || '<span></span>',
      displayHeaderFooter: opts.displayHeaderFooter,
      printBackground: opts.printBackground,
    });

    return pdf;
  } finally {
    await page.close().catch(() => {});
  }
}

/**
 * Navigate to a URL and render to PDF.
 * @param {string} url - A fully-qualified URL (https://...)
 * @param {object} options - Rendering options
 * @returns {Promise<Buffer>}
 */
async function renderURL(url, options = {}) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    const opts = normaliseOptions(options);

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30_000 });

    const pdf = await page.pdf({
      format: opts.format,
      landscape: opts.landscape,
      scale: opts.scale,
      margin: opts.margin,
      headerTemplate: opts.headerTemplate || '<span></span>',
      footerTemplate: opts.footerTemplate || '<span></span>',
      displayHeaderFooter: opts.displayHeaderFooter,
      printBackground: opts.printBackground,
    });

    return pdf;
  } finally {
    await page.close().catch(() => {});
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (browserInstance) await browserInstance.close().catch(() => {});
});

module.exports = { renderHTML, renderURL };
