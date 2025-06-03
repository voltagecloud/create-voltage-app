const fs = require("fs");
const path = require("path");

/**
 * Simple function to load environment variables from .env file
 * @returns {Object} Environment variables as key-value pairs
 */
function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, "../../.env");
    const envContent = fs.readFileSync(envPath, "utf8");
    const envVars = {};

    envContent.split("\n").forEach((line) => {
      // Skip empty lines and comments
      if (!line || line.startsWith("#")) return;

      const [key, value] = line.split("=");
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });

    return envVars;
  } catch (error) {
    console.error("Error loading .env file:", error.message);
    return {};
  }
}

// Load environment variables
const env = loadEnv();

// Export configuration using SDK-compatible names
module.exports = {
  // SDK configuration
  apiKey: env.VOLTAGE_API_KEY,
  baseUrl: env.VOLTAGE_BASE_URL || 'https://voltageapi.com/v1',
  timeout: parseInt(env.VOLTAGE_TIMEOUT || '30000'),
  
  // Application-specific configuration
  organizationId: env.VOLTAGE_ORGANIZATION_ID,
  environmentId: env.VOLTAGE_ENVIRONMENT_ID,
  walletId: env.VOLTAGE_WALLET_ID,
  
  validateConfig: () => {
    if (
      !env.VOLTAGE_API_KEY ||
      !env.VOLTAGE_ORGANIZATION_ID ||
      !env.VOLTAGE_ENVIRONMENT_ID ||
      !env.VOLTAGE_WALLET_ID
    ) {
      console.error(
        "Missing required environment variables. Please check your .env file."
      );
      console.error(
        "Required variables: VOLTAGE_API_KEY, VOLTAGE_ORGANIZATION_ID, VOLTAGE_ENVIRONMENT_ID, VOLTAGE_WALLET_ID"
      );
      process.exit(1);
    }
  },
};