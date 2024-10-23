const sanitizeHtml = require("sanitize-html");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const path = require("path");

// Load the configuration file
const configPath = path.join(__dirname, "../config.json");
let config = {}; // Default to an empty object

if (fs.existsSync(configPath)) {
  config = fs.readJSONSync(configPath); // Load config if exists
} else {
  console.warn("Configuration file not found, using default settings.");
}

// Scrape content from a specific page
async function scrapePageContent(url) {
  const userAgent = config.scraperOptions?.userAgent || "Mozilla/5.0";
  const timeout = config.scraperOptions?.timeout || 5000;
  const maxRetries = config.scraperOptions?.maxRetries || 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent": userAgent,
        },
        timeout: timeout,
      });

      const $ = cheerio.load(data);

      // Remove elements based on classes in the config (including parent containers)
      if (config.excludeOptions?.excludeClasses) {
        config.excludeOptions.excludeClasses.forEach((className) => {
          $(`.${className.replace(/\s+/g, ".")}`).remove(); // Remove elements by class
        });
      }

      // Remove elements based on tags in the config (including header and footer)
      if (config.excludeOptions?.excludeTags) {
        config.excludeOptions.excludeTags.forEach((tagName) => {
          $(tagName).remove(); // Remove elements by tag
        });
      }

      // Scrape the remaining content (this can be customized)
      const content = $("body").html(); // Get the HTML of the body without the excluded elements

      return content;
    } catch (error) {
      console.error(
        `Error scraping content from ${url}, attempt ${attempt} of ${maxRetries}:`,
        error
      );
      if (attempt === maxRetries) {
        console.error(`Failed to scrape ${url} after ${maxRetries} attempts.`);
        return "";
      }
    }
  }
}

// Clean the content by removing JS, inline styles, unwanted elements, and retaining only text and images
function cleanContent(content) {
  // Sanitize to remove scripts, styles, and unwanted tags
  const cleaned = sanitizeHtml(content, {
    allowedTags: ["p", "h1", "h2", "h3", "ul", "li", "img"], // Keep only these tags
    allowedAttributes: {
      a: ["href"], // Allow href for links
      img: ["src", "alt"], // Keep src and alt for images
    },
    disallowedTagsMode: "discard", // Remove everything else
    transformTags: {
      script: () => ({ tagName: "script", text: "" }), // Remove script tags
      style: () => ({ tagName: "style", text: "" }), // Remove style tags
    },
  });

  return cleaned;
}

module.exports = { scrapePageContent, cleanContent };
