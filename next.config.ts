import type { NextConfig } from "next";
import { execSync } from "node:child_process";

// Prefers whatever the hosting platform/CI already knows (works even from a
// shallow clone or tarball with no .git directory), falling back to asking
// git directly for local dev.
function resolveCommitSha(): string {
  const fromEnv = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA;
  if (fromEnv) return fromEnv;
  try {
    return execSync("git rev-parse HEAD").toString().trim();
  } catch {
    return "unknown";
  }
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_COMMIT_SHA: resolveCommitSha(),
  },
  // Lets Next compile a workspace package's own TS/React source directly
  // into this build, rather than requiring it to be pre-built separately.
  // Next resolves this by package name, not a glob, so each new vendor/*
  // playground project needs its own entry added here.
  transpilePackages: ["@othello/frontend"],
};

export default nextConfig;
