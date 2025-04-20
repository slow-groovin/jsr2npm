# jsr-2-npm-cli

A CLI tool to mirror your [JSR](https://jsr.io) packages to npm

Who need this?

- pure typescript OSS library developement, export `.ts` in package.json, do not want to care about js, esm/cjs
- use jsr to publish, but also want to mirror it to npm, for users to use it with `npm install` instead of `npx jsr add`

Implemention are inspired by [mirror-jsr-to-npm](https://github.com/ryoppippi/mirror-jsr-to-npm)

## usage

```text
npx jsr2npm  -h
npx jsr2npm  @slow-groovin/moonshot-web-ai-provider
npx jsr2npm  @slow-groovin/moonshot-web-ai-provider --dry-run
npx jsr2npm  @slow-groovin/moonshot-web-ai-provider -i --skip-check --log-level debug
```

## dev

To install dependencies:

```bash
bun install
```
