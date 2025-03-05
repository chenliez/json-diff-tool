/**
 * Type definitions for JSON values
 */
export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue | undefined };
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * Compares two JSON objects and returns the differences as a JSON object
 * with the original path structure preserved.
 *
 * @param original The original JSON value
 * @param modified The modified JSON value
 * @returns A JSON value containing only the differences, or undefined if no differences
 */
export function findJsonDifferences(
  original: JsonValue | undefined,
  modified: JsonValue | undefined
): JsonValue | undefined {
  // If types don't match, consider it a complete replacement
  if (typeof original !== typeof modified) {
    return modified;
  }

  // If not objects or one is null, direct comparison
  if (typeof original !== "object" || original === null || modified === null) {
    return original === modified ? undefined : modified;
  }

  // Handle arrays
  if (Array.isArray(original) && Array.isArray(modified)) {
    // For simplicity, if arrays have different lengths, consider it a complete replacement
    if (original.length !== modified.length) {
      return modified;
    }

    const arrayDiff: JsonValue[] = [];
    let hasDifference = false;

    for (let i = 0; i < original.length; i++) {
      const diff = findJsonDifferences(original[i], modified[i]);
      if (diff !== undefined) {
        hasDifference = true;
        arrayDiff.push(diff);
      } else {
        arrayDiff.push(undefined as unknown as JsonValue);
      }
    }

    return hasDifference ? arrayDiff : undefined;
  }

  // Handle objects
  const originalObj = original as JsonObject;
  const modifiedObj = modified as JsonObject;
  const result: JsonObject = {};
  let hasDifference = false;

  // Check for properties in modified that differ from original
  for (const key in modifiedObj) {
    if (Object.prototype.hasOwnProperty.call(modifiedObj, key)) {
      // If key doesn't exist in original, it's a new property
      if (!Object.prototype.hasOwnProperty.call(originalObj, key)) {
        result[key] = modifiedObj[key];
        hasDifference = true;
      } else {
        // Key exists in both, check for differences
        const diff = findJsonDifferences(originalObj[key], modifiedObj[key]);
        if (diff !== undefined) {
          result[key] = diff;
          hasDifference = true;
        }
      }
    }
  }

  return hasDifference ? result : undefined;
}

/**
 * Reads two JSON files, compares them, and returns the differences
 *
 * @param originalFilePath Path to the original JSON file
 * @param modifiedFilePath Path to the modified JSON file
 * @returns A JSON object containing only the differences
 */
export async function compareJsonFiles(
  originalFilePath: string,
  modifiedFilePath: string
): Promise<JsonValue | undefined> {
  try {
    // In a Node.js environment, you would use fs.readFile
    // For browser environments, you might use fetch
    // This example shows a Node.js implementation
    const fs = require("fs").promises;

    const originalContent = await fs.readFile(originalFilePath, "utf8");
    const modifiedContent = await fs.readFile(modifiedFilePath, "utf8");

    const original = JSON.parse(originalContent) as JsonValue;
    const modified = JSON.parse(modifiedContent) as JsonValue;

    return findJsonDifferences(original, modified);
  } catch (error) {
    console.error("Error comparing JSON files:", error);
    throw error;
  }
}

/**
 * Example usage:
 *
 * // For Node.js:
 * // const differences = await compareJsonFiles('original.json', 'modified.json');
 * // console.log(JSON.stringify(differences, null, 2));
 *
 * // For direct object comparison:
 * // const original = { a: 1, b: { c: 2, d: 3 }, e: [1, 2, 3] };
 * // const modified = { a: 1, b: { c: 5, d: 3 }, e: [1, 2, 4] };
 * // const differences = findJsonDifferences(original, modified);
 * // console.log(JSON.stringify(differences, null, 2));
 * // Output: { "b": { "c": 5 }, "e": [undefined, undefined, 4] }
 */
