#!/usr/bin/env node
const VoltageApi = require("./lib/api");
const apps = require("./lib/apps");
const { decryptMacaroon, base64ToHex } = require("./utils/crypto");
const { input, password } = require("@inquirer/prompts");
const select = require("@inquirer/select").default;
const chalk = require("chalk");

const log = console.log;
const logger = {
  successLog: (str) => log(chalk.green(`✔️ ${str}`)),
  primaryLog: (str) => log(chalk.hex("#FFA500")(`⚡️${str}`)),
};

function truncateStringInMiddle(str, num = 6) {
  if (str.length <= num) {
    return str;
  }
  const start = str.slice(0, num);
  const end = str.slice(str.length - num);
  return `${start}...${end}`;
}

async function run() {
  try {
    // VoltageApi instance
    const api = new VoltageApi({ logger });
    // Prompt for email + password
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
    await api.login({ email, password: pwd });
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
    logger.primaryLog(`LND Version: ${nodeDetails.lnd_version}`);
    logger.primaryLog(`API Endpoint: ${nodeDetails.api_endpoint}`);
    // Get admin macaroon and tls cert
    const { adminMacaroon, tlsCert } = await api.getAdminMacaroonAndTlsCert(
      teamId,
      nodeId
    );
    // Decrypt admin macaroon
    const decryptedMacaroon = decryptMacaroon(adminMacaroon, nodePassword);
    logger.primaryLog(`TLS Cert: ${truncateStringInMiddle(tlsCert)}`);
    logger.primaryLog(
      `Admin Macaroon: ${truncateStringInMiddle(decryptedMacaroon)}`
    );
    // Choose type of app
    const appInit = await select({
      message: "Select a type of application:",
      choices: apps.map((app) => ({
        name: app.name,
        value: app.init,
      })),
    });
    const appName = await input({
      message: "Name of the app:",
      default: "my-voltage-app",
    });
    await appInit({
      name: appName,
      apiEndpoint: `https://${nodeDetails.api_endpoint}:8080`,
      tlsCert,
      adminMacaroon: base64ToHex(decryptedMacaroon),
      logger,
    });
  } catch (e) {
    process.exit(1);
  }
}

run();
