#!/bin/bash

# Build the project
npm run build

# Run the CLI tool with the example files
node dist/jsonDiffCli.js examples/original.json examples/modified.json

echo "You can also run the tool with your own files:"
echo "node dist/jsonDiffCli.js path/to/original.json path/to/modified.json [path/to/output.json]" 