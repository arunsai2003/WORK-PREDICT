@echo off
title WorkPredict Pro Dev Server
cd /d "%~dp0"
echo ===================================================
echo Starting WorkPredict Pro Development Server...
echo ===================================================
start http://localhost:5173
call npm.cmd run dev
pause
