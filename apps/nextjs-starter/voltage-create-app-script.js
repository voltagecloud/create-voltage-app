const chalk = require("chalk");
const { execSync } = require("child_process");
const fs = require("fs");
const { replaceEnvValue } = require("../../src/utils/fs");

const APP_NAME = "NextJS Starter";

function script({ name, apiEndpoint, adminMacaroon, src, dest }) {
  // Copy .env.example to .env and set values
  const exampleEnvPath = `${src}/.env.local.example`;
  const envPath = `${dest}/.env.local`;
  fs.copyFileSync(exampleEnvPath, envPath);
  replaceEnvValue(envPath, "NEXT_PUBLIC_ADMIN_MACAROON", adminMacaroon);
  replaceEnvValue(envPath, "NEXT_PUBLIC_API_ENDPOINT", apiEndpoint);
  // Install dependencies
  console.log(chalk.blue("Installing dependencies..."));
  execSync("npm install", { cwd: dest });
  // Done instructions
  console.log(chalk.green("Done!"));
  // prettier-ignore
  console.log(`
${chalk.gray("Your app is ready! Copy and paste the following to your terminal:")}

${`cd ${dest};`}
${`npm run dev`}

${chalk.gray(`Your app should be available at ${chalk.underline("https://localhost:3000")}`)}`)
}

module.exports = {
  name: APP_NAME,
  script,
};
