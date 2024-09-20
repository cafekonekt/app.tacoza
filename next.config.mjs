/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["tacoza.co", "*.tacoza.co"],
    },
  },
  images: {
    domains: ["localhost", "tacoza.co", "api.tacoza.co"],
  },
};

export default nextConfig;
