$src = "c:\Users\Pranav\OneDrive\Documents\AI-Based early warning Project 1"
$staging = Join-Path $env:TEMP "ner_watch_staging"
$zipDest = Join-Path $src "NER-WATCH-AI-Landslide-System.zip"

Write-Host "Creating staging directory at $staging..."
if (Test-Path $staging) {
    Remove-Item -Path $staging -Recurse -Force
}
New-Item -ItemType Directory -Path $staging | Out-Null

Write-Host "Copying project root files..."
Copy-Item (Join-Path $src "package.json") $staging
Copy-Item (Join-Path $src "README.md") $staging
Copy-Item (Join-Path $src ".gitignore") $staging

Write-Host "Copying server files (excluding node_modules)..."
$serverStaging = Join-Path $staging "server"
New-Item -ItemType Directory -Path $serverStaging | Out-Null
Get-ChildItem -Path (Join-Path $src "server") -Exclude "node_modules" | Copy-Item -Destination $serverStaging -Recurse

Write-Host "Copying client files (excluding node_modules)..."
$clientStaging = Join-Path $staging "client"
New-Item -ItemType Directory -Path $clientStaging | Out-Null
Get-ChildItem -Path (Join-Path $src "client") -Exclude "node_modules" | Copy-Item -Destination $clientStaging -Recurse

Write-Host "Compressing to $zipDest..."
if (Test-Path $zipDest) {
    Remove-Item -Path $zipDest -Force
}

Compress-Archive -Path (Join-Path $staging "*") -DestinationPath $zipDest -CompressionLevel Optimal

Write-Host "Cleaning up staging..."
Remove-Item -Path $staging -Recurse -Force

$zipItem = Get-Item $zipDest
$sizeMB = [math]::Round($zipItem.Length / 1MB, 2)
Write-Host "SUCCESS: Archive created at $($zipItem.FullName) ($sizeMB MB)"
