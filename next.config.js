/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;
