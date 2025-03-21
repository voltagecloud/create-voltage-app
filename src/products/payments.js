const { handleLogin, getMacaroonsAndCert } = require("../utils/auth");
const chalk = require("chalk");
const { input } = require("@inquirer/prompts");
const select = require("@inquirer/select").default;
const { Separator } = require("@inquirer/select");
const apps = require("../lib/apps");

async function runFlowB() {
  try {
    // prettier-ignore
    console.log(
    chalk.gray(`
To build a Voltage payment app, you will need an API key for the environment you want to build in.
If you don't have one yet, you can create one in the voltage web dashboard.

Once you have the API key, login and follow the steps below by choosing the options
related to the API key you are using and the wallet you want to build for.
`)
  );

    // Handle login and node selection
    const { api } = await handleLogin();

    // Get teams
    const teams = await api.getTeams();

    // Prompt which team to use
    const teamId = await select({
      message: "Select API Key team:",
      choices: teams.map((team) => ({
        name: team.name,
        value: team.id,
      })),
    });

    const environments = await api.getEnvironments(teamId);
    const wallets = await api.getWallets(teamId);
    // const apiKeys = await api.getApiKeys(teamId);

    if (environments.length === 0) {
      throw new Error(
        "No environments found. Create one first using the voltage web dashboard."
      );
    }

    // Prompt user to select an environment
    const environmentId = await select({
      message: "Select API Key environment:",
      choices: environments.map((env) => ({
        name: env.name,
        value: env.id,
      })),
    });

    const envWallets = wallets.filter(
      (wallet) => wallet.environment_id === environmentId
    );

    if (envWallets.length === 0) {
      throw new Error(
        "No wallets found. Create one first using the voltage web dashboard."
      );
    }

    // Prompt user to select an environment
    const walletId = await select({
      message: "Select wallet for app:",
      choices: envWallets.map((wallet) => ({
        name: wallet.name,
        value: wallet.id,
      })),
    });

    // Request user to input the API key
    const apiKey = await input({ message: "Enter API key:" });

    const categorizedApps = apps("payments");
    const appChoices = [
      new Separator(
        chalk.green(
          "Boilerplates: (basic App scaffolding with Voltage Payments integrated)"
        )
      ),
      ...categorizedApps.Boilerplates.map((app) => ({
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
      voltageBackendUrl: api.baseBackendUrl,
      apiKey,
      walletId,
      teamId,
      environmentId,
    });
    console.log(`
${chalk.hex("#FFC000")(`⚡️Happy hacking!`)}`);
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}
module.exports = runFlowB;
