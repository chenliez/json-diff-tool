#!/usr/bin/env node

import { findJsonDifferences, JsonValue } from "./jsonDiff";
import * as fs from "fs";
import * as path from "path";

/**
 * CLI tool to compare two JSON files and output the differences
 */
export async function main(): Promise<void> {
  try {
    // Get command line arguments
    const args = process.argv.slice(2);

    if (args.length < 2) {
      console.error(
        "Usage: node jsonDiffCli.js <originalFile> <modifiedFile> [outputFile]"
      );
      console.error(
        'If outputFile is not specified, it will be saved as "diff_output.json" in the same folder'
      );
      process.exit(1);
    }

    const originalFilePath = args[0];
    const modifiedFilePath = args[1];

    // Determine the output file path
    const folderPath = path.dirname(originalFilePath);
    const outputFilePath = args[2] || path.join(folderPath, "diff_output.json");

    // Validate file paths
    if (!fs.existsSync(originalFilePath)) {
      console.error(`Error: Original file not found: ${originalFilePath}`);
      process.exit(1);
    }

    if (!fs.existsSync(modifiedFilePath)) {
      console.error(`Error: Modified file not found: ${modifiedFilePath}`);
      process.exit(1);
    }

    // Read and parse the JSON files
    const originalContent = fs.readFileSync(originalFilePath, "utf8");
    const modifiedContent = fs.readFileSync(modifiedFilePath, "utf8");

    let original: JsonValue;
    let modified: JsonValue;

    try {
      original = JSON.parse(originalContent);
    } catch (error) {
      console.error(`Error parsing original file: ${originalFilePath}`);
      console.error(error);
      process.exit(1);
    }

    try {
      modified = JSON.parse(modifiedContent);
    } catch (error) {
      console.error(`Error parsing modified file: ${modifiedFilePath}`);
      console.error(error);
      process.exit(1);
    }

    // Find differences
    const differences = findJsonDifferences(original, modified);

    if (differences === undefined) {
      console.log("No differences found between the files.");
      process.exit(0);
    }

    // Write the differences to the output file
    fs.writeFileSync(
      outputFilePath,
      JSON.stringify(differences, null, 2),
      "utf8"
    );

    console.log(`Differences found and saved to: ${outputFilePath}`);
    console.log("Summary of differences:");
    console.log(JSON.stringify(differences, null, 2));
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

// Run the CLI if this file is executed directly
if (require.main === module) {
  main();
}
