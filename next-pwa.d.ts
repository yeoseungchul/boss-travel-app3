declare module "next-pwa" {
  import type { NextConfig } from "next";

  type WithPwaOptions = Record<string, unknown>;
  const withPWAInit: (options: WithPwaOptions) => (nextConfig: NextConfig) => NextConfig;
  export default withPWAInit;
}

