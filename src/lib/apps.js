const {
  getRootDirectory,
  copyDirectory,
  replaceEnvValue,
} = require("../utils/fs");

const ROOT_DIR = getRootDirectory();

async function initSvelteKit(opts) {
  const source = `${ROOT_DIR}/apps/voltage-svelte-ts-app`;
  const destination = `${process.cwd()}/${opts.name}`;
  await copyDirectory(source, destination);

  // Replace .env values
  replaceEnvValue(
    `${destination}/.env`,
    "VITE_ADMIN_MACAROON",
    opts.adminMacaroon
  );
  replaceEnvValue(`${destination}/.env`, "VITE_TLS_CERT", opts.tlsCert);
  replaceEnvValue(`${destination}/.env`, "VITE_API_ENDPOINT", opts.apiEndpoint);
  // Copy values to the .env file

  // --- Install, run and open the app...
  // const { exec } = require("child_process");

  // TODO: TEST THIS
  // exec("npm install", (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`exec error: ${error}`);
  //     return;
  //   }
  //   console.log(`stdout: ${stdout}`);
  //   console.error(`stderr: ${stderr}`);
  // });
  // const devProcess = exec("npm run dev", { cwd: destination });

  // devProcess.stdout.on("data", (data) => {
  //   console.log(`stdout: ${data}`);
  // });

  // devProcess.stderr.on("data", (data) => {
  //   console.error(`stderr: ${data}`);
  // });

  // devProcess.on("error", (error) => {
  //   console.error(`Error executing command: ${error}`);
  // });

  // devProcess.on("close", (code) => {
  //   console.log(`Child process exited with code ${code}`);
  // });

  // const openProcess = exec("open http://localhost:3000", { cwd: destination });

  // openProcess.stdout.on("data", (data) => {
  //   console.log(`stdout: ${data}`);
  // });

  // openProcess.stderr.on("data", (data) => {
  //   console.error(`stderr: ${data}`);
  // });

  // openProcess.on("error", (error) => {
  //   console.error(`Error executing command: ${error}`);
  // });

  // openProcess.on("close", (code) => {
  //   console.log(`Child process exited with code ${code}`);
  // });
}

const apps = [
  {
    id: "sveltekit",
    name: "SvelteKit Boilerplate",
    init: initSvelteKit,
  },
];

module.exports = apps;
