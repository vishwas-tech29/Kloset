@echo off
echo Installing AI Feature Packages...
echo.

echo [1/3] Installing AI APIs...
call npm install replicate openai @anthropic-ai/sdk ai @ai-sdk/anthropic

echo.
echo [2/3] Installing UI Libraries...
call npm install fabric @mediapipe/pose react-webcam three @react-three/fiber @react-three/drei react-compare-slider react-dropzone html2canvas jspdf

echo.
echo [3/3] Installing Utilities...
call npm install sharp uuid

echo.
echo ✅ All packages installed!
echo.
echo Next steps:
echo 1. Add API keys to .env.local
echo 2. Run: npx prisma db push
echo 3. Start dev server: npm run dev
pause
