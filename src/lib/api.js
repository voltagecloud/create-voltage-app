const axios = require("axios");
const chalk = require("chalk");

// TODO: Local + production graphql?
const LOCAL_URL = "https://localhost:3210";
const PRODUCTION_URL = "https://app.voltage.cloud";

const API_URL = "https://ugak8gc6dk.execute-api.us-west-2.amazonaws.com";
const APP_URL = "https://nextgen.staging.voltage.cloud";
const GRAPHQL_STAGING_URL = "https://graphql.staging.voltage.cloud/";

class Api {
  constructor(opts) {
    this.accessToken = opts?.accessToken;
    this.baseApiUrl = opts?.apiUrl || API_URL;
    this.baseAppUrl = opts?.appUrl || APP_URL;
    this.baseGraphqlApiUrl = opts?.graphqlApiUrl || GRAPHQL_STAGING_URL;
    this.teams = [];
  }

  async authedGet(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error: ", error.message);
      throw error;
    }
  }

  async authedPost(url, data) {
    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error: ", error.message);
      throw error;
    }
  }

  async post({ url, data }) {
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      console.error("Error: ", error.message);
      throw error;
    }
  }

  async get(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error: ", error.message);
      throw error;
    }
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
    this.accessToken = response.accessToken;
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
