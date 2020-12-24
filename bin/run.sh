#!/usr/bin/env sh

# Alias of generate.sh
#
# Usage:
# ./bin/run.sh two-fer ~/folder/to/solution
# ./bin/run.sh two-fer ~/folder/to/solution/input ~/folder/to/representer/output

node -r esm -r module-alias/register ./dist/represent.js "$@"
