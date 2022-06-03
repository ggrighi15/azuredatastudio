@echo off
setlocal

title VSCode Dev

pushd %~dp0\..

:: Node modules
if not exist node_modules call yarn

for /f "tokens=2 delims=:," %%a in ('findstr /R /C:"\"nameShort\":.*" product.json') do set NAMESHORT=%%~a
set NAMESHORT=%NAMESHORT: "=%
set NAMESHORT=%NAMESHORT:"=%.exe
set CODE=".build\electron\%NAMESHORT%"

:: Download Electron if needed
node build\lib\electron.js
if %errorlevel% neq 0 node .\node_modules\gulp\bin\gulp.js electron

:: Sync built-in extensions
node build\lib\builtInExtensions.js

:: Build
if not exist out node .\node_modules\gulp\bin\gulp.js compile --max_old_space_size=4095

:: Configuration
set NODE_ENV=development
set VSCODE_DEV=1
set VSCODE_CLI=1
set ELECTRON_DEFAULT_ERROR_MODE=1
set ELECTRON_ENABLE_LOGGING=1
set ELECTRON_ENABLE_STACK_DUMPING=1

:: Launch Code

:: Use the following to get v8 tracing:
:: %CODE% --js-flags="--trace-hydrogen --trace-phase=Z --trace-deopt --code-comments --hydrogen-track-positions --redirect-code-traces" . %*

%CODE% . %* --remote-debugging-port=9222 -r --server=AALAB03-2K8 --database=AdventureWorks --user=sa --command=notebook.command.new

popd

endlocal
