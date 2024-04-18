const axios = require("axios");
const chalk = require("chalk");

const API_URL = "https://frontend-api.voltage.cloud";
const AUTH_URL = "https://auth.voltage.cloud/api/v1";

class Api {
  constructor(opts) {
    this.accessToken = opts?.accessToken;
    this.baseApiUrl = process.env.VOLTAGE_API_URL || API_URL;
    this.baseAuthUrl = process.env.VOLTAGE_AUTH_URL || AUTH_URL;
    this.teams = [];
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
    const url = this.makeAuthUrl("/organizations");
    this.teams = await this.authedGet(url);
  }

  async getNodes(teamId) {
    const url = this.makeApiUrl(`/organizations/${teamId}/nodes`);
    const response = await this.authedGet(url);
    return response.nodes;
  }

  async getNodeDetails(teamId, nodeId) {
    const url = this.makeApiUrl(`/organizations/${teamId}/nodes/${nodeId}`);
    const response = await this.authedGet(url);
    return response;
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
}

module.exports = Api;
