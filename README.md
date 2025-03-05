# JSON Difference Finder

This TypeScript utility helps you find differences between two JSON objects with the same schema, preserving the original path structure in the output.

## Features

- Compares two JSON objects and identifies differences in values
- Preserves the original JSON path structure in the output
- Works with nested objects and arrays
- Returns only the changed values, making it easy to see what's different
- Includes a CLI tool for comparing JSON files

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/json-diff-tool.git
cd json-diff-tool

# Install dependencies
npm install

# Build the project
npm run build

# Install globally (optional)
npm install -g .
```

## CLI Usage

```bash
# Using npx
npx json-diff original.json modified.json [output.json]

# If installed globally
json-diff original.json modified.json [output.json]

# Using npm start
npm start -- original.json modified.json [output.json]
```

If the output file is not specified, the differences will be saved as `diff_output.json` in the same folder as the original file.

## API Usage

### Direct Object Comparison

```typescript
import { findJsonDifferences } from "./jsonDiff";

const original = {
  name: "Product",
  version: "1.0.0",
  settings: {
    enabled: true,
    timeout: 30,
  },
};

const modified = {
  name: "Product",
  version: "1.0.1",
  settings: {
    enabled: true,
    timeout: 60,
  },
};

const differences = findJsonDifferences(original, modified);
console.log(JSON.stringify(differences, null, 2));
```

Output:

```json
{
  "version": "1.0.1",
  "settings": {
    "timeout": 60
  }
}
```

### File Comparison (Node.js)

```typescript
import { compareJsonFiles } from "./jsonDiff";

async function main() {
  try {
    const differences = await compareJsonFiles(
      "original.json",
      "modified.json"
    );
    console.log(JSON.stringify(differences, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
```

## Testing

The project includes comprehensive unit tests for the core JSON difference functionality.

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch
```

The tests cover:

- Basic primitive value comparisons
- Array comparisons (including nested arrays)
- Object comparisons (including nested objects)
- Complex nested structures
- Edge cases (empty objects/arrays, null/undefined values)

## Development

### Git Repository

This project is set up as a Git repository. If you've cloned it, you're good to go. If you're setting it up from scratch:

```bash
# Make the script executable
chmod +x init-git.sh

# Run the initialization script
./init-git.sh
```

The script will:

1. Initialize a new Git repository
2. Add all project files
3. Create an initial commit

### Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## How It Works

The function recursively traverses both JSON objects and compares values at each level:

1. If types don't match, it considers it a complete replacement
2. For primitive values, it does a direct comparison
3. For objects, it checks each property recursively
4. For arrays, it compares elements at the same index

The output contains only the properties that have different values, maintaining the original structure.

## Limitations

- For arrays, if the lengths differ, the entire array is considered different
- The function doesn't detect moved elements in arrays
- It doesn't track deleted properties (only focuses on what's in the modified object)

## License

MIT
