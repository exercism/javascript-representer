#!/usr/bin/env sh

# Usage:
# ./bin/represent.sh two-fer ~/folder/to/solution

node -r esm -r module-alias/register ./dist/represent.js "$@"
