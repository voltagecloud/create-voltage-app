const crypto = require("crypto");
const config = require("../utils/config");

/**
 * Get all wallets for an organization
 * @returns {Promise<Array>} - Promise resolving to an array of wallet objects
 */
async function getAllWallets() {
  try {
    const url = `${config.baseUrl}/organizations/${config.organizationId}/wallets`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": config.apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API error: ${response.status} ${
          response.statusText
        } - ${JSON.stringify(errorData)}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching wallets:", error.message);
    throw error;
  }
}

/**
 * Get a specific wallet by ID
 * @param {string} walletId - ID of the wallet to retrieve
 * @returns {Promise<Object>} - Promise resolving to a wallet object
 */
async function getWallet(walletId) {
  try {
    const url = `${config.baseUrl}/organizations/${config.organizationId}/wallets/${walletId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": config.apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API error: ${response.status} ${
          response.statusText
        } - ${JSON.stringify(errorData)}`
      );
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching wallet ${walletId}:`, error.message);
    throw error;
  }
}

/**
 * Create a bolt11 invoice (receive payment)
 * @param {string} walletId - ID of the wallet to create the invoice for
 * @param {number} amountMsats - Amount in millisatoshis
 * @param {string} description - Optional description for the invoice
 * @returns {Promise<Object>} - Promise resolving to the created payment object
 */
async function createBolt11Invoice(walletId, amountMsats, description = "") {
  try {
    const url = `${config.baseUrl}/organizations/${config.organizationId}/environments/${config.environmentId}/payments`;
    const paymentData = {
      id: crypto.randomUUID(),
      wallet_id: walletId,
      currency: "btc",
      amount_msats: parseInt(amountMsats, 10),
      payment_kind: "bolt11",
      description: description || "Payment request",
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-api-key": config.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API error: ${response.status} ${
          response.statusText
        } - ${JSON.stringify(errorData)}`
      );
    }

    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 0) {
      return await response.json();
    } else {
      return paymentData;
    }
  } catch (error) {
    console.error("Error creating bolt11 invoice:", error.message);
    throw error;
  }
}

/**
 * Get information about a payment
 * @param {string} paymentId - ID of the payment to retrieve
 * @returns {Promise<Object>} - Promise resolving to the payment object
 */
async function getPayment(paymentId) {
  try {
    const url = `${config.baseUrl}/organizations/${config.organizationId}/environments/${config.environmentId}/payments/${paymentId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": config.apiKey,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      throw new Error(
        "404: Payment not found yet. The server is still processing the request."
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API error: ${response.status} ${
          response.statusText
        } - ${JSON.stringify(errorData)}`
      );
    }

    return response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Get wallet ledger
 * @param {string} walletId - ID of the wallet to retrieve the ledger for
 * @param {Object} options - Query parameters for ledger request
 * @returns {Promise<Object>} - Promise resolving to a ledger object
 */
async function getWalletLedger(walletId, options = {}) {
  try {
    let url = `${config.baseUrl}/organizations/${config.organizationId}/wallets/${walletId}/ledger`;

    if (Object.keys(options).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": config.apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API error: ${response.status} ${
          response.statusText
        } - ${JSON.stringify(errorData)}`
      );
    }

    return response.json();
  } catch (error) {
    console.error(
      `Error fetching ledger for wallet ${walletId}:`,
      error.message
    );
    throw error;
  }
}

/**
 * Get all payments for an organization's environment
 * @param {Object} options - Query parameters for payments request
 * @returns {Promise<Object>} - Promise resolving to a payments object
 */
async function getAllPayments(options = {}) {
  try {
    if (!options.limit) {
      options.limit = 3;
    }

    let url = `${config.baseUrl}/organizations/${config.organizationId}/environments/${config.environmentId}/payments`;

    if (Object.keys(options).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": config.apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API error: ${response.status} ${
          response.statusText
        } - ${JSON.stringify(errorData)}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching payments:", error.message);
    throw error;
  }
}

module.exports = {
  getAllWallets,
  getWallet,
  createBolt11Invoice,
  getPayment,
  getWalletLedger,
  getAllPayments,
};
