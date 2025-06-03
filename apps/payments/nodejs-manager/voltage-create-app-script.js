const chalk = require("chalk");
const fs = require("fs");
const { replaceEnvValue } = require("../../../src/utils/fs");

const APP_NAME = "Backend Starter - Node.js";

function script({
  voltageBackendUrl,
  apiKey,
  walletId,
  teamId,
  environmentId,
  src,
  dest,
}) {
  // Copy .env.example to .env and set values
  const exampleEnvPath = `${src}/.env.example`;
  const envPath = `${dest}/.env`;
  fs.copyFileSync(exampleEnvPath, envPath);
  
  // Map to new SDK-compatible environment variable names
  replaceEnvValue(envPath, "VOLTAGE_BASE_URL", voltageBackendUrl);
  replaceEnvValue(envPath, "VOLTAGE_API_KEY", apiKey);
  replaceEnvValue(envPath, "VOLTAGE_WALLET_ID", walletId);
  replaceEnvValue(envPath, "VOLTAGE_ORGANIZATION_ID", teamId);
  replaceEnvValue(envPath, "VOLTAGE_ENVIRONMENT_ID", environmentId);
  
  // prettier-ignore
  console.log(`
${chalk.gray("Your app is ready! Copy and paste the following to your terminal:")}

${`cd ${dest};`}
${`npm install;`}
${`npm start;`}

${chalk.gray(`You'll need to have Node.js installed in your system in order to run the app.`)}
${chalk.gray(`The app now uses the official Voltage API SDK for better reliability and type safety.`)}`);
}

module.exports = {
  name: APP_NAME,
  script,
};