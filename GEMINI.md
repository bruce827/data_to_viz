# Data to Viz

## Project Overview

**Data to Viz** (data-to-viz.com) is a comprehensive guide and decision tree for data visualization. It helps users select the most appropriate chart type for their data format and provides detailed examples, code snippets (R/Python/D3.js), and best practices.

The project is structured as a static website where content is primarily generated from R Markdown (`.Rmd`) files, allowing for the integration of live code examples and data analysis.

## Directory Structure

*   **Root:** Contains the main HTML pages (`index.html`, `poster.html`), build configuration (`gulpfile.js`), and global assets.
*   **`graph/`:** Contains detailed pages for each chart type. Content is authored in `.Rmd` files (e.g., `barplot.Rmd`).
*   **`caveat/`:** Contains pages discussing common data visualization pitfalls (caveats). Also authored in `.Rmd`.
*   **`Example_dataset/`:** CSV and other data files used in the visualization examples.
*   **`css/`, `js/`, `scss/`, `img/`:** Frontend assets. `scss/` contains the source styles which are compiled to `css/`.
*   **`story/`:** Likely contains "Data Story" case studies.

## Development & Build

### Prerequisites

*   **R:** Required to render the content.
    *   Packages: `rmarkdown`, `knitr`, and likely others used in the examples (e.g., `ggplot2`, `dplyr`).
*   **Node.js & Gulp:** Used for building CSS and JavaScript assets.
    *   **Note:** `package.json` appears to be missing in the root directory, which will cause `gulpfile.js` to fail.

### Rendering Content (R)

Content pages are generated from `.Rmd` files.

1.  **Navigate to the section directory** (e.g., `caveat/` or `graph/`).
2.  **Run the rendering script.**
    *   For `caveat/`, use `caveat/script_run_all.R`:
        ```R
        # In R console or script
        fileNames <- Sys.glob("*.Rmd")
        for( i in fileNames){
            rmarkdown::render(i)
        }
        ```
    *   Similar logic likely applies to `graph/`.

### Building Assets (Gulp)

*   **Compile SCSS & Minify JS:**
    ```bash
    gulp default
    ```
*   **Development Server (Watch Mode):**
    ```bash
    gulp dev
    ```
    *   This starts a BrowserSync server and watches for changes in SCSS, JS, and HTML files.

### Issues

*   **Missing `package.json`:** The `gulpfile.js` attempts to require `./package.json`, which is currently missing. This file is necessary to define dependencies and project metadata. You may need to run `npm init` or restore the file from version control history.

## Key Files

*   `README.md`: General project introduction and links.
*   `gulpfile.js`: Gulp build definition for assets.
*   `caveat/script_run_all.R`: R script to batch render markdown files in the `caveat` directory.
