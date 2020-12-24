#!/usr/bin/env sh

<<<<<<< HEAD
# Usage:
# ./bin/generate.sh two-fer ~/folder/to/solution
# ./bin/generate.sh two-fer ~/folder/to/solution/input ~/folder/to/representer/output
=======
# Alias of generate.sh
#
# Usage:
# ./bin/run.sh two-fer ~/folder/to/solution
# ./bin/run.sh two-fer ~/folder/to/solution/input ~/folder/to/representer/output
>>>>>>> b99c491 (Add aliases and update interface commentary)

node -r esm -r module-alias/register ./dist/represent.js "$@"
