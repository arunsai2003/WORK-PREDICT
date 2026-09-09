@echo off
title WorkPredict Dashboard Server
cd /d "%~dp0"
echo Starting WorkPredict Dashboard at http://localhost:5173/ ...
echo Press Ctrl+C to stop the server.
echo.
npm.cmd run dev
pause
