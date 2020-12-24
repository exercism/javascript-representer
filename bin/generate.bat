@REM Usage:
@REM ./bin/generate.bat two-fer ~/folder/to/solution
@REM ./bin/generate.bat two-fer ~/folder/to/solution/input ~/folder/to/representer/output

node -r esm -r module-alias/register ./dist/represent.js %*
