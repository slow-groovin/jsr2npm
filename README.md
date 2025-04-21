# jsr2npm

A CLI tool to mirror your [JSR](https://jsr.io) packages to npm

## Who need this?

- use jsr to publish
- also want to mirror published packages to npm, for users to use it with `npm install` instead of `npx jsr add`

Implemention are inspired by [mirror-jsr-to-npm](https://github.com/ryoppippi/mirror-jsr-to-npm)

## cli usage

```sh
npx jsr2npm  -h
npx jsr2npm  @slow-groovin/moonshot-web-ai-provider
npx jsr2npm  @slow-groovin/moonshot-web-ai-provider --dry-run
npx jsr2npm  @slow-groovin/moonshot-web-ai-provider -i --skip-check --log-level debug
```

## lib usage

```ts
import {
  extractNameAndVersion,
  fetchTarballDownloadUrl,
  getAdaptedExtract,
  getJsonOfRawAndJsr,
} from "jsr2npm";
const packageName = "@<scope>/<name>@0.3.4";
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
