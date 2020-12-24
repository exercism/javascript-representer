#!/usr/bin/env sh

# Alias of generate.sh
#
# Usage:
# ./bin/represent.sh two-fer ~/folder/to/solution
# ./bin/represent.sh two-fer ~/folder/to/solution/input ~/folder/to/representer/output

node -r esm -r module-alias/register ./dist/represent.js "$@"
