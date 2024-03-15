const axios = require("axios");
const chalk = require("chalk");

const API_URL = "https://frontend-api.voltage.cloud";
const APP_URL = "https://app.voltage.cloud";
const GRAPHQL_URL = "https://graphql.voltage.cloud/";

class Api {
  constructor(opts) {
    this.accessToken = opts?.accessToken;
    this.baseApiUrl = process.env.VOLTAGE_API_URL || API_URL;
    this.baseAppUrl = process.env.VOLTAGE_APP_URL || APP_URL;
    this.baseGraphqlApiUrl = process.env.VOLTAGE_GRAPHQL_URL || GRAPHQL_URL;
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

  makeAppUrl(path) {
    return `${this.baseAppUrl}${path}`;
  }

  makeApiUrl(path) {
    return `${this.baseApiUrl}${path}`;
  }

  async login(opts) {
    const url = this.makeAppUrl("/api/auth/login");
    const response = await this.post({
      url,
      data: {
        email: opts.email,
        password: opts.password,
      },
    });
    if (response.token) {
      // MFA
      return { mfa: true, token: response.token };
    } else {
      this.accessToken = response.accessToken;
      console.log(chalk.green("️Login successful!"));
    }
  }

  async mfaLogin(opts) {
    const url = this.makeAppUrl("/api/auth/loginmfa");
    const response = await this.post({
      url,
      data: {
        email: opts.email,
        code: opts.code,
        token: opts.token,
      },
    });
    this.accessToken = response.auth.accessToken;
    console.log(chalk.green("️Login successful!"));
  }

  async getTeams() {
    const query = `
        query {
            currentUser {
                organizations {
                    id
                    name
                }
            }
        }
    `;
    const response = await this.authedPost(this.baseGraphqlApiUrl, { query });
    this.teams = response.data.currentUser.organizations;
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
