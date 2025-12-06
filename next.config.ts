import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          // { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
          // { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
