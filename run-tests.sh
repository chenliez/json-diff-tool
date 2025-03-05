#!/bin/bash

# Install dependencies if they don't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Run the tests
echo "Running tests..."
npm test

# If you want to run tests in watch mode, uncomment the line below
# npm run test:watch 