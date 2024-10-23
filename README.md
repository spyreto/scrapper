# Web Scraper Configuration

This project uses a `config.json` file to customize various aspects of the web scraping process. Below is a detailed description of each configuration option available in the `config.json` file.

## Configuration Options

### 1. `scraperOptions`

This section contains options related to how the scraper interacts with the target website.

- **`userAgent`** (string):  
  The User-Agent string to mimic a specific browser or device during requests. This helps avoid detection as a bot and can simulate requests from real browsers.  
  _Default_: `"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"`

- **`timeout`** (number):  
  The maximum time (in milliseconds) the scraper will wait for a server response before timing out.  
  _Default_: `5000` (5 seconds)

- **`maxRetries`** (number):  
  The maximum number of retry attempts when a request fails (due to network issues or timeouts).  
  _Default_: `3`

- **`requestDelay`** (number):  
  The delay (in milliseconds) between consecutive requests to avoid overloading the target server. Useful for respecting rate limits.  
  _Default_: `1000` (1 second)

---

### 2. `excludeOptions`

This section defines which elements should be excluded or included during the scraping process.

- **`excludeClasses`** (array of strings):  
  A list of CSS class names to exclude from the scraped content. Any HTML elements containing these classes will be removed before saving.  
  _Example_: `["row-fluid breadcrumbsContainer", "navSection"]`

- **`excludeTags`** (array of strings):  
  A list of HTML tags to exclude from the scraped content.  
  _Example_: `["footer", "header"]`

- **`includeClasses`** (array of strings):  
  A list of CSS class names to explicitly include during scraping, if necessary. This can be useful when targeting very specific parts of a webpage.  
  _Example_: `["content", "main"]`

---

### 3. `outputOptions`

This section defines how and where the scraped content is saved.

- **`outputFormats`** (array of strings):  
  A list of file formats to save the scraped content in. Options are `txt` for plain text and `docx` for Word documents.  
  _Example_: `["txt", "docx"]`

- **`outputDirectory`** (string):  
  The base directory where the scraped content will be saved. The directory structure will be created automatically.  
  _Default_: `"data"`

---

### 4. `logLevel`

- **`logLevel`** (string):  
  Specifies the level of logging detail. Available options are:

  - `"error"`: Log only errors.
  - `"warn"`: Log warnings and errors.
  - `"info"`: Log general information, warnings, and errors.
  - `"debug"`: Log detailed debugging information, including request/response details.

  _Default_: `"info"`

---

### 5. `contentSelectors`

This section specifies CSS selectors to target specific sections of the webpage for scraping.

- **`mainContent`** (string):  
  The CSS selector for the main content of the webpage.  
  _Example_: `"article"`

- **`sidebar`** (string):  
  The CSS selector for the sidebar content, if applicable.  
  _Example_: `".sidebar"`

---

### 6. `debug`

- **`debug`** (boolean):  
  Enables or disables debug mode. When enabled, additional logs and information will be displayed to help troubleshoot issues during scraping.  
  _Default_: `false`

---

## Example `config.json`

Below is an example of a `config.json` file that uses the options described above:

```json
{
  "scraperOptions": {
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    "timeout": 5000,
    "maxRetries": 3,
    "requestDelay": 1000
  },
  "excludeOptions": {
    "excludeClasses": ["row-fluid breadcrumbsContainer", "navSection"],
    "excludeTags": ["footer", "header"],
    "includeClasses": ["content", "main"]
  },
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
