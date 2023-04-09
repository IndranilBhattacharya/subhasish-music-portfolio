/** @type {import('next').NextConfig} */
const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  runtimeCaching,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest.json$/],
});

const nextConfig = withPWA({
  swcMinify: true,
  reactStrictMode: true,
  crossOrigin: "anonymous",
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: ["i.ytimg.com", "i.scdn.co"],
  },
});

module.exports = nextConfig;
