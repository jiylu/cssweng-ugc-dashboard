import type { NextConfig } from "next";

const apiBaseUrl =
  process.env.INTERNAL_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8080";
const apiDestinationBaseUrl = apiBaseUrl.endsWith("/api")
  ? apiBaseUrl
  : `${apiBaseUrl}/api`;

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["asceoft.accela.moe"],
  devIndicators: false,
  experimental: {
    proxyClientMaxBodySize: "300mb",
  },
  turbopack: {}, 
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiDestinationBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
