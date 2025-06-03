#!/usr/bin/env node
const config = require("./src/utils/config");
const { createMenu } = require("./src/menu/menuHandler");

// Validate environment variables before starting
config.validateConfig();

// Start the menu
createMenu();
