import type { NextConfig } from "next";

import withMdkCheckout from "@moneydevkit/nextjs/next-plugin";

const nextConfig: NextConfig = {
  /* config options here */
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withMdkCheckout(nextConfig as any);
