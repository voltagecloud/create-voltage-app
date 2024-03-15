const chalk = require("chalk");
const { execSync } = require("child_process");
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
  // Install dependencies
  console.log(chalk.blue("Installing dependencies..."));
  execSync("npm install", { cwd: dest });
  // Done instructions
  console.log(chalk.green("Done!"));
  // prettier-ignore
  console.log(`
${chalk.gray("Your app is ready! Copy and paste the following to your terminal:")}

${`cd ${dest};`}
${`npm run dev -- --open;`}

${chalk.gray(`Your browser should automatically open the app at ${chalk.underline("https://localhost:3000")}`)}`)
}

module.exports = {
  name: APP_NAME,
  script,
};
