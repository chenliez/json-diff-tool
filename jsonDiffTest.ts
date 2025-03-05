import { findJsonDifferences } from "./jsonDiff";

// Example JSON objects
const original = {
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

const modified = {
  name: "Product", // unchanged
  version: "1.0.1", // changed
  settings: {
    enabled: true, // unchanged
    timeout: 60, // changed
    features: {
      logging: true, // unchanged
      caching: true, // changed
    },
  },
  tags: ["stable", "production", "updated"], // changed (array length different)
  metadata: {
    created: "2023-01-01", // unchanged
    author: "Jane Smith", // changed
  },
};

// Find differences
const differences = findJsonDifferences(original, modified);

// Output the differences
console.log("Differences found:");
console.log(JSON.stringify(differences, null, 2));

// Expected output:
/*
{
  "version": "1.0.1",
  "settings": {
    "timeout": 60,
    "features": {
      "caching": true
    }
  },
  "tags": ["stable", "production", "updated"],
  "metadata": {
    "author": "Jane Smith"
  }
}
*/
