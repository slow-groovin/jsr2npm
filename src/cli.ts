#!/usr/bin/env node
import { program } from "commander";
import { mirrorPackage } from "./lib";

program
  .name("jsr2npm")
  .description("A CLI tool to mirror JSR packages to npm")
  .version("0.0.1");

program
  .argument("<packageName>", "The package name(in jsr registry) to mirror")
  .option("--dry-run", "Mirror but do not publish", false)
  .option("--dir <directory>", "Specify the intermediate directory", "./.tmp")
  .option(
    "--log-level <logLevel>",
    "log level(verbose, debug, info, warn, error, off)",
    "info"
  )
  .option(
    "-i, --ignore-current",
    "do not use raw packages.json of current directory to overwrite the description fields(name, author, repository...), use packages.json in jsr package only",
    false
  )
  .option(
    "--skip-check",
    "Skip the check of fields(version, type, dependencies) to stop publish if not equal",
    false
  )
  .action(async (packageName, options) => {
    try {
      await mirrorPackage(packageName, options);
    } catch (error) {
      console.error("Failed to mirror package:", error);
      process.exit(1);
    }
  });

program.on("--help", () => {
  console.log("");
  console.log("Example:");
  console.log("jsr2npm  @slow-groovin/moonshot-web-ai-provider");
  console.log("jsr2npm  @slow-groovin/moonshot-web-ai-provider --dry-run");
  console.log("jsr2npm  @slow-groovin/moonshot-web-ai-provider --dir ./.out");
  console.log(
    "jsr2npm  @slow-groovin/moonshot-web-ai-provider -i --skip-check --log-level debug"
  );
});
program.parse();
