import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/service/:path*",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/support",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/pricing",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/careers",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/free-audit",
        destination: "/contact?intent=free-audit",
        permanent: true,
      },
      {
        source: "/free-growth-audit",
        destination: "/contact?intent=free-audit",
        permanent: true,
      },
      {
        source: "/guides/complete-guide-remote-team-management",
        destination: "/guides/complete-guide-virtual-team-management",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
// cache bust 1774638304
