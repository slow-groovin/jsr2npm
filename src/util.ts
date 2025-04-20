import { readFile } from "node:fs/promises";
import type { PackageJson } from "type-fest";

/**
 * giving a jsr package-name and tag, find it's corespond tarball url by fetching api
 * @param jsrPkgName jsr registry package name, @<scope>/<package-name>
 * @param tag version tag
 * @returns tarball download url
 */
export async function fetchTarballDownloadUrl(
  jsrPkgName: string,
  tag?: string
) {
  const url = jsrRegistryUrl(jsrPkgName);
  const resp = await fetch(url);
  const obj = (await resp.json()) as any;
  if (!tag || tag === "latest") {
    tag = obj["dist-tags"]["latest"] as string;
  }
  return obj["versions"][tag]["dist"]["tarball"] as string;
}

/**
 * return jsr registry api url of the package-name
 */
function jsrRegistryUrl(jsrPkgName: string) {
  const jsrFlatPkgName = convertPkgNameJsrToNpm(jsrPkgName);
  const url = `https://npm.jsr.io/${jsrFlatPkgName}`;
  return url;
}

/**
 * example: `@slow-groovin/moonshot-web-ai-provider` -> `@jsr/slow-groovin__moonshot-web-ai-provider`
 */
function convertPkgNameJsrToNpm(jsrPkgName: string): string {
  const [_scope, pkg] = jsrPkgName.split("/");
  if (!_scope || !_scope.startsWith("@") || !pkg) {
    throw new Error(`Invalid package name: ${jsrPkgName}`);
  }
  const scope = _scope.slice(1);
  return `@jsr/${scope}__${pkg}`;
}

/**
 *  adaption for using tar in bun
 */
export async function getAdaptedExtract() {
  const needTarWorkaround =
    typeof Bun !== "undefined" && process.platform === "win32";
  if (needTarWorkaround) process.env.__FAKE_PLATFORM__ = "linux";
  const { extract } = await import("tar");
  if (needTarWorkaround) delete process.env.__FAKE_PLATFORM__;
  return extract;
}

/**
 * extract name and optional tag from a full packageName
 * @param packageName 'pacakgeA' or "@scope/packageA" or 'packageA@latest' or 'packageA@0.3.2' or ...
 */
export function extractNameAndVersion(packageName: string): {
  name: string;
  version: string;
} {
  if (!packageName) {
    throw new Error("input packagename must not be null");
  }
  let name: string, version: string;
  const atIndex = packageName.indexOf("@", 1);
  if (atIndex === -1) {
    name = packageName;
    version = "latest";
  } else {
    name = packageName.substring(0, atIndex);
    version = packageName.substring(atIndex + 1);
  }
  return { name: name!, version };
}

export async function getJsonOfRawAndJsr(
  rawPackageDir: string,
  jsrPackageDir: string
) {
  const jsrJsonPath = `${jsrPackageDir}/package/package.json`;
  const baseJson =JSON.parse((await readFile(`${rawPackageDir}/package.json`)).toString()) as PackageJson; //prettier-ignore
  const jsrJson = JSON.parse((await readFile(jsrJsonPath)).toString()) as PackageJson; // prettier-ignore
  return { baseJson, jsrJson };
}
