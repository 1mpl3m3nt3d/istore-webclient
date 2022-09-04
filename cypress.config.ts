const { defineConfig } = require('cypress');

const PUBLIC_URL = process.env.PUBLIC_URL;
// Use process.env.HOST by default and fallback to 'http://localhost'
const HOST = process.env.HOST || 'http://localhost';
// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000;

const baseURL =
  PUBLIC_URL ?? PUBLIC_URL !== '' ? PUBLIC_URL : `${HOST}:${PORT}`;

module.exports = defineConfig({
  e2e: {
    baseUrl: baseURL,
  },
});
