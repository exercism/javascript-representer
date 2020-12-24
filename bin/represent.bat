@REM Alias of generate.bat
@REM
@REM Usage:
@REM ./bin/represent.bat two-fer ~/folder/to/solution
@REM ./bin/represent.bat two-fer ~/folder/to/solution/input ~/folder/to/representer/output

node -r esm -r module-alias/register ./dist/represent.js %*
