# Node.js Web Scraper

A customizable Node.js-based web scraper that extracts content from websites and saves it in `.txt` and `.docx` formats. The scraper allows users to specify routes, HTML elements, and CSS classes to include or exclude, and it cleans the content by removing unnecessary JavaScript and unwanted elements. This tool is useful for extracting structured website data and exporting it to easily readable formats. Configuration is flexible through a `config.json` file.

## Features

- Scrapes all internal links (routes) from a base URL.
- Extracts and cleans content by removing JavaScript, inline styles, and unwanted HTML elements.
- Supports both unordered (`<ul>`) and ordered (`<ol>`) lists, exporting them as bullet points or numbered lists in DOCX.
- Saves the scraped content as `.txt` and/or `.docx` files.
- Optionally adds the URL of the page at the top of each file.
- Configurable via `config.json`, allowing you to exclude specific routes, tags, and classes.
- Logs progress and errors based on log level settings.

## Project Structure

```
web-scraper/
├── src/
│   ├── scraper.js           # Main entry point for the scraper
│   ├── routes.js            # Module to extract routes
│   ├── scraperUtils.js      # Helper functions for scraping and cleaning content
│   ├── saveContent.js       # Functions to save content in txt/docx and list routes
│   ├── pathUtils.js         # Utility functions for file paths
├── data/                    # Folder to store scraped content
│   ├── txt/                 # Folder for .txt files
│   └── docx/                # Folder for .docx files
├── config.json              # Configuration file for the scraper
├── package.json             # Node.js project file
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/web-scraper.git
   ```

2. Install dependencies:

   ```bash
   cd web-scraper
   npm install
   ```

3. Configure the scraper by editing the `config.json` file (see configuration details below).

## Usage

Run the scraper with the following command:

```bash
npm run scrape -- <BASE_URL>
```

For example:

```bash
npm run scrape -- https://www.example.com
```

The scraper will scrape all internal links (routes) from the provided base URL, extract and clean the content, and save it in `.txt` and `.docx` formats.

## Configuration (`config.json`)

You can customize the scraper’s behavior through the `config.json` file. Below is a breakdown of the available configuration options.

### `scraperOptions`

```json
{
  "scraperOptions": {
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    "timeout": 5000,
    "maxRetries": 3,
    "requestDelay": 1000
  }
}
```

- **`userAgent`**: A string to mimic a specific browser or device (optional). Default: A typical Chrome user agent.
- **`timeout`**: Timeout for HTTP requests in milliseconds (optional). Default: 5000 ms.
- **`maxRetries`**: Maximum number of retries for a failed request (optional). Default: 3 retries.
- **`requestDelay`**: Delay between requests in milliseconds to avoid overwhelming the server (optional). Default: 1000 ms.

### `excludeOptions`

```json
{
  "excludeOptions": {
    "excludeClasses": ["row-fluid breadcrumbsContainer", "navSection"],
    "excludeTags": ["footer", "header"]
  }
}
```

- **`excludeClasses`**: Array of CSS class names to exclude from scraping (optional).
- **`excludeTags`**: Array of HTML tags to exclude from scraping (optional).

### `excludeRoutes`

```json
{
  "excludeRoutes": ["/contact", "/aboutus", "/login"]
}
```

- **`excludeRoutes`**: Array of URL paths (or patterns) to exclude from scraping. Useful for avoiding irrelevant pages such as contact forms or login pages (optional).

### `outputOptions`

```json
{
  "outputOptions": {
    "outputFormats": ["txt", "docx"],
    "outputDirectory": "data"
  }
}
```

- **`outputFormats`**: Array of formats to save the scraped content in. Supported formats are `"txt"` and `"docx"` (optional). Default: `["txt", "docx"]`.
- **`outputDirectory`**: Base directory for saving scraped files. This directory will contain `txt/` and `docx/` subfolders (optional). Default: `"data"`.

### `logLevel`

```json
{
  "logLevel": "info"
}
```

- **`logLevel`**: Sets the logging level for debugging purposes (optional). Supported values: `"error"`, `"warn"`, `"info"`, `"debug"`. Default: `"info"`.

### `contentSelectors`

```json
{
  "contentSelectors": {
    "mainContent": "article",
    "sidebar": ".sidebar"
  }
}
```

- **`mainContent`**: CSS selector for the main content section of the page (optional). Default: `"article"`.
- **`sidebar`**: CSS selector for sidebar content if needed (optional).

### `debug`

```json
{
  "debug": false
}
```

- **`debug`**: Enables or disables debug mode for additional logging (optional). Default: `false`.

### Example Configuration

```json
{
  "scraperOptions": {
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    "timeout": 5000,
    "maxRetries": 3,
    "requestDelay": 1000
  },
  "excludeOptions": {
    "excludeClasses": [
      "row-fluid breadcrumbsContainer",
      "navSection",
      "transparentSection"
    ],
    "excludeTags": ["footer", "header"]
  },
  "excludeRoutes": ["/contact", "/aboutus", "/login"],
  "outputOptions": {
    "outputFormats": ["txt", "docx"],
    "outputDirectory": "data"
  },
  "logLevel": "info",
  "contentSelectors": {
    "mainContent": "article",
    "sidebar": ".sidebar"
  },
  "debug": false
}
```

## Running the Scraper

To run the scraper, use the following command:

```bash
npm run scrape -- <BASE_URL>
```

For example:

```bash
npm run scrape -- https://www.example.com
```

## How it Works

1. The scraper clears the `data/` folder at the start of each run.
2. It scrapes all internal links from the base URL provided via the command line.
3. It extracts and cleans the content from each page, excluding specific HTML elements based on the configuration.
4. The content is saved in `.txt` and `.docx` formats in the `data/txt/` and `data/docx/` folders, respectively.
5. The URL of the page is added at the top of each saved file.
6. The scraper logs its progress based on the `logLevel` setting in the configuration file.

## License

This project is licensed under the MIT License.
