import type { NextConfig } from "next";

import withMdkCheckout from "@moneydevkit/nextjs/next-plugin";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.join(__dirname, ".."),
  },
  serverExternalPackages: [
    "@moneydevkit/nextjs",
    "@moneydevkit/core",
    "@moneydevkit/lightning-js",
  ],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent bundling MDK packages on the server
      config.externals = config.externals || [];
      config.externals.push({
        "@moneydevkit/lightning-js": "commonjs @moneydevkit/lightning-js",
        "@moneydevkit/core": "commonjs @moneydevkit/core",
      });
    }
    return config;
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withMdkCheckout(nextConfig as any);
