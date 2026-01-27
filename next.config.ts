import type { NextConfig } from "next";

import withMdkCheckout from "@moneydevkit/nextjs/next-plugin";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.join(__dirname, ".."),
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withMdkCheckout(nextConfig as any);
