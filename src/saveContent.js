const fs = require("fs-extra");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
} = require("docx");
const slugify = require("slugify");
const cheerio = require("cheerio");

// Load the configuration file
const configPath = path.join(__dirname, "../config.json");
let config = {}; // Default to an empty object

if (fs.existsSync(configPath)) {
  config = fs.readJSONSync(configPath); // Load config if exists
} else {
  console.warn("Configuration file not found, using default settings.");
}

// Sanitize route names for safe folder and file names
function sanitizeFileName(route) {
  return slugify(route, {
    remove: /[*+~.()'"!:@\/\\#]/g, // Remove unsafe characters
    lower: true, // Optionally convert to lowercase
  });
}

// Create relative folder structure from URL path
function createRelativePathFromRoute(route) {
  const sanitizedRoute = route.replace(/^\//, ""); // Remove leading slash from route
  return path.join(...sanitizedRoute.split("/")); // Create folder structure from route segments
}

// Utility function to convert HTML content into DOCX paragraphs
function convertHtmlToDocxContent(html) {
  const $ = cheerio.load(html);
  const paragraphs = [];

  $("body")
    .contents()
    .each((index, element) => {
      const tag = element.tagName ? element.tagName.toLowerCase() : null;

      // Handle headings (h1, h2, h3)
      if (tag === "h1") {
        paragraphs.push(
          new Paragraph({
            text: $(element).text().trim(),
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          })
        );
      } else if (tag === "h2") {
        paragraphs.push(
          new Paragraph({
            text: $(element).text().trim(),
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          })
        );
      } else if (tag === "h3") {
        paragraphs.push(
          new Paragraph({
            text: $(element).text().trim(),
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 200 },
          })
        );
      }
      // Handle paragraphs and divs
      else if (tag === "p" || tag === "div") {
        const textContent = $(element).text().trim();
        if (textContent) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun(textContent)],
              spacing: { after: 200 },
            })
          );
        }
      }
      // Handle <a> tags (links)
      else if (tag === "a") {
        const href = $(element).attr("href");
        const linkText = $(element).text().trim();
        paragraphs.push(
          new Paragraph({
            children: [new TextRun(`${linkText} (${href})`)],
            spacing: { after: 200 },
          })
        );
      }
      // Handle images
      else if (tag === "img") {
        const imgSrc = $(element).attr("src");
        paragraphs.push(
          new Paragraph({
            children: [new TextRun(`Image: ${imgSrc}`)],
            spacing: { after: 200 },
          })
        );
      }
      // Handle unordered lists (<ul> and <li>)
      else if (tag === "ul") {
        // Iterate through each list item in the unordered list
        $(element)
          .find("li")
          .each((liIndex, liElement) => {
            const listItemText = $(liElement).text().trim();
            if (listItemText) {
              paragraphs.push(
                new Paragraph({
                  children: [new TextRun(listItemText)],
                  bullet: {
                    level: 0, // Use bullet points
                  },
                  spacing: { after: 100 }, // Adjust spacing for list items
                })
              );
            }
          });
      }
      // Handle ordered lists (<ol> and <li>)
      else if (tag === "ol") {
        // Iterate through each list item in the ordered list
        $(element)
          .find("li")
          .each((liIndex, liElement) => {
            const listItemText = $(liElement).text().trim();
            if (listItemText) {
              paragraphs.push(
                new Paragraph({
                  children: [new TextRun(listItemText)],
                  numbering: {
                    reference: "numbered-list", // Use a numbered list style
                    level: 0, // Level 0 for ordered lists
                  },
                  spacing: { after: 100 },
                })
              );
            }
          });
      }
      // Handle plain text nodes
      else if (element.type === "text") {
        const plainText = $(element).text().trim();
        if (plainText) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun(plainText)],
              spacing: { after: 200 },
            })
          );
        }
      }
    });

  return paragraphs;
}

// Save content into the appropriate folder structure for both txt and docx
async function saveContent(route, content, baseDirTxt, baseDirDocx, baseUrl) {
  try {
    // Generate the relative path based on the route
    const relativePath = createRelativePathFromRoute(route);

    // Save as TXT
    const filePathTxt = path.join(baseDirTxt, `${relativePath}.txt`);
    const dirPathTxt = path.dirname(filePathTxt);

    // Ensure the TXT directory exists
    await fs.ensureDir(dirPathTxt);

    // Write the URL at the top of the TXT file and then the content
    const txtContent = `URL: ${baseUrl}${route}\n\n${content}`;
    await fs.writeFile(filePathTxt, txtContent, "utf8");
    console.log(`Saved TXT content to: ${filePathTxt}`);

    // Save as DOCX
    const filePathDocx = path.join(baseDirDocx, `${relativePath}.docx`);
    const dirPathDocx = path.dirname(filePathDocx);

    // Ensure the DOCX directory exists
    await fs.ensureDir(dirPathDocx);

    // Create the DOCX document
    const doc = new Document({
      numbering: {
        config: [
          {
            reference: "numbered-list", // Reference used in the content function
            levels: [
              {
                level: 0,
                format: "decimal",
                text: "%1.", // Number followed by a period (e.g., 1., 2., 3.)
                alignment: AlignmentType.LEFT, // Align numbers to the left
              },
            ],
          },
        ],
      },
      sections: [
        {
          children: [
            // Add the URL at the top of the DOCX file in bold
            new Paragraph({
              children: [
                new TextRun({
                  text: `URL: ${baseUrl}${route}`,
                  bold: true,
                }),
              ],
              spacing: { after: 200 }, // Add space after the URL
            }),
            ...convertHtmlToDocxContent(content), // Convert the HTML content to DOCX format
          ],
        },
      ],
    });

    // Generate the DOCX file and save it
    const buffer = await Packer.toBuffer(doc);
    await fs.writeFile(filePathDocx, buffer);
    console.log(`Saved DOCX content to: ${filePathDocx}`);
  } catch (error) {
    console.error("Error saving content:", error);
  }
}

module.exports = { saveContent };

// Function to save the list of all routes to a file
async function saveRoutesList(routes, outputDir) {
  try {
    const filePath = path.join(outputDir, "routes.txt");
    const routeList = routes.map((route) => `${route}`).join("\n");

    // Write all routes to the file
    await fs.writeFile(filePath, routeList, "utf8");
    console.log(`Saved list of routes to: ${filePath}`);
  } catch (error) {
    console.error("Error saving route list:", error);
  }
}

module.exports = { saveContent, saveRoutesList };
