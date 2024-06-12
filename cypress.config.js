const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:3000',
    fixturesFolder: 'cypress/fixtures',
  },
});
