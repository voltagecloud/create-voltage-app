const chalk = require("chalk");
const fs = require("fs");
const { replaceEnvValue } = require("../../src/utils/fs");

const APP_NAME = "Voltage Tipper - Next.js";

function script({ name, apiEndpoint, readMacaroon, invoiceMacaroon, tlsCert, src, dest }) {
  // Copy .env.example to .env and set values
  const exampleEnvPath = `${src}/.env.example`;
  const envPath = `${dest}/.env`;
  fs.copyFileSync(exampleEnvPath, envPath);
  replaceEnvValue(envPath, "NEXT_PUBLIC_READ_MACAROON", readMacaroon);
  replaceEnvValue(envPath, "NEXT_PUBLIC_INVOICE_MACAROON", invoiceMacaroon);
  replaceEnvValue(envPath, "NEXT_PUBLIC_HOST", apiEndpoint);
  // prettier-ignore
  console.log(`
${chalk.gray("Your app is ready! Copy and paste the following to your terminal:")}

${`cd ${dest};`}
${`npm install;`}
${`npm run dev;`}

${chalk.gray(`You'll need to have Node.js installed in your system in order to run the app.`)}
${chalk.gray(`After running, your app should be available at ${chalk.underline("https://localhost:3000")}`)}`
  )

}

module.exports = {
  name: APP_NAME,
  script,
};