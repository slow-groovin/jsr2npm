import { $ } from "bun";

await $`rm -rf dist`;
/**
 * build for local only
 */
await Bun.build({
  entrypoints: ["./src/cli.ts"],
  outdir: "./dist",
  target: "node",
});
