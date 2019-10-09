@REM Usage:
@REM ./bin/represent.bat two-fer ~/test/

node -r esm -r module-alias/register ./dist/represent.js %*
