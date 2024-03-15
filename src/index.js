#!/usr/bin/env node
const VoltageApi = require("./lib/api");
const apps = require("./lib/apps");
const { decryptMacaroon, base64ToHex } = require("./utils/crypto");
const { input, password } = require("@inquirer/prompts");
const { getPackageJsonVersion } = require("./utils/fs");
const select = require("@inquirer/select").default;
const chalk = require("chalk");

async function run() {
  const packageVersion = await getPackageJsonVersion();
  // prettier-ignore
  console.log(`
${chalk.hex("#FFA500")(`Welcome to create-voltage-app!`)} ${chalk.green(`(version: ${packageVersion})`)}
`);
  // prettier-ignore
  console.log(
    chalk.gray(`This tool will help you get started with creating lightning powered apps that connect to your voltage node.
Make sure you have a voltage account, team and node setup. You can signup for free at ${chalk.underline('https://app.voltage.cloud')}.
    `)
  );
  try {
    // VoltageApi instance
    const api = new VoltageApi({});
    // Prompt for email and password
    const email =
      process.env.VOLTAGE_EMAIL ||
      (await input({
        message: "Email:",
      }));
    const pwd =
      process.env.VOLTAGE_PASSWORD ||
      (await password({
        message: "Password:",
      }));
    // Login
    const result = await api.login({ email, password: pwd });
    if (result?.token) {
      const mfaCode = await input({
        message: "Authenticator code:",
      });
      await api.mfaLogin({ code: mfaCode, token: result.token, email });
    }
    // Get teams
    await api.getTeams();
    // Promp which team to use
    const teamId = await select({
      message: "Select a team:",
      choices: api.teams.map((team) => ({
        name: team.name,
        value: team.id,
      })),
    });
    // Get nodes
    const nodes = await api.getNodes(teamId);
    // Prompt which lnd node to use
    const nodeId = await select({
      message: "Select a node:",
      choices: nodes
        .filter((n) => n.node_type === "lnd")
        .map((n) => ({
          name: n.node_name,
          value: n.node_id,
        })),
    });
    // Get node details
    const nodeDetails = await api.getNodeDetails(teamId, nodeId);
    // Prompt node password
    const nodePassword =
      process.env.VOLTAGE_NODE_PASSWORD ||
      (await password({
        message: "Node password:",
      }));
    // Get admin macaroon
    const { adminMacaroon } = await api.getAdminMacaroonAndTlsCert(
      teamId,
      nodeId
    );
    // Decrypt admin macaroon
    const decryptedMacaroon = decryptMacaroon(adminMacaroon, nodePassword);
    // Choose type of app
    const app = await select({
      message: "Select an app:",
      choices: apps.map((app) => ({
        name: app.name,
        value: app,
      })),
    });
    const appName = await input({
      message: "Name of the app:",
      default: "my-voltage-app",
    });
    await app.script({
      name: appName,
      apiEndpoint: `https://${nodeDetails.api_endpoint}:8080`,
      adminMacaroon: base64ToHex(decryptedMacaroon),
    });
    console.log(`
${chalk.hex("#FFA500")(`⚡️Happy hacking!`)}`);
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}

run();
