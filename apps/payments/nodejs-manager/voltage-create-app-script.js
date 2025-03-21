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
  replaceEnvValue(envPath, "VOLTAGE_BACKEND_URL", voltageBackendUrl);
  replaceEnvValue(envPath, "API_KEY", apiKey);
  replaceEnvValue(envPath, "WALLET_ID", walletId);
  replaceEnvValue(envPath, "TEAM_ID", teamId);
  replaceEnvValue(envPath, "ENVIRONMENT_ID", environmentId);
  // prettier-ignore
  console.log(`
${chalk.gray("Your app is ready! Copy and paste the following to your terminal:")}

${`cd ${dest};`}
${`node --env-file=.env index.js;`}

${chalk.gray(`You'll need to have Node.js installed in your system in order to run the app.`)}
${chalk.gray(`You should eventually see an output in the terminal with your node's admin macaroon and api endpoint.`)}`);
}

module.exports = {
  name: APP_NAME,
  script,
};
