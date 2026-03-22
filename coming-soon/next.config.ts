import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/infowebworld",
  devIndicators: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
