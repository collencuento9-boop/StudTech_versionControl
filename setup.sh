#!/bin/bash

# WMSU ILS Elementary Portal - Local Development Setup Script

echo "========================================="
echo "WMSU ILS Elementary Portal Setup"
echo "========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install root dependencies
echo ""
echo "Installing root dependencies..."
npm install

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
cd server
npm install
cd ..

# Create .env file from .env.example if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your database credentials"
fi

# Create backend .env if it doesn't exist
if [ ! -f server/.env ]; then
    echo "Creating server/.env file..."
    cp .env.example server/.env
    echo "⚠️  Please update server/.env with your database credentials"
fi

echo ""
echo "========================================="
echo "✅ Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Update .env file with your database credentials"
echo "2. Update server/.env with your database credentials"
echo "3. Start the backend: cd server && npm run dev"
echo "4. In another terminal, start the frontend: npm run dev"
echo "5. Open http://localhost:5173 in your browser"
echo ""
echo "Default credentials:"
echo "  Username: admin"
echo "  Password: admin"
echo ""
