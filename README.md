# GloShip Clone

This is a logistics and shipping management application built with Next.js 15, Tailwind CSS, and GitHub-based persistence.

## Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Configuration

This project requires environment variables for email functionality and data persistence in serverless environments (like Vercel).

### 1. Email Configuration (Required for Emails)
To send shipment confirmations and invoices, you must configure a Gmail account.

1.  Go to your [Google Account Security Settings](https://myaccount.google.com/security).
2.  Enable **2-Step Verification**.
3.  Go to **App Passwords** (search for it in the settings if you can't find it).
4.  Create a new App Password for "Mail" and "Other (Custom name)".
5.  Copy the generated 16-character password.

**Environment Variables:**
- `EMAIL_USER`: Your full Gmail address (e.g., `gloship.logistics@gmail.com`).
- `EMAIL_PASS`: The 16-character App Password you generated (not your login password).

### 2. GitHub Persistence (Required for Vercel Deployment)
Since Vercel has a read-only file system, we use the GitHub API to save data (shipments, customers, etc.) directly to the repository.

1.  Go to [GitHub Developer Settings > Personal Access Tokens > Tokens (classic)](https://github.com/settings/tokens).
2.  Generate a new token.
3.  Select the **repo** scope (Full control of private repositories).
4.  Copy the token.

**Environment Variables:**
- `GITHUB_TOKEN`: Your GitHub Personal Access Token.

## Deploying to Vercel

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  In the **Environment Variables** section of the deployment settings, add:
    - `EMAIL_USER`
    - `EMAIL_PASS`
    - `GITHUB_TOKEN`
4.  Deploy!

## Admin Credentials
Default admin credentials are stored in `src/data/admin.json`.
