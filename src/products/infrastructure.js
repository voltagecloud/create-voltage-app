const { handleLogin, getMacaroonsAndCert } = require("../utils/auth");
const apps = require("../lib/apps");
const { input } = require("@inquirer/prompts");
const select = require("@inquirer/select").default;
const { Separator } = require("@inquirer/select");
const chalk = require("chalk");

async function runInfrastructure() {
  try {
    console.log(
      chalk.gray(`
Great! Now lets log you into your Voltage account.
      `)
    );

    // Handle login and node selection
    const { api } = await handleLogin();

    // Get teams
    const teams = await api.getTeams();

    // Prompt which team to use
    const teamId = await select({
      message: "Select a team:",
      choices: teams.map((team) => ({
        name: team.name,
        value: team.id,
      })),
    });

    // Get nodes
    const nodes = await api.getNodes(teamId);
    if (nodes.length === 0) {
      throw new Error(
        "No nodes found in the selected team. Please create one first."
      );
    }

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

    // Get macaroons and certs
    const { readMacaroon, invoiceMacaroon, tlsCert, apiEndpoint } =
      await getMacaroonsAndCert(api, teamId, nodeId, nodeDetails, nodePassword);

    const categorizedApps = apps("infrastructure");
    const appChoices = [
      new Separator(
        chalk.green(
          "Boilerplates: (basic App scaffolding with Voltage integrated)"
        )
      ),
      ...categorizedApps.Boilerplates.map((app) => ({
        name: `  ${app.name}`,
        value: app,
      })),
      new Separator(
        chalk.green(
          "Templates: (fully featured App templates that use Voltage)"
        )
      ),
      ...categorizedApps.Templates.map((app) => ({
        name: `  ${app.name}`,
        value: app,
      })),
    ];

    const app = await select({
      message: "Select an app:",
      choices: appChoices,
      loop: false, // This prevents the infinite scroll
    });
    const appName = await input({
      message: "Name of the app:",
      default: "my-voltage-app",
    });
    await app.script({
      name: appName,
      apiEndpoint,
      readMacaroon,
      invoiceMacaroon,
      tlsCert,
    });
    console.log(`
${chalk.hex("#FFC000")(`⚡️Happy hacking!`)}`);
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}

module.exports = runInfrastructure;
