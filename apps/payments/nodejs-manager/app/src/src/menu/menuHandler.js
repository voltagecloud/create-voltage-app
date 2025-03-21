const readline = require("readline");
const api = require("../api/voltageApi");
const config = require("../utils/config");

/**
 * Waits for a keypress and then returns to the menu
 * @param {readline.Interface} rl - Readline interface
 */
function waitForKeyPress(rl) {
  console.log("\nPress Enter to return to the menu...");
  rl.question("", () => {
    rl.close();
    createMenu();
  });
}

/**
 * Create a terminal menu system
 */
function createMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Clear the console
  console.clear();

  // Display header
  console.log("\x1b[36m%s\x1b[0m", "======================================");
  console.log("\x1b[36m%s\x1b[0m", "       VOLTAGE PAYMENTS MANAGER       ");
  console.log("\x1b[36m%s\x1b[0m", "======================================");
  console.log();

  // Info
  console.log("\x1b[33m%s\x1b[0m", "Info:");
  console.log(`API URL: ${config.baseUrl}`);
  console.log(`Organization ID: ${config.organizationId}`);
  console.log(`Environment ID: ${config.environmentId}`);
  console.log(`Wallet ID: ${config.walletId}`);
  console.log();

  // Display menu options
  console.log("\x1b[33m%s\x1b[0m", "Menu Options:");
  console.log("1. List All Wallets");
  console.log("2. Get Wallet Details");
  console.log("3. Get Wallet Ledger");
  console.log("4. Create Bolt11 Invoice");
  console.log("5. Create Onchain Address");
  console.log("6. List All Payments");
  console.log("7. Exit");
  console.log();

  rl.question("\x1b[32m>\x1b[0m Enter your choice (1-7): ", async (choice) => {
    console.log();

    switch (choice) {
      case "1":
        try {
          console.log("Fetching all wallets...");
          const wallets = await api.getAllWallets();

          if (wallets.length === 0) {
            console.log("No wallets found for this organization.");
          } else {
            console.log(`Found ${wallets.length} wallet(s):`);
            wallets.forEach((wallet, index) => {
              console.log(`\n--- Wallet ${index + 1} ---`);
              console.log(`ID: ${wallet.id}`);
              console.log(`Name: ${wallet.name}`);
              console.log(`Network: ${wallet.network}`);
              console.log(`Active: ${wallet.active}`);
              console.log(
                `Created: ${new Date(wallet.created_at).toLocaleString()}`
              );

              if (wallet.balances && wallet.balances.length > 0) {
                const latestBalance = wallet.balances[0];
                console.log(
                  `Available Balance: ${latestBalance.available} msats`
                );
                console.log(`Total Balance: ${latestBalance.total} msats`);
              } else {
                console.log("No balance information available");
              }
            });
          }
          waitForKeyPress(rl);
        } catch (error) {
          console.error("Failed to list wallets");
          waitForKeyPress(rl);
        }
        break;

      case "2":
        rl.question("Enter wallet ID: ", async (walletId) => {
          try {
            console.log(`Fetching wallet ${walletId}...`);
            const wallet = await api.getWallet(walletId);

            console.log("\n--- Wallet Details ---");
            console.log(`ID: ${wallet.id}`);
            console.log(`Name: ${wallet.name}`);
            console.log(`Network: ${wallet.network}`);
            console.log(`Active: ${wallet.active}`);
            console.log(
              `Created: ${new Date(wallet.created_at).toLocaleString()}`
            );
            console.log(
              `Updated: ${new Date(wallet.updated_at).toLocaleString()}`
            );

            if (wallet.metadata) {
              console.log("\nMetadata:");
              Object.entries(wallet.metadata).forEach(([key, value]) => {
                console.log(`  ${key}: ${value}`);
              });
            }

            console.log("\nBalances:");
            if (wallet.balances && wallet.balances.length > 0) {
              wallet.balances.forEach((balance) => {
                console.log(`  Currency: ${balance.currency}`);
                console.log(`  Available: ${balance.available} msats`);
                console.log(`  Total: ${balance.total} msats`);
                console.log(
                  `  Effective Time: ${new Date(
                    balance.effective_time
                  ).toLocaleString()}`
                );
              });
            } else {
              console.log("  No balance information available");
            }

            console.log("\nHolds:");
            if (wallet.holds && wallet.holds.length > 0) {
              wallet.holds.forEach((hold) => {
                console.log(`  ID: ${hold.id}`);
                console.log(`  Amount: ${hold.amount_msats} msats`);
                console.log(
                  `  Effective Time: ${new Date(
                    hold.effective_time
                  ).toLocaleString()}`
                );
                console.log(`  Currency: ${hold.currency}`);
              });
            } else {
              console.log("  No holds");
            }

            if (wallet.error) {
              console.log("\nError:");
              console.log(`  Type: ${wallet.error.type}`);
              if (wallet.error.detail) {
                console.log(`  Detail: ${wallet.error.detail}`);
              }
            }

            waitForKeyPress(rl);
          } catch (error) {
            console.error(`Failed to get wallet ${walletId}`);
            waitForKeyPress(rl);
          }
        });
        return;

      case "3":
        rl.question(
          `Enter wallet ID (default: ${config.walletId}): `,
          async (inputWalletId) => {
            const selectedWalletId = inputWalletId.trim() || config.walletId;

            rl.question(
              "Enter limit (optional, press Enter to skip): ",
              async (limit) => {
                try {
                  const options = {};
                  if (limit && !isNaN(parseInt(limit))) {
                    options.limit = parseInt(limit);
                  }

                  console.log(
                    `Fetching ledger for wallet ${selectedWalletId}...`
                  );
                  const ledger = await api.getWalletLedger(
                    selectedWalletId,
                    options
                  );

                  console.log("\n--- Wallet Ledger ---");
                  console.log(`Total Items: ${ledger.total}`);
                  console.log(`Offset: ${ledger.offset}`);
                  console.log(`Limit: ${ledger.limit}`);

                  if (ledger.items && ledger.items.length > 0) {
                    console.log("\nLedger Events:");
                    ledger.items.forEach((event, index) => {
                      console.log(`\n  Event ${index + 1}:`);
                      console.log(`  Type: ${event.type}`);
                      console.log(
                        `  Amount: ${event.amount_msats || "N/A"} msats`
                      );
                      console.log(`  Currency: ${event.currency}`);
                      console.log(
                        `  Time: ${new Date(
                          event.effective_time
                        ).toLocaleString()}`
                      );
                      console.log(`  Payment ID: ${event.payment_id}`);

                      if (
                        event.type === "held" ||
                        event.type === "captured" ||
                        event.type === "released"
                      ) {
                        console.log(`  Hold ID: ${event.hold_id}`);
                      } else if (event.type === "credited") {
                        console.log(`  Credit ID: ${event.credit_id}`);
                      }
                    });
                  } else {
                    console.log("\nNo ledger events found");
                  }

                  waitForKeyPress(rl);
                } catch (error) {
                  console.error(
                    `Failed to get ledger for wallet ${selectedWalletId}`
                  );
                  waitForKeyPress(rl);
                }
              }
            );
          }
        );
        return;

      case "4":
        rl.question(
          `Enter wallet ID (default: ${config.walletId}): `,
          async (inputWalletId) => {
            const selectedWalletId = inputWalletId.trim() || config.walletId;

            rl.question(
              "Enter amount (in millisatoshis): ",
              async (amountMsats) => {
                rl.question(
                  "Enter description (optional, press Enter to skip): ",
                  async (description) => {
                    try {
                      console.log(
                        `Creating bolt11 invoice for wallet ${selectedWalletId}...`
                      );
                      const payment = await api.createBolt11Invoice(
                        selectedWalletId,
                        amountMsats,
                        description
                      );

                      console.log("\n--- Bolt11 Invoice Created ---");
                      console.log(`Payment ID: ${payment.id}`);

                      console.log("\nWaiting for payment details...");
                      let attempts = 0;

                      const pollPayment = async () => {
                        if (attempts >= 10) {
                          console.log(
                            "\nTimed out waiting for payment details."
                          );
                          waitForKeyPress(rl);
                          return;
                        }

                        attempts++;

                        try {
                          const fullPayment = await api.getPayment(payment.id);

                          if (
                            fullPayment.data &&
                            fullPayment.data.payment_request
                          ) {
                            console.log("\n--- Payment Details ---");
                            console.log(`Status: ${fullPayment.status}`);
                            console.log(
                              `Amount: ${fullPayment.data.amount_msats} msats`
                            );

                            console.log("\nPayment Request (bolt11):");
                            console.log(fullPayment.data.payment_request);

                            if (
                              fullPayment.data.memo ||
                              fullPayment.description
                            ) {
                              console.log(
                                `Description: ${
                                  fullPayment.data.memo ||
                                  fullPayment.description
                                }`
                              );
                            }

                            rl.question(
                              "\nWould you like to wait for payment to be detected? (y/n): ",
                              async (answer) => {
                                if (
                                  answer.toLowerCase() === "y" ||
                                  answer.toLowerCase() === "yes"
                                ) {
                                  console.log(
                                    "\nWaiting for payment to be detected..."
                                  );
                                  console.log(
                                    "Monitoring for payment completion. Press Enter at any time to stop waiting and return to menu."
                                  );

                                  let waitingInterrupted = false;
                                  process.stdin.once("data", () => {
                                    console.log(
                                      "\nStopped waiting for payment. Returning to menu..."
                                    );
                                    waitingInterrupted = true;
                                    rl.close();
                                    setTimeout(createMenu, 500);
                                  });

                                  let paymentCompleted = false;
                                  let monitorCount = 0;

                                  const monitorPayment = async () => {
                                    if (waitingInterrupted) return;

                                    try {
                                      monitorCount++;
                                      if (monitorCount % 5 === 0) {
                                        console.log(
                                          `Still waiting for payment... (${monitorCount} checks)`
                                        );
                                      }

                                      const updatedPayment =
                                        await api.getPayment(payment.id);

                                      if (
                                        updatedPayment.status !==
                                        fullPayment.status
                                      ) {
                                        console.log(
                                          `\nStatus updated: ${updatedPayment.status}`
                                        );
                                      }

                                      if (
                                        updatedPayment.status === "completed"
                                      ) {
                                        console.log(
                                          "\n✅ Payment completed successfully!"
                                        );
                                        paymentCompleted = true;
                                        process.stdin.removeAllListeners(
                                          "data"
                                        );
                                        waitForKeyPress(rl);
                                        return;
                                      } else if (
                                        updatedPayment.status === "failed"
                                      ) {
                                        console.log("\n❌ Payment failed.");
                                        if (updatedPayment.error) {
                                          console.log(
                                            `Error: ${
                                              updatedPayment.error.type
                                            } - ${
                                              updatedPayment.error.detail || ""
                                            }`
                                          );
                                        }
                                        paymentCompleted = true;
                                        process.stdin.removeAllListeners(
                                          "data"
                                        );
                                        waitForKeyPress(rl);
                                        return;
                                      }

                                      if (
                                        !paymentCompleted &&
                                        !waitingInterrupted
                                      ) {
                                        setTimeout(monitorPayment, 2000);
                                      }
                                    } catch (error) {
                                      console.error(
                                        "Error monitoring payment:",
                                        error.message
                                      );
                                      console.log(
                                        "Will continue monitoring..."
                                      );

                                      if (!waitingInterrupted) {
                                        setTimeout(monitorPayment, 5000);
                                      }
                                    }
                                  };

                                  monitorPayment();
                                } else {
                                  console.log("\nReturning to main menu...");
                                  rl.close();
                                  setTimeout(createMenu, 500);
                                }
                              }
                            );
                          } else {
                            setTimeout(pollPayment, 1000);
                          }
                        } catch (error) {
                          if (error.message && error.message.includes("404")) {
                            console.log(
                              `Waiting for payment to be created (attempt ${attempts})...`
                            );
                            setTimeout(pollPayment, 1000);
                          } else {
                            console.error(
                              "Error polling payment:",
                              error.message
                            );
                            waitForKeyPress(rl);
                          }
                        }
                      };

                      pollPayment();
                    } catch (error) {
                      console.error("Failed to create bolt11 invoice");
                      console.error(error);
                      waitForKeyPress(rl);
                    }
                  }
                );
              }
            );
          }
        );
        return;

      case "5":
        rl.question(
          `Enter wallet ID (default: ${config.walletId}): `,
          async (inputWalletId) => {
            const selectedWalletId = inputWalletId.trim() || config.walletId;

            rl.question("Enter amount (in satoshis): ", async (amountSats) => {
              rl.question(
                "Enter description (optional, press Enter to skip): ",
                async (description) => {
                  try {
                    console.log(
                      `Creating onchain address for wallet ${selectedWalletId}...`
                    );
                    const payment = await api.createOnchainAddress(
                      selectedWalletId,
                      amountSats,
                      description
                    );

                    console.log("\n--- Onchain Address Created ---");
                    console.log(`Payment ID: ${payment.id}`);

                    // Poll for payment details just to get the address
                    const pollPayment = async () => {
                      try {
                        const paymentDetails = await api.getPayment(payment.id);

                        if (
                          paymentDetails.data &&
                          paymentDetails.data.address
                        ) {
                          console.log(
                            `\nBitcoin Address: ${paymentDetails.data.address}`
                          );
                          console.log(`Amount: ${amountSats} sats`);
                          if (description) {
                            console.log(`Description: ${description}`);
                          }
                          waitForKeyPress(rl);
                        } else {
                          setTimeout(pollPayment, 1000);
                        }
                      } catch (error) {
                        if (!error.message.includes("404")) {
                          console.error(
                            "Error getting payment details:",
                            error.message
                          );
                          waitForKeyPress(rl);
                          return;
                        }
                        setTimeout(pollPayment, 1000);
                      }
                    };

                    pollPayment();
                  } catch (error) {
                    console.error(
                      "Error creating onchain address:",
                      error.message
                    );
                    waitForKeyPress(rl);
                  }
                }
              );
            });
          }
        );
        return;

      case "6":
        try {
          rl.question("Enter limit (default: 3): ", async (limit) => {
            const options = {};
            if (limit && !isNaN(parseInt(limit))) {
              options.limit = parseInt(limit);
            } else {
              options.limit = 3;
            }

            console.log(`Fetching payments (limit: ${options.limit})...`);
            const payments = await api.getAllPayments(options);

            if (payments.items.length === 0) {
              console.log("No payments found.");
            } else {
              console.log(
                `Found ${payments.total} payment(s), showing ${payments.items.length}:`
              );

              payments.items.forEach((payment, index) => {
                console.log(`\n--- Payment ${index + 1} ---`);
                console.log(`ID: ${payment.id}`);
                console.log(`Type: ${payment.type}`);
                console.log(`Direction: ${payment.direction}`);
                console.log(`Status: ${payment.status}`);
                console.log(`Wallet ID: ${payment.wallet_id}`);
                console.log(
                  `Created: ${new Date(payment.created_at).toLocaleString()}`
                );

                if (payment.data) {
                  console.log("\nDetails:");

                  if (payment.type === "bolt11") {
                    if (payment.data.amount_msats) {
                      console.log(`Amount: ${payment.data.amount_msats} msats`);
                    }
                    if (payment.data.payment_request) {
                      console.log(
                        `Payment Request: ${payment.data.payment_request}`
                      );
                    }
                    if (payment.data.memo) {
                      console.log(`Memo: ${payment.data.memo}`);
                    }
                  } else if (payment.type === "onchain") {
                    if (payment.data.amount_sats) {
                      console.log(`Amount: ${payment.data.amount_sats} sats`);
                    }
                    if (payment.data.address) {
                      console.log(`Address: ${payment.data.address}`);
                    }
                  }
                }

                if (payment.error) {
                  console.log("\nError:");
                  console.log(`Type: ${payment.error.type}`);
                  if (payment.error.detail) {
                    console.log(`Detail: ${payment.error.detail}`);
                  }
                }
              });
            }

            waitForKeyPress(rl);
          });
        } catch (error) {
          console.error("Failed to list payments");
          waitForKeyPress(rl);
        }
        return;

      case "7":
        console.log("Exiting...");
        rl.close();
        return;

      default:
        console.log("Invalid choice. Please try again.");
        rl.close();
        setTimeout(createMenu, 500);
        return;
    }
  });
}

module.exports = { createMenu };
