# Deployment Instructions

## Vercel Deployment

This project is ready to be deployed on [Vercel](https://vercel.com).

### Method 1: Vercel CLI (Recommended)

1.  Install Vercel CLI:
    ```bash
    npm i -g vercel
    ```
2.  Run the deploy command in the project root:
    ```bash
    vercel
    ```
3.  Follow the prompts to link the project and deploy.

### Method 2: Git Integration

1.  Push this project to a GitHub/GitLab/Bitbucket repository.
2.  Import the repository in Vercel.
3.  Vercel will automatically detect the configuration and deploy.

## Local Development

To preview the site locally:

1.  If you have Python installed:
    ```bash
    python -m http.server 3000
    ```
    Then open `http://localhost:3000`.

2.  Or using `serve` (Node.js):
    ```bash
    npx serve .
    ```

## Project Structure

-   `index.html`: Main homepage.
-   `assets/`: Images, icons, and locale files.
-   `styles/`: CSS stylesheets.
-   `scripts/`: JavaScript files.
-   `vercel.json`: Vercel configuration.
