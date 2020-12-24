@REM Usage:
@REM ./bin/remote.bat https://exercism.io/tracks/javascript/exercises/two-fer/solutions/df3bb5d7131c44ea9c62206cc8d6c225
@REM ./bin/remote.sh https://exercism.io/tracks/javascript/exercises/two-fer/solutions/df3bb5d7131c44ea9c62206cc8d6c225 ~/folder/to/representer/output
@REM
@REM Solution URL can be:
@REM - published solution: https://exercism.io/tracks/javascript/exercises/two-fer/solutions/df3bb5d7131c44ea9c62206cc8d6c225
@REM - own solution: https://exercism.io/my/solutions/df3bb5d7131c44ea9c62206cc8d6c225
@REM - mentor solution: https://exercism.io/mentor/solutions/df3bb5d7131c44ea9c62206cc8d6c225
@REM - private solution: https://exercism.io/solutions/df3bb5d7131c44ea9c62206cc8d6c225

node -r esm -r module-alias/register ./dist/remote-represent.js __remote__ %*
