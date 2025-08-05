/**
 * Sitemap Utilities
 * Functions to help with sitemap management and search engine notifications
 */

/**
 * Ping search engines to notify them of sitemap updates
 * @param {string} sitemapUrl - The full URL to your sitemap
 */
export async function pingSearchEngines(sitemapUrl) {
  const searchEngines = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  ];
  await Promise.allSettled(
    searchEngines.map(async (url) => {
      try {
        const response = await fetch(url, { method: 'GET' });
        return { url, status: response.status, success: response.ok };
      } catch (error) {
        return { url, status: 'error', success: false, error: error.message };
      }
    })
  );
  // Optionally, handle results or throw errors here if needed
}

/**
 * Get the current sitemap URL
 * @returns {string} The full sitemap URL
 */
export function getSitemapUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fabric-shop-frontend-production.up.railway.app';
  return `${baseUrl}/sitemap.xml`;
}

/**
 * Log sitemap statistics for monitoring
 * @param {Array} sitemapData - The sitemap data array
 */
export function logSitemapStats(sitemapData) {
  const stats = {
    total: sitemapData.length,
    static: sitemapData.filter(item => 
      ['/', '/shop', '/blog', '/cart', '/wishlist', '/login', '/contact'].includes(item.url.split('/').pop() || '/')
    ).length,
    products: sitemapData.filter(item => item.url.includes('/fabric/')).length,
    blogs: sitemapData.filter(item => item.url.includes('/blog-details/')).length,
  };
  // Optionally, return stats or handle them as needed
  return stats;
}

/**
 * Validate sitemap data structure
 * @param {Array} sitemapData - The sitemap data array
 * @returns {boolean} Whether the sitemap data is valid
 */
export function validateSitemapData(sitemapData) {
  if (!Array.isArray(sitemapData)) {
    console.error('Sitemap data is not an array');
    return false;
  }
  const requiredFields = ['url'];
  const invalidEntries = sitemapData.filter(entry => 
    !requiredFields.every(field => Object.prototype.hasOwnProperty.call(entry, field))
  );
  if (invalidEntries.length > 0) {
    console.error('Sitemap contains invalid entries:', invalidEntries.length);
    return false;
  }
  // Optionally, return true or handle validation as needed
  return true;
} 