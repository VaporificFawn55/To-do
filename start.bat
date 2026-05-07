@echo off
start "Todo Backend" cmd /k "cd /d "%~dp0todo-server" && npm run dev"
start "Todo Frontend" cmd /k "cd /d "%~dp0todo-client" && npm start"
