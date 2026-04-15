@echo off
cd /d "C:\Users\for\OneDrive\바탕 화면\boss-travel-app"
start cmd /k "npm run dev"
timeout /t 5
start http://localhost:3000/ko
exit