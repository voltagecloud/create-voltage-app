const chalk = require("chalk");
const fs = require("fs");
const { replaceEnvValue } = require("../../src/utils/fs");

const APP_NAME = "Backend Starter - Node.js";

function script({ name, apiEndpoint, adminMacaroon, src, dest }) {
  // Copy .env.example to .env and set values
  const exampleEnvPath = `${src}/.env.example`;
  const envPath = `${dest}/.env`;
  fs.copyFileSync(exampleEnvPath, envPath);
  replaceEnvValue(envPath, "ADMIN_MACAROON", adminMacaroon);
  replaceEnvValue(envPath, "API_ENDPOINT", apiEndpoint);
  // prettier-ignore
  console.log(`
${chalk.gray("Your app is ready! Copy and paste the following to your terminal:")}

${`cd ${dest};`}
${`node --env-file=.env index.js;`}

${chalk.gray(`You'll need to have Node.js installed in your system in order to run the app.`)}
${chalk.gray(`You should eventually see an output in the terminal with your node's admin macaroon and api endpoint.`)}`)
}

module.exports = {
  name: APP_NAME,
  script,
};
