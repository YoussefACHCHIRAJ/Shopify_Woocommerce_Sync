const axios = require("axios");
const dotenv = require("dotenv").config();

const shopifyStore = process.env.SHOPIFY_URL;
const access_token = process.env.APP_KEY;

const wordpress_url = process.env.WOORDPRESS_URL;
const username = process.env.WOOCOMMERCE_CONSUMER_KEY;
const password = process.env.WOOCOMMERCE_CONSUMER_SECRET;

const shopifyClient = axios.create({
  baseURL: `${shopifyStore}/admin/api/2023-04/`,
  headers: { "X-Shopify-Access-Token": access_token },
});

const wcClient = axios.create({
  baseURL: `${wordpress_url}/wp-json/wc/v3/`,
  auth: { username, password },
});

module.exports = { shopifyClient, wcClient };
