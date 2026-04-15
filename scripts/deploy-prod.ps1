$ErrorActionPreference = "Stop"

Write-Host "== boss-travel-app3 production deploy ==" -ForegroundColor Cyan

Write-Host "`n[1/5] Install (with devDeps for quality checks)..." -ForegroundColor Yellow
npm ci

Write-Host "`n[2/5] Quality gate (lint + typecheck + build)..." -ForegroundColor Yellow
npm test

Write-Host "`n[3/5] Remove devDependencies to save disk..." -ForegroundColor Yellow
npm prune --omit=dev

Write-Host "`n[4/5] Clean rebuildable caches (keep build output)..." -ForegroundColor Yellow
npm run clean:cache

Write-Host "`n[5/5] Done. Start the server with: npm run start" -ForegroundColor Green

