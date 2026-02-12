@echo off
echo Limpando cache e locks...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul
if exist ".next" rmdir /s /q ".next"
echo.
echo Cache limpo! Iniciando servidor...
echo.
npm run dev
