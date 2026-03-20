import { defineConfig } from 'cypress'

export default defineConfig({
  baseUrl: process.env.CYPRESS_BASE_URL ?? 'http://localhost:4000',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
