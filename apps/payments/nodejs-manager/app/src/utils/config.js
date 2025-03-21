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

// Export configuration
module.exports = {
  organizationId: env.TEAM_ID,
  environmentId: env.ENVIRONMENT_ID,
  apiKey: env.API_KEY,
  baseUrl: env.VOLTAGE_BACKEND_URL,
  walletId: env.WALLET_ID,
  validateConfig: () => {
    if (
      !env.TEAM_ID ||
      !env.ENVIRONMENT_ID ||
      !env.API_KEY ||
      !env.VOLTAGE_BACKEND_URL ||
      !env.WALLET_ID
    ) {
      console.error(
        "Missing required environment variables. Please check your .env file."
      );
      console.error(
        "Required variables: TEAM_ID, ENVIRONMENT_ID, API_KEY, VOLTAGE_BACKEND_URL, WALLET_ID"
      );
      process.exit(1);
    }
  },
};
