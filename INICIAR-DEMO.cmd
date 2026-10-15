@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Instale o Node.js 24 para executar esta demonstracao.
  pause
  exit /b 1
)
if not exist "node_modules\vite" (
  call npm ci
  if errorlevel 1 (
    echo Nao foi possivel instalar as dependencias.
    pause
    exit /b 1
  )
)
echo Mantenha esta janela aberta enquanto utiliza a demonstracao.
call npm run dev -- --open
pause
