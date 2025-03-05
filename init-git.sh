#!/bin/bash

# Initialize Git repository
echo "Initializing Git repository..."
git init

# Add all files to Git
echo "Adding files to Git..."
git add .

# Create initial commit
echo "Creating initial commit..."
git commit -m "Initial commit: JSON Difference Finder tool"

# Display status
echo "Git repository initialized successfully!"
echo "Current status:"
git status

echo ""
echo "Next steps:"
echo "1. Link to a remote repository:"
echo "   git remote add origin <your-repository-url>"
echo "2. Push to the remote repository:"
echo "   git push -u origin main" 