#!/bin/bash
# Render build script

echo "🔧 Installing dependencies..."
npm ci

echo "📦 Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
