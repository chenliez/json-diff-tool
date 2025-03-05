import { findJsonDifferences, JsonValue, JsonObject } from "./jsonDiff";
import * as fs from "fs";
import * as path from "path";

describe("findJsonDifferences", () => {
  // Test primitive values
  test("should return undefined when primitive values are the same", () => {
    expect(findJsonDifferences(42, 42)).toBeUndefined();
    expect(findJsonDifferences("hello", "hello")).toBeUndefined();
    expect(findJsonDifferences(true, true)).toBeUndefined();
    expect(findJsonDifferences(null, null)).toBeUndefined();
  });

  test("should return the modified value when primitive values are different", () => {
    expect(findJsonDifferences(42, 43)).toBe(43);
    expect(findJsonDifferences("hello", "world")).toBe("world");
    expect(findJsonDifferences(true, false)).toBe(false);
    expect(findJsonDifferences(null, "not null")).toBe("not null");
  });

  // Test different types
  test("should return the modified value when types are different", () => {
    expect(findJsonDifferences(42, "42")).toBe("42");
    expect(findJsonDifferences("hello", true)).toBe(true);
    expect(findJsonDifferences(true, { value: true })).toEqual({ value: true });
  });

  // Test arrays
  test("should return undefined when arrays are identical", () => {
    expect(findJsonDifferences([1, 2, 3], [1, 2, 3])).toBeUndefined();
    expect(
      findJsonDifferences(["a", "b", "c"], ["a", "b", "c"])
    ).toBeUndefined();
  });

  test("should return the modified array when arrays have different lengths", () => {
    const original: JsonValue[] = [1, 2, 3];
    const modified: JsonValue[] = [1, 2, 3, 4];
    expect(findJsonDifferences(original, modified)).toEqual(modified);
  });

  test("should return array with differences at correct indices", () => {
    expect(findJsonDifferences([1, 2, 3], [1, 5, 3])).toEqual([
      undefined,
      5,
      undefined,
    ]);
    expect(findJsonDifferences(["a", "b", "c"], ["a", "x", "c"])).toEqual([
      undefined,
      "x",
      undefined,
    ]);
  });

  test("should handle nested arrays", () => {
    const original: JsonValue[] = [1, [2, 3], 4];
    const modified: JsonValue[] = [1, [2, 5], 4];
    expect(findJsonDifferences(original, modified)).toEqual([
      undefined,
      [undefined, 5],
      undefined,
    ]);
  });

  // Test objects
  test("should return undefined when objects are identical", () => {
    expect(findJsonDifferences({ a: 1, b: 2 }, { a: 1, b: 2 })).toBeUndefined();
  });

  test("should return object with only the different properties", () => {
    expect(findJsonDifferences({ a: 1, b: 2 }, { a: 1, b: 3 })).toEqual({
      b: 3,
    });
    expect(
      findJsonDifferences({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 4 })
    ).toEqual({ c: 4 });
  });

  test("should handle new properties in modified object", () => {
    expect(findJsonDifferences({ a: 1 }, { a: 1, b: 2 })).toEqual({ b: 2 });
  });

  test("should handle nested objects", () => {
    const original: JsonObject = { a: 1, b: { c: 2, d: 3 } };
    const modified: JsonObject = { a: 1, b: { c: 5, d: 3 } };
    expect(findJsonDifferences(original, modified)).toEqual({ b: { c: 5 } });
  });

  // Complex test cases
  test("should handle complex nested structures", () => {
    const original: JsonObject = {
      name: "Product",
      version: "1.0.0",
      settings: {
        enabled: true,
        timeout: 30,
        features: {
          logging: true,
          caching: false,
        },
      },
      tags: ["stable", "production"],
      metadata: {
        created: "2023-01-01",
        author: "John Doe",
      },
    };

    const modified: JsonObject = {
      name: "Product",
      version: "1.0.1",
      settings: {
        enabled: true,
        timeout: 60,
        features: {
          logging: true,
          caching: true,
        },
      },
      tags: ["stable", "production", "updated"],
      metadata: {
        created: "2023-01-01",
        author: "Jane Smith",
      },
    };

    const expected: JsonObject = {
      version: "1.0.1",
      settings: {
        timeout: 60,
        features: {
          caching: true,
        },
      },
      tags: ["stable", "production", "updated"],
      metadata: {
        author: "Jane Smith",
      },
    };

    expect(findJsonDifferences(original, modified)).toEqual(expected);
  });

  // Edge cases
  test("should handle empty objects and arrays", () => {
    expect(findJsonDifferences({}, {})).toBeUndefined();
    expect(findJsonDifferences([], [])).toBeUndefined();
    expect(findJsonDifferences({}, { a: 1 })).toEqual({ a: 1 });
    expect(findJsonDifferences([], [1])).toEqual([1]);
  });

  test("should handle undefined and null values", () => {
    const originalWithUndefined = { a: undefined } as unknown as JsonObject;
    expect(findJsonDifferences(originalWithUndefined, { a: null })).toEqual({
      a: null,
    });
    expect(findJsonDifferences({ a: null }, { a: 1 })).toEqual({ a: 1 });
    expect(findJsonDifferences({ a: 1 }, { a: null })).toEqual({ a: null });
  });

  // File-based tests
  test("should correctly identify differences in example JSON files", () => {
    // Read the example files
    const originalPath = path.join(__dirname, "examples", "original.json");
    const modifiedPath = path.join(__dirname, "examples", "modified.json");

    if (fs.existsSync(originalPath) && fs.existsSync(modifiedPath)) {
      const original = JSON.parse(
        fs.readFileSync(originalPath, "utf8")
      ) as JsonValue;
      const modified = JSON.parse(
        fs.readFileSync(modifiedPath, "utf8")
      ) as JsonValue;

      const differences = findJsonDifferences(original, modified);

      // Expected differences based on our example files
      expect(differences).toHaveProperty("version", "1.0.1");
      expect(differences).toHaveProperty("settings.timeout", 60);
      expect(differences).toHaveProperty("settings.features.caching", true);
      expect(differences).toHaveProperty("tags");
      expect(differences).toHaveProperty("metadata.author", "Jane Smith");
    }
  });
});
