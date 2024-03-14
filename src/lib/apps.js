const {
  getRootDirectory,
  copyDirectory,
  replaceEnvValue,
} = require("../utils/fs");
const { execSync } = require("child_process");
const chalk = require("chalk");
const ROOT_DIR = getRootDirectory();

async function initSvelteKit(opts) {
  const source = `${ROOT_DIR}/apps/voltage-svelte-ts-app`;
  const destination = `${process.cwd()}/${opts.name}`;
  await copyDirectory(source, destination);
  // copyDirectory also just copies files
  // we need to copy the .env.example to .env because npm publish won't include .env files
  await copyDirectory(`${destination}/.env.example`, `${destination}/.env`);

  // Replace .env values
  replaceEnvValue(
    `${destination}/.env`,
    "VITE_ADMIN_MACAROON",
    opts.adminMacaroon
  );
  replaceEnvValue(`${destination}/.env`, "VITE_TLS_CERT", opts.tlsCert);
  replaceEnvValue(`${destination}/.env`, "VITE_API_ENDPOINT", opts.apiEndpoint);

  console.log(chalk.blue("Installing dependencies..."));
  execSync("npm install", { cwd: destination });
  console.log(chalk.green("Done!"));
  // prettier-ignore
  console.log(`
${chalk.gray("Your app is ready! Copy and paste the following to your terminal:")}

${`cd ${destination};`}
${`npm run dev -- --open;`}

${chalk.gray(`Your browser should automatically open the app at ${chalk.underline("https://localhost:3000")}`)}

${chalk.hex("#FFA500")(`⚡️Happy hacking!`)}`)
}

const apps = [
  {
    id: "sveltekit",
    name: "SvelteKit Boilerplate",
    init: initSvelteKit,
  },
];

module.exports = apps;
