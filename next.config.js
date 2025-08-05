/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "7000",
        pathname: "/**",
      },
    ],
    // You can remove the domains array if you use remotePatterns
    // domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
   /*  NEXT_PUBLIC_API_BASE_URL: "http://localhost:7000/api", */
  },
  async redirects() {
    return [
      {
        source: '/home-2',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);