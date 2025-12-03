import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: process.env.NODE_ENV === 'production' 
      ? [
          { protocol: "https", hostname: "*" },
          // Only specific trusted domains in production
          // { protocol: "https", hostname: "yourdomain.com" }
        ]
      : [
          { protocol: "https", hostname: "*" },
          { protocol: "http", hostname: "*" } // Allow all in development
        ]
  }
};

export default nextConfig;
