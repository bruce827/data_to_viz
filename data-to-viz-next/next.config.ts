import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,

  // 显式设置 Turbopack 根目录
  turbopack: {
    root: '.',
  },

  // 忽略 TypeScript 错误
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;