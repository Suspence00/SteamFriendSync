import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default {
  ...defineCloudflareConfig(),
  // OpenNext must invoke Next.js directly instead of re-entering the CI build.
  buildCommand: "pnpm run build:next",
};
