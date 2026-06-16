import type { NextConfig } from "next";
import os from "os";

// Automatically fetch all active IPv4 addresses of this host to prevent HMR WebSocket issues in different LAN environments
const getLocalIPs = (): string[] => {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (iface) {
      for (const alias of iface) {
        if (alias.family === "IPv4" && !alias.internal) {
          ips.push(alias.address);
        }
      }
    }
  }
  return ips;
};

const nextConfig: NextConfig = {
  reactCompiler: false,
  allowedDevOrigins: [
    "localhost",
    "*.localhost",
    "127.0.0.1",
    ...getLocalIPs(), // Dynamically expand current IP addresses
  ],
  
  // 尝试解决 G2 组件丢失问题
  transpilePackages: ["@antv/g2", "@antv/util", "@antv/coord", "@antv/scale", "@antv/attr"],

  // 显式设置 Turbopack 根目录
  turbopack: {
    root: ".",
  },
};

export default nextConfig;
