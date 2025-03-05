/**
 * Compares two JSON objects and returns the differences as a JSON object
 * with the original path structure preserved.
 *
 * @param original The original JSON object
 * @param modified The modified JSON object
 * @returns A JSON object containing only the differences
 */
export function findJsonDifferences(original: any, modified: any): any {
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

    const arrayDiff: any[] = [];
    let hasDifference = false;

    for (let i = 0; i < original.length; i++) {
      const diff = findJsonDifferences(original[i], modified[i]);
      if (diff !== undefined) {
        hasDifference = true;
      }
      arrayDiff.push(diff);
    }

    return hasDifference ? arrayDiff : undefined;
  }

  // Handle objects
  const result: any = {};
  let hasDifference = false;

  // Check for properties in modified that differ from original
  for (const key in modified) {
    if (Object.prototype.hasOwnProperty.call(modified, key)) {
      // If key doesn't exist in original, it's a new property
      if (!Object.prototype.hasOwnProperty.call(original, key)) {
        result[key] = modified[key];
        hasDifference = true;
      } else {
        // Key exists in both, check for differences
        const diff = findJsonDifferences(original[key], modified[key]);
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
): Promise<any> {
  try {
    // In a Node.js environment, you would use fs.readFile
    // For browser environments, you might use fetch
    // This example shows a Node.js implementation
    const fs = require("fs").promises;

    const originalContent = await fs.readFile(originalFilePath, "utf8");
    const modifiedContent = await fs.readFile(modifiedFilePath, "utf8");

    const original = JSON.parse(originalContent);
    const modified = JSON.parse(modifiedContent);

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
