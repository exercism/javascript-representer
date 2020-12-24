#!/usr/bin/env sh

# Usage:
# ./bin/generate.sh two-fer ~/folder/to/solution
# ./bin/generate.sh two-fer ~/folder/to/solution/input ~/folder/to/representer/output

node -r esm -r module-alias/register ./dist/represent.js "$@"
