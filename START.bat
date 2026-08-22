@echo off
setlocal enabledelayedexpansion
title Asure AI Research Showcase

rem ===========================================================================
rem  Double-click this to work on the showcase.
rem
rem  It regenerates the catalogue and media manifests from what is on disk,
rem  starts the site and the admin, and opens both in a browser.
rem
rem  Close this window to stop everything.
rem ===========================================================================

rem cmd.exe refuses a UNC path as the current directory, and this folder lives
rem on a mapped network drive, so a launch that resolves Y: back to
rem \server\share would fail here with "CMD does not support UNC paths".
rem pushd maps a temporary drive letter for exactly that case; cd /d does not.
pushd "%~dp0" || (echo   Could not open the project folder. & pause & exit /b 1)

set SITE_PORT=8099
set ADMIN_PORT=8787

echo.
echo   ASURE  ^|  AI Research ^& Innovation
echo   ----------------------------------------------------------------
echo.

rem --- find a Python -------------------------------------------------------
set PY=
for %%P in (py.exe) do if not defined PY if exist "%%~$PATH:P" set PY=py -3
if not defined PY for %%P in (python.exe) do if not defined PY if exist "%%~$PATH:P" set PY=python
if not defined PY (
  echo   Python was not found on PATH.
  echo   Install it from https://python.org and tick "Add Python to PATH".
  echo.
  pause
  popd & exit /b 1
)
for /f "tokens=*" %%V in ('%PY% -c "import sys;print(sys.version.split()[0])" 2^>nul') do set PYVER=%%V
echo   Python %PYVER%

rem --- Pillow is only needed to resize uploads -----------------------------
%PY% -c "import PIL" >nul 2>&1
if errorlevel 1 (
  echo   Pillow  not installed - uploads will be stored without resizing
  echo           ^(install with: %PY% -m pip install pillow^)
) else (
  echo   Pillow  ready
)

rem --- regenerate from disk ------------------------------------------------
echo.
echo   Rebuilding from content\ and projects\ ...
%PY% "_tools\build_content.py"
if errorlevel 1 (
  echo.
  echo   A record failed validation. Fix the file listed above, then run this again.
  echo   Nothing was published.
  echo.
  pause
  popd & exit /b 1
)
%PY% "_tools\build_media_manifest.py"

rem --- start the two servers ----------------------------------------------
echo.
echo   Starting servers ...
start "Asure site"  /min cmd /c %PY% _tools\serve.py %SITE_PORT%
start "Asure admin" /min cmd /c %PY% _tools\admin.py %ADMIN_PORT%

rem Give them a moment to bind before the browser asks for a page.
%PY% -c "import time;time.sleep(1.6)" >nul 2>&1

start "" "http://127.0.0.1:%SITE_PORT%/index.html"
start "" "http://127.0.0.1:%ADMIN_PORT%/"

echo.
echo   ----------------------------------------------------------------
echo     Site        http://127.0.0.1:%SITE_PORT%/index.html
echo     Media desk  http://127.0.0.1:%SITE_PORT%/cms.html
echo     Admin       http://127.0.0.1:%ADMIN_PORT%/
echo   ----------------------------------------------------------------
echo.
echo   The admin writes into this folder and has no login, so it is bound
echo   to 127.0.0.1 only. Do not expose it beyond this machine.
echo.
echo   Press any key to stop the servers and close.
pause >nul

rem --- stop only the servers this script started ---------------------------
taskkill /FI "WINDOWTITLE eq Asure site*"  /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Asure admin*" /T /F >nul 2>&1
echo   Stopped.
popd
endlocal
