/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",

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
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return [
      {
        source: "/home-2",
        destination: "/",
        permanent: true,
      },
    ];
  },

  webpack: (config) => {
    // ✅ Make @ and @assets work in imports
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.join(__dirname, "src"),
      "@assets": path.join(__dirname, "src/assets"),
    };

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
