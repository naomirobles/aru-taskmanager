import { defineConfig, devices } from "@playwright/test";
import path from "path";

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000;

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = `http://localhost:${PORT}`;

// Reference: https://playwright.dev/docs/test-configuration
export default defineConfig({
  testDir: path.join(__dirname, "tests"),
  outputDir: "test-results/",
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },

  use: {
    baseURL,
    trace: "retry-with-trace",
  },
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "calendar tests",
      testMatch: /.*e2e\/calendar\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.clerk/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "tasks tests",
      testMatch: /.*e2e\/tasks\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.clerk/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "categories tests",
      testMatch: /.*e2e\/categories\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.clerk/user.json",
      },
      dependencies: ["setup"],
    },
  ],
});
