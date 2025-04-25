# jsr2npm

[![JSR](https://jsr.io/badges/@slow-groovin/jsr2npm)](https://jsr.io/@slow-groovin/jsr2npm)
[![JSR](https://jsr.io/badges/@slow-groovin/jsr2npm/score)](https://jsr.io/@slow-groovin/jsr2npm)
![npm](https://img.shields.io/npm/v/jsr2npm)
![NPM Downloads](https://img.shields.io/npm/d18m/jsr2npm)

a CLI tool to clone/duplicate/mirror your package from [jsr.io](<(https://jsr.io)>) package to npm registry

## Who need this?

- use jsr to publish
- also want to mirror published packages to npm, for users to use it with `npm install` instead of `npx jsr add`

Implemention are inspired by [mirror-jsr-to-npm](https://github.com/ryoppippi/mirror-jsr-to-npm)

## cli usage

```bash
cd <local-repo-dir>                                  # mirror should run in repository directory

npx jsr2npm  @slow-groovin/jsr2npm                   # mirror with default settings
npx jsr2npm  @slow-groovin/jsr2npm --dry-run         # generate the directory but do not publish
npx jsr2npm  @slow-groovin/jsr2npm -i                # do not use packages.json of current directory to overwrite description fields in new packages.json
npx jsr2npm  @slow-groovin/jsr2npm --skip-check      # do not prevent publish when there are differences in fields [version, type, dependencies].
npx jsr2npm  @slow-groovin/jsr2npm --log-level debug # see more logs
npx jsr2npm  @slow-groovin/jsr2npm -a bin private    # specify addtional fields 'bin','private' to be overwritten

bunx jsr2npm @slow-groovin/jsr2npm -a bin --log-level debug # the actual publishing script of this repository
```

## lib usage

```ts
import {
  extractNameAndVersion,
  fetchTarballDownloadUrl,
  getAdaptedExtract,
  getJsonOfRawAndJsr,
} from "jsr2npm";
const packageName = "@<scope>/<name>@0.3.7";
const dir = "./tmp";
// 1. download jsr package to dir
await downloadTarball(packageName, dir);

// 2. check fields before
const { message, ok } = await checkFields("./", dir);
if (!ok) {
  console.error(message);
  return;
}

// 3. overwrite description fields
await overwriteDescriptFields("./", dir);
```

## dev

```bash
bun install
bun run install
```
