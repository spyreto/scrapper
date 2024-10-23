const { getAllRoutes } = require("./routes");
const { scrapePageContent, cleanContent } = require("./scraperUtils");
const { saveContent, saveRoutesList } = require("./saveContent");
const path = require("path");
const fs = require("fs-extra");

// Load the configuration file
const configPath = path.join(__dirname, "../config.json");
let config = {}; // Default to an empty object

if (fs.existsSync(configPath)) {
  config = fs.readJSONSync(configPath); // Load config if exists
} else {
  console.warn("Configuration file not found, using default settings.");
}

// Get the base URL from the command line argument
const BASE_URL = process.argv[2]; // Get the URL from execution params

if (!BASE_URL) {
  console.error("Please provide a base URL as a command-line argument");
  process.exit(1);
}

// Define two directories: one for txt and one for docx
const DATA_DIR =
  config.outputOptions?.outputDirectory || path.join(__dirname, "../data");
const DATA_DIR_TXT = path.join(DATA_DIR, "txt");
const DATA_DIR_DOCX = path.join(DATA_DIR, "docx");

// Function to check if a route should be excluded
function isRouteExcluded(route) {
  if (config.excludeRoutes && config.excludeRoutes.length > 0) {
    return config.excludeRoutes.some((excludePattern) =>
      route.includes(excludePattern)
    );
  }
  return false;
}

// Log level for debugging purposes
const logLevel = config.logLevel || "info";

function log(message, level = "info") {
  if (
    ["error", "warn", "info", "debug"].includes(logLevel) &&
    logLevel !== "error"
  ) {
    console[level](message);
  }
}

// Function to clear the data folder
async function clearDataFolder() {
  try {
    await fs.remove(DATA_DIR);
    log("Data folder cleared.", "info");

    await fs.ensureDir(DATA_DIR_TXT);
    await fs.ensureDir(DATA_DIR_DOCX);
    log("Data folder structure created.", "info");
  } catch (error) {
    console.error("Error clearing or creating the data folder:", error);
  }
}

// Main function to scrape all routes
async function scrapeWebsite() {
  try {
    await clearDataFolder();

    const routes = await getAllRoutes(BASE_URL);

    if (routes.length === 0) {
      log("No routes found to scrape.", "warn");
      return;
    }

    let allContent = [];

    for (const route of routes) {
      const fullUrl = `${BASE_URL}${route}`;

      // Check if the route should be excluded
      if (isRouteExcluded(route)) {
        console.log(`Skipping excluded route: ${fullUrl}`);
        continue;
      }

      log(`Scraping: ${fullUrl}`, "info");

      // Apply request delay if specified
      if (config.scraperOptions?.requestDelay) {
        await new Promise((resolve) =>
          setTimeout(resolve, config.scraperOptions.requestDelay)
        );
      }

      // Scrape content from each page
      const content = await scrapePageContent(fullUrl);
      const cleanedContent = cleanContent(content);

      // Save content in both TXT and DOCX formats
      await saveContent(
        route,
        cleanedContent,
        DATA_DIR_TXT,
        DATA_DIR_DOCX,
        BASE_URL
      );

      allContent.push(route);
    }

    // Save the list of all routes
    await saveRoutesList(allContent, DATA_DIR_TXT);

    log("Scraping complete.", "info");
  } catch (error) {
    console.error("Error while scraping:", error);
  }
}

scrapeWebsite();
