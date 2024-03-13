#!/usr/bin/env node
const VoltageApi = require("./lib/api");
const { decryptMacaroon } = require("./lib/utils");
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
    const email = await input({
      message: "Email:",
      default: "joao.mesquita@voltage.cloud",
    });
    const pwd = await password({
      message: "Password:",
      // default: "mornaj-xoFvyp-6ximxu",
    });
    // Login
    await api.login({ email, password: pwd });
    await api.getTeams();
    const teamId = await select({
      message: "Select a team:",
      choices: api.teams.map((team) => ({
        name: team.name,
        value: team.id,
      })),
    });
    const nodes = await api.getNodes(teamId);
    const nodeId = await select({
      message: "Select a node:",
      choices: nodes
        .filter((n) => n.node_type === "lnd")
        .map((n) => ({
          name: n.node_name,
          value: n.node_id,
        })),
    });
    const nodeDetails = await api.getNodeDetails(teamId, nodeId);
    const nodePassword = await password({
      message: "Node password:",
    });
    logger.primaryLog(`LND Version: ${nodeDetails.lnd_version}`);
    const { adminMacaroon, tlsCert } = await api.getAdminMacaroonAndTlsCert(
      teamId,
      nodeId
    );
    const decryptedMacaroon = decryptMacaroon(adminMacaroon, nodePassword);
    logger.primaryLog(`TLS Cert: ${truncateStringInMiddle(tlsCert)}`);
    logger.primaryLog(
      `Admin Macaroon: ${truncateStringInMiddle(decryptedMacaroon)}`
    );
  } catch (e) {
    process.exit(1);
  }
}

run();
