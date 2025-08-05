#!/usr/bin/env node

/**
 * API Test Script
 * Tests if your API is accessible and returning products
 */

async function testAPI() {
  // Testing API connectivity...
  let apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    try {
      const nextConfig = require('../next.config.js');
      apiBaseUrl = nextConfig.env?.NEXT_PUBLIC_API_BASE_URL;
    } catch (error) {
      // Could not read next.config.js
    }
  }
  if (!apiBaseUrl) {
    // NEXT_PUBLIC_API_BASE_URL not found
    return;
  }
  try {
    const apiUrl = `${apiBaseUrl}/newproduct/view`;
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        if (data.data.length > 0) {
          const firstProduct = data.data[0];
          // Optionally, you can add validation or return status here
        }
      }
    }
    // Optionally, you can throw errors or return status objects here if needed
    // For now, the script is silent unless an error occurs
  } catch (error) {
    console.error('Network error:', error.message);
  }
}
// Run the test
testAPI(); 