const axios = require("axios");
const chalk = require("chalk");

const API_URL = "https://frontend-api.voltage.cloud";
const AUTH_URL = "https://auth.voltage.cloud/api/v1";
const BACKEND_URL = "https://backend.voltage.cloud/api/v1";

class Api {
  constructor(opts) {
    this.accessToken = opts?.accessToken;
    this.baseApiUrl = process.env.VOLTAGE_API_URL || API_URL;
    this.baseBackendUrl = process.env.VOLTAGE_BACKEND_URL || BACKEND_URL;
    this.baseAuthUrl = process.env.VOLTAGE_AUTH_URL || AUTH_URL;
  }

  async authedGet(url) {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return response.data;
  }

  async authedPost(url, data) {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return response.data;
  }

  async post({ url, data }) {
    const response = await axios.post(url, data);
    return response.data;
  }

  async get(url) {
    const response = await axios.get(url);
    return response.data;
  }

  makeBackendUrl(path) {
    return `${this.baseBackendUrl}${path}`;
  }

  makeApiUrl(path) {
    return `${this.baseApiUrl}${path}`;
  }

  makeAuthUrl(path) {
    return `${this.baseAuthUrl}${path}`;
  }

  async login(opts) {
    const url = this.makeAuthUrl("/auth/login");
    const response = await this.post({
      url,
      data: {
        email: opts.email,
        password: opts.password,
      },
    });
    if (response.session) {
      // Has mfa
      return { mfa: true, token: response.session.token };
    } else {
      this.accessToken = response.auth.access_token;
      console.log(chalk.green("️Login successful!"));
    }
  }

  async mfaLogin(opts) {
    const url = this.makeAuthUrl("/auth/mfa_challenge");
    const response = await this.post({
      url,
      data: {
        email: opts.email,
        code: opts.code,
        session: opts.token,
      },
    });
    this.accessToken = response.auth.access_token;
    console.log(chalk.green("️Login successful!"));
  }

  async getTeams() {
    const url = this.makeAuthUrl("/users");
    return this.authedGet(url);
  }

  async getNodes(teamId) {
    const url = this.makeApiUrl(`/organizations/${teamId}/nodes`);
    const response = await this.authedGet(url);
    return response.nodes;
  }

  async getNodeDetails(teamId, nodeId) {
    const url = this.makeApiUrl(`/organizations/${teamId}/nodes/${nodeId}`);
    return this.authedGet(url);
  }

  async getAdminMacaroonAndTlsCert(teamId, nodeId) {
    const url = this.makeApiUrl(
      `/organizations/${teamId}/nodes/${nodeId}/macaroons/admin`
    );
    const { macaroon, tls_cert } = await this.authedGet(url);
    return {
      adminMacaroon: macaroon,
      tlsCert: tls_cert,
    };
  }

  async getReadMacaroonAndTlsCert(teamId, nodeId) {
    const url = this.makeApiUrl(
      `/organizations/${teamId}/nodes/${nodeId}/macaroons/readonly`
    );
    const { macaroon, tls_cert } = await this.authedGet(url);
    return {
      readMacaroon: macaroon,
      tlsCert: tls_cert,
    };
  }

  async getInvoiceMacaroonAndTlsCert(teamId, nodeId) {
    const url = this.makeApiUrl(
      `/organizations/${teamId}/nodes/${nodeId}/macaroons/invoice`
    );
    const { macaroon, tls_cert } = await this.authedGet(url);
    return {
      invoiceMacaroon: macaroon,
      tlsCert: tls_cert,
    };
  }

  // Payments Product API
  async getEnvironments(teamId) {
    const url = this.makeAuthUrl(`/organizations/${teamId}/environments`);
    return this.authedGet(url);
  }

  async getWallets(teamId) {
    const url = this.makeBackendUrl(`/organizations/${teamId}/wallets`);
    return this.authedGet(url);
  }

  async getApiKeys(teamId) {
    const url = this.makeAuthUrl(`/organizations/${teamId}/api_keys`);
    return this.authedGet(url);
  }
}

module.exports = Api;
