const axios = require("axios");
const cheerio = require("cheerio");

// Function to get all internal routes (links) from the base URL
async function getAllRoutes(baseUrl) {
  try {
    const { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    let routes = [];

    // Find all internal links (href that starts with "/")
    $('a[href^="/"]').each((index, element) => {
      const href = $(element).attr("href");
      if (href && !href.includes("#")) {
        // Skip links with hashes
        routes.push(href);
      }
    });

    return [...new Set(routes)]; // Remove duplicates
  } catch (error) {
    console.error(`Error fetching routes from ${baseUrl}:`, error);
    return [];
  }
}

module.exports = { getAllRoutes };
