import consola, { LogLevels, type LogType } from "consola";
import {
  extractNameAndVersion,
  fetchTarballDownloadUrl,
  getAdaptedExtract,
  getJsonOfRawAndJsr,
} from "./util";
import type { Options } from "./types";
import shell from "shelljs";
import { mkdir, writeFile } from "node:fs/promises";

/**
 * CLI execute entry function
 */
export async function mirrorPackage(packageName: string, options: Options) {
  consola.level = LogLevels[options.logLevel as LogType];
  consola.info(`Mirroring package: ${packageName}`);
  consola.debug(`Effictive Options: ${JSON.stringify(options, null, 2)}`);

  if (!options.dir || options.dir === "/") {
    throw new Error("setting dir incorrectly: " + options.dir);
  }
  // 1. download jsr package to dir
  await downloadTarball(packageName, options.dir);

  // 2. check fields before
  if (!options.skipCheck) {
    const { message, ok } = await checkFields("./", options.dir);
    if (!ok) {
      consola.error(message);
      return;
    }
  }

  // 3. overwrite description fields
  if (!options.ignoreCurrent) {
    await overwriteDescriptFields("./", options.dir, options.addtionalFields);
  }

  // 4. publish
  const directory = `${options.dir}/package`;
  if (!options.dryRun) {
    shell.exec(`npm publish --access public`, { cwd: directory });
    consola.success("published", directory);
  } else {
    consola.success("success with dry-run(not published)", directory);
  }
}

/**
 * download the tarball of jsr packgeName `[@scope]/[package-name][@version?]`
 * @param packageName
 * @param dir target directory
 */
export async function downloadTarball(packageName: string, dir: string) {
  const { name, version } = extractNameAndVersion(packageName);

  // 1. download jsr package to dir
  consola.info(`fetch tarball url for ${name} (version: ${version})`);

  const url = await fetchTarballDownloadUrl(name, version);

  const fileName = url.split("/").slice(-2).join("-");
  consola.info(`download tarball for ${fileName}, url: ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch package: ${response.statusText}`);
    }

    const targetFile = `${dir}/${fileName}`;
    if (!response.body) {
      throw new Error("response body is null.");
    }
    await mkdir(dir, { recursive: true });
    await writeFile(targetFile, response.body, {});

    consola.success(`downloaded tarball: ${targetFile}`);
  } catch (error) {
    consola.error("Error downloading " + url, error);
    throw error;
  }

  try {
    const targetFile = `${dir}/${fileName}`;

    const extract = await getAdaptedExtract();
    //pre clean package dir
    shell.rm("-rf", `${dir}/package/**`);

    await extract({ file: targetFile, cwd: dir });
    consola.success(`untar ${targetFile}`);
  } catch (error) {
    consola.error("Error untar the tarball", error);
    throw error;
  }
}

/**
 * overwrite the description fields(name, author, repository...) of jsr artifact package using raw packages.json of the repository
 * @param rawPackageDir
 * @param jsrPackageDir
 */
export async function overwriteDescriptFields(
  rawPackageDir: string,
  jsrPackageDir: string,
  addtionalFields?: string[]
) {
  const jsrJsonPath = `${jsrPackageDir}/package/package.json`;
  const { jsrJson, baseJson } = await getJsonOfRawAndJsr(
    rawPackageDir,
    jsrPackageDir
  );
  const changedKeys: string[] = [];
  for (const key of descriptionPackageJsonKeys) {
    if (baseJson[key]) {
      jsrJson[key] = baseJson[key];
      changedKeys.push(key);
    }
  }
  if (addtionalFields) {
    for (const key of addtionalFields) {
      if (baseJson[key]) {
        jsrJson[key] = baseJson[key];
        changedKeys.push(key);
      }
    }
  }
  await writeFile(jsrJsonPath, JSON.stringify(jsrJson, null, 2));
  consola.success(`overwrite keys: ${changedKeys} of ${jsrJsonPath}`);
}

const descriptionPackageJsonKeys: string[] = [
  "name",
  "description",
  "keywords",
  "author",
  "contributors",
  "license",
  "homepage",
  "bugs",
  "repository",
];
const checkJsonKeys: string[] = ["version", "type", "dependencies"];

/**
 * check fields of `checkJsonKeys` between raw package.json (in current dir) and jsr package.json,
 * stop the process if there fields have differents.
 */
export async function checkFields(
  rawPackageDir: string,
  jsrPackageDir: string
): Promise<{ ok: boolean; message?: string }> {
  const { jsrJson, baseJson } = await getJsonOfRawAndJsr(
    rawPackageDir,
    jsrPackageDir
  );

  let lastnameOfBase = baseJson.name?.split("/").pop();
  let lastnameOfJsr = jsrJson.name?.split("/").pop();
  lastnameOfJsr = lastnameOfJsr?.split("__").pop();
  if (lastnameOfBase !== lastnameOfJsr) {
    consola.warn(
      `field name seems different, [${lastnameOfBase}] ❓ [${lastnameOfJsr}]`
    );
  }

  for (const key of checkJsonKeys) {
    const cmpOfBase = JSON.stringify(baseJson[key]);
    const cmpOfJsr = JSON.stringify(jsrJson[key]);

    if (cmpOfBase !== cmpOfJsr) {
      return {
        message: `check failed: ${key} is not equal, base: ${cmpOfBase}, jsr: ${cmpOfJsr}`,
        ok: false,
      };
    }
  }

  consola.success("pass critical fields check");
  return {
    ok: true,
  };
}
