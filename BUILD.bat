@echo off
setlocal
title Build - Asure AI Research Showcase

rem ===========================================================================
rem  Build the whole site into one self-contained file:
rem
rem      dist\asure-showcase.html
rem
rem  Every stylesheet, script, logo, wordmark and screenshot is inlined, so it
rem  opens with no server -- email it, put it on a stick, drop it on a laptop
rem  that has never seen this project.
rem
rem  Two things do not travel, both on purpose:
rem    - the UI kit pulls Inter and JetBrains Mono from Google Fonts, so with
rem      no connection the type falls back to Segoe UI. Everything else is
rem      inlined and the layout is unchanged.
rem    - the live demos are separate HTML files. The single file says so
rem      rather than linking to a 404.
rem ===========================================================================

rem cmd.exe refuses a UNC path as the current directory, and this folder lives
rem on a mapped network drive, so a launch that resolves Y: back to
rem \server\share would fail here with "CMD does not support UNC paths".
rem pushd maps a temporary drive letter for exactly that case; cd /d does not.
pushd "%~dp0" || (echo   Could not open the project folder. & pause & exit /b 1)

set PY=
for %%P in (py.exe) do if not defined PY if exist "%%~$PATH:P" set PY=py -3
if not defined PY for %%P in (python.exe) do if not defined PY if exist "%%~$PATH:P" set PY=python
if not defined PY (
  echo   Python was not found on PATH.
  pause
  popd & exit /b 1
)

echo.
echo   Regenerating from disk ...
%PY% "_tools\build_content.py"
if errorlevel 1 (
  echo.
  echo   A record failed validation - nothing was built.
  pause
  popd & exit /b 1
)
%PY% "_tools\build_media_manifest.py"

echo.
echo   Bundling ...
%PY% "_tools\build_single_file.py"
if errorlevel 1 (
  echo.
  echo   Build failed.
  pause
  popd & exit /b 1
)

echo.
echo   ----------------------------------------------------------------
echo     dist\asure-showcase.html
echo   ----------------------------------------------------------------
echo.
choice /c YN /n /m "  Open it now? [Y/N] "
if errorlevel 2 goto end
start "" "dist\asure-showcase.html"

:end
popd
endlocal
