import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  experimental: {
    // Avoid Windows filesystem races while prerendering many static routes.
    cpus: 1,
  },
};

export default nextConfig;
