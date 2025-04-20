import { $ } from "bun";

await $`rm -rf dist`;
await Bun.build({
  entrypoints: ["./src/cli.ts"],
  outdir: "./dist",
  target: "node",
});
