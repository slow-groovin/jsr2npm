import { expect, test, describe } from "bun:test";
import { extractNameAndVersion } from "./util";

describe("extractNameAndVersion", () => {
  const testCases = [
    { input: "packageA", expectedName: "packageA", expectedVersion: "latest" },
    {
      input: "@scope/packageA",
      expectedName: "@scope/packageA",
      expectedVersion: "latest",
    },
    {
      input: "packageA@0.3.2",
      expectedName: "packageA",
      expectedVersion: "0.3.2",
    },
    {
      input: "packageA@latest",
      expectedName: "packageA",
      expectedVersion: "latest",
    },
    {
      input: "@scope/packageA@1.2.3",
      expectedName: "@scope/packageA",
      expectedVersion: "1.2.3",
    },
  ];

  testCases.forEach(({ input, expectedName, expectedVersion }) => {
    test(`extractNameAndVersion with input ${input}`, () => {
      const { name, version } = extractNameAndVersion(input);
      expect(name).toBe(expectedName);
      expect(version).toBe(expectedVersion);
    });
  });

  test("extractNameAndVersion throws error when packageName is empty", () => {
    expect(() => extractNameAndVersion("")).toThrowError(
      "input packagename must not be null"
    );
  });
});
