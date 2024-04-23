const chalk = require("chalk");
const { execSync } = require("child_process");
const fs = require("fs");
const { replaceEnvValue } = require("../../src/utils/fs");

const APP_NAME = "Mobile App Starter - Expo React Native";

function script({ name, apiEndpoint, adminMacaroon, src, dest }) {
  // Copy .env.example to .env and set values
  const exampleEnvPath = `${src}/.env.example`;
  const envPath = `${dest}/.env`;
  fs.copyFileSync(exampleEnvPath, envPath);
  replaceEnvValue(envPath, "EXPO_PUBLIC_ADMIN_MACAROON", adminMacaroon);
  replaceEnvValue(envPath, "EXPO_PUBLIC_API_ENDPOINT", apiEndpoint);
  // prettier-ignore
  console.log(`
${chalk.gray("Your app is ready! Copy and paste the following to your terminal:")}

${`cd ${dest};`}
${`npm install;`}
${`npx expo start;`}

${chalk.gray(`You'll need to have Node.js and npm installed in your system in order to install & run the app`)}
${chalk.gray("Once it's running, you can choose to run the app on a real device using the Expo app (install via your phone's app store) or on a local simulator if you have the necessary SDKs setup")}`)
}

module.exports = {
  name: APP_NAME,
  script,
};
