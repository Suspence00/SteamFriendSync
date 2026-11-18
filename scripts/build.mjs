import { spawnSync } from "node:child_process";

const task = process.env.WORKERS_CI === "1" ? "build:worker" : "build:next";
const result = spawnSync(`pnpm run ${task}`, {
  shell: true,
  stdio: "inherit",
});

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
