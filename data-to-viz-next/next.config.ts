import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  allowedDevOrigins: [
    'localhost',
    '*.localhost',
    '127.0.0.1',
    '192.168.100.110',
    '192.168.2.110',
  ],
  
  // 尝试解决 G2 组件丢失问题
  transpilePackages: ['@antv/g2', '@antv/util', '@antv/coord', '@antv/scale', '@antv/attr'],

  // 显式设置 Turbopack 根目录
  turbopack: {
    root: '.',
  },
};

export default nextConfig;
