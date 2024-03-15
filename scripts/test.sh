#!/bin/bash

# This script is used to test the Voltage CLI with
# environment variable overrides.

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Set environment variables from .env
source "$SCRIPT_DIR/../.env"

# Export all variables
for var in $(grep -v '^#' "$SCRIPT_DIR/../.env" | sed -E 's/(.*)=.*/\1/') ; do
    export "$var"
done

# Run the command to create a Voltage application
node "$SCRIPT_DIR/../src/index.js"