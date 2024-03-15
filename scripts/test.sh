#!/bin/bash

# This script is used to test the Voltage CLI with
# environment variable overrides.

# Set environment variables from .env
source .env

# Export all variables
for var in $(grep -v '^#' .env | sed -E 's/(.*)=.*/\1/') ; do
    export "$var"
done

# Run the command to create a Voltage application
npx create-voltage-app