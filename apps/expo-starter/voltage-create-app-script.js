const chalk = require("chalk");
const { execSync } = require("child_process");
const fs = require("fs");
const { replaceEnvValue } = require("../../src/utils/fs");

const APP_NAME = "Expo Starter (React Native)";

function script({ name, apiEndpoint, adminMacaroon, src, dest }) {
  // Copy .env.example to .env and set values
  const exampleEnvPath = `${src}/.env.example`;
  const envPath = `${dest}/.env`;
  fs.copyFileSync(exampleEnvPath, envPath);
  replaceEnvValue(envPath, "EXPO_PUBLIC_ADMIN_MACAROON", adminMacaroon);
  replaceEnvValue(envPath, "EXPO_PUBLIC_API_ENDPOINT", apiEndpoint);
  // Install dependencies
  console.log(chalk.blue("Installing dependencies..."));
  execSync("npm install", { cwd: dest, stdio: "ignore" });
  // Done instructions
  console.log(chalk.green("Done!"));
  // prettier-ignore
  console.log(`
${chalk.gray("Your app is ready! Copy and paste the following to your terminal:")}

${`cd ${dest};`}
${`npx expo start`}

${chalk.gray("Scan the QR code on the Expo app on your phone or run it in a simulator if you have the necessary SDKs setup")}`)
}

module.exports = {
  name: APP_NAME,
  script,
};
