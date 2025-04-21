#!/usr/bin/env node
/**
 * CLI entrypoint
 * > include this in `jsr.json` to make it compiled.
 * @module
 */
import { program } from "commander";
import { mirrorPackage } from "./lib";

program
  .name("jsr2npm")
  .description("A CLI tool to mirror JSR packages to npm")
  .version("0.3.7", "-v, --vers", "output the current version");

program
  .argument("<packageName>", "The package name(in jsr registry) to mirror")
  .option("--dir <directory>", "Specify the intermediate directory", "./.tmp")
  .option(
    "-i, --ignore-current",
    "do not use raw packages.json of current directory to overwrite the description fields(name, author, repository...), use packages.json in jsr package only",
    false
  )
  .option(
    "-a --addtional-fields [fields...]",
    "specify some additional fields to be overwritten, use raw packages.json of current directory to overwrite there fields in the packages.json in jsr package "
  )
  .option(
    "--skip-check",
    "Skip the check of fields(version, type, dependencies) to stop publish if not equal",
    false
  )
  .option("--clear", "post clear", false)
  .option("--dry-run", "Mirror but do not publish", false)
  .option(
    "--log-level <logLevel>",
    "log level(verbose, debug, info, warn, error, off)",
    "info"
  )
  .action(async (packageName, options) => {
    try {
      await mirrorPackage(packageName, options);
    } catch (error) {
      console.error("Failed to mirror package:", error);
      process.exit(1);
    }
  });
program.addHelpText(
  "after",
  `
Example call:

    $ jsr2npm  @slow-groovin/jsr2npm                   # mirror with default settings
    $ jsr2npm  @slow-groovin/jsr2npm --dry-run         # generate the directory but do not publish
    $ jsr2npm  @slow-groovin/jsr2npm -i                # do not use packages.json of current directory to overwrite description fields in new packages.json
    $ jsr2npm  @slow-groovin/jsr2npm --skip-check      # do not prevent publish when there are differences in fields [version, type, dependencies]. 
    $ jsr2npm  @slow-groovin/jsr2npm --log-level debug # see more logs
    $ jsr2npm  @slow-groovin/jsr2npm -a bin private    # specify addtional fields 'bin','private' to be overwritten
    
    `
);

program.parse();
