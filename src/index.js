#!/usr/bin/env node
const runInfrastructure = require("./products/infrastructure");
const runPayments = require("./products/payments");
const { getPackageJsonVersion } = require("./utils/fs");
const select = require("@inquirer/select").default;
const chalk = require("chalk");

async function run() {
  const packageVersion = await getPackageJsonVersion();
  // prettier-ignore
  console.log(`
${chalk.hex("#FFC000")(`Welcome to create-voltage-app!`)} ${chalk.green(`(version: ${packageVersion})`)}
`);
  // prettier-ignore
  console.log(
    chalk.gray(`This tool will help you get started with creating lightning powered apps using Voltage.
First, lets choose which voltage product you want to use.
    `)
  );

  try {
    // Prompt user to select which product to use
    const selectedProduct = await select({
      message: "Choose a product:",
      choices: [
        {
          name: "Infrastructure - Build an app that connects to your own lightning node hosted with Voltage",
          value: "product-infrastructure",
        },
        {
          name: "Payments - Build an app using our simplified payments API",
          value: "product-payments",
        },
      ],
    });

    // Run the selected flow
    if (selectedProduct === "product-infrastructure") {
      await runInfrastructure();
    } else if (selectedProduct === "product-payments") {
      await runPayments();
    }
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}

run();
