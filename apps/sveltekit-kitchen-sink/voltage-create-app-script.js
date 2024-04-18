const chalk = require("chalk");
const fs = require("fs");
const { replaceEnvValue } = require("../../src/utils/fs");

const APP_NAME = "SvelteKit Kitchen Sink";

function script({ name, apiEndpoint, adminMacaroon, src, dest }) {
  // Copy .env.example to .env and set values
  const exampleEnvPath = `${src}/.env.example`;
  const envPath = `${dest}/.env`;
  fs.copyFileSync(exampleEnvPath, envPath);
  replaceEnvValue(envPath, "VITE_ADMIN_MACAROON", adminMacaroon);
  replaceEnvValue(envPath, "VITE_API_ENDPOINT", apiEndpoint);
  // prettier-ignore
  console.log(`
${chalk.gray("Your app is ready! Copy and paste the following to your terminal:")}

${`cd ${dest};`}
${`npm install;`}
${`npm run dev -- --open;`}

${chalk.gray(`You'll need to have Node.js and npm installed in your system in order to install & run the app`)}
${chalk.gray(`After running, your browser should automatically open the app at ${chalk.underline("https://localhost:3000")}`)}`)
}

module.exports = {
  name: APP_NAME,
  script,
};
