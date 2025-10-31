#!/bin/bash
# Bash script to test Docker build and run
# Run this script to verify Docker setup before deploying to Render

echo "🐳 Building Docker image..."
docker build -t hagiz-simulator .

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "🚀 Starting container..."

# Stop and remove existing container if exists
docker stop hagiz-simulator-test 2>/dev/null
docker rm hagiz-simulator-test 2>/dev/null

# Run the container
docker run -d -p 3000:3000 --name hagiz-simulator-test -v "$(pwd)/images:/app/images" hagiz-simulator

if [ $? -ne 0 ]; then
    echo "❌ Failed to start container!"
    exit 1
fi

echo "✅ Container started!"
echo ""
echo "⏳ Waiting for server to be ready..."
sleep 3

# Test the server
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Server is responding!"
    echo ""
    echo "🌐 Open your browser: http://localhost:3000"
    echo ""
    echo "📋 View logs: docker logs hagiz-simulator-test"
    echo "🛑 Stop container: docker stop hagiz-simulator-test"
    echo "🗑️  Remove container: docker rm hagiz-simulator-test"
else
    echo "❌ Server is not responding!"
    echo "📋 Check logs:"
    docker logs hagiz-simulator-test
    exit 1
fi

