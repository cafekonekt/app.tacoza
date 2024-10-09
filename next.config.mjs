/** @type {import('next').NextConfig} */
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "src/app/sw.js",
  swDest: "public/sw.js",
  reloadOnOnline: true,
  disable: false,
});

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

export default withSerwist(nextConfig);
