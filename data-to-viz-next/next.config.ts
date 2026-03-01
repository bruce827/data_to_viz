import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  allowedDevOrigins: ['192.168.2.110'],
  
  // 尝试解决 G2 组件丢失问题
  transpilePackages: ['@antv/g2', '@antv/util', '@antv/coord', '@antv/scale', '@antv/attr'],

  // 显式设置 Turbopack 根目录
  turbopack: {
    root: '.',
  },

  // 忽略 TypeScript 错误
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
