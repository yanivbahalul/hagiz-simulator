# PowerShell script to test Docker build and run
# Run this script to verify Docker setup before deploying to Render

Write-Host "🐳 Building Docker image..." -ForegroundColor Cyan
docker build -t hagiz-simulator .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Starting container..." -ForegroundColor Cyan

# Stop and remove existing container if exists
docker stop hagiz-simulator-test 2>$null
docker rm hagiz-simulator-test 2>$null

# Run the container
docker run -d -p 3000:3000 --name hagiz-simulator-test -v "${PWD}/images:/app/images" hagiz-simulator

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start container!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Container started!" -ForegroundColor Green
Write-Host ""
Write-Host "⏳ Waiting for server to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Test the server
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5
    Write-Host "✅ Server is responding!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Open your browser: http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 View logs: docker logs hagiz-simulator-test" -ForegroundColor Yellow
    Write-Host "🛑 Stop container: docker stop hagiz-simulator-test" -ForegroundColor Yellow
    Write-Host "🗑️  Remove container: docker rm hagiz-simulator-test" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Server is not responding!" -ForegroundColor Red
    Write-Host "📋 Check logs: docker logs hagiz-simulator-test" -ForegroundColor Yellow
    docker logs hagiz-simulator-test
    exit 1
}

