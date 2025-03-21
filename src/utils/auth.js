const VoltageApi = require("../lib/api");
const { input, password } = require("@inquirer/prompts");
const select = require("@inquirer/select").default;

/**
 * Handle login flow for Voltage API
 * @returns {Promise<{api: VoltageApi, teamId: string, nodeId: string, nodeDetails: any, nodePassword: string}>}
 */
async function handleLogin() {
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

  return { api };
}

/**
 * Get macaroons and TLS cert from API
 * @param {VoltageApi} api The Voltage API instance
 * @param {string} teamId The team ID
 * @param {string} nodeId The node ID
 * @param {string} nodePassword The node password
 * @returns {Promise<{readMacaroon: string, invoiceMacaroon: string, tlsCert: string, apiEndpoint: string}>}
 */
async function getMacaroonsAndCert(
  api,
  teamId,
  nodeId,
  nodeDetails,
  nodePassword
) {
  const { decryptMacaroon, base64ToHex } = require("./crypto");

  // Get read macaroon and TLS cert
  const { readMacaroon, tlsCert } = await api.getReadMacaroonAndTlsCert(
    teamId,
    nodeId
  );

  // Get invoice macaroon and TLS cert
  const { invoiceMacaroon } = await api.getInvoiceMacaroonAndTlsCert(
    teamId,
    nodeId
  );

  // Decrypt macaroons
  const decryptedReadMacaroon = decryptMacaroon(readMacaroon, nodePassword);
  const decryptedInvoiceMacaroon = decryptMacaroon(
    invoiceMacaroon,
    nodePassword
  );

  return {
    readMacaroon: base64ToHex(decryptedReadMacaroon),
    invoiceMacaroon: base64ToHex(decryptedInvoiceMacaroon),
    tlsCert,
    apiEndpoint: `https://${nodeDetails.api_endpoint}:8080`,
  };
}

module.exports = {
  handleLogin,
  getMacaroonsAndCert,
};
