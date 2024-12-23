# ATS-test Project

ATS-test is a Cloudflare Worker-based project for managing scheduling and availability time slots. It integrates with a
Telegram bot for user interaction and leverages TypeScript for modular, scalable development.

---

## Project Setup and Installation

### Pre-requisites

1. **Install Wrangler**: The CLI tool for Cloudflare Workers.
   ```bash
   npm install -g wrangler
   ```
2. **Install Node.js**: Ensure you have Node.js (v16 or later).
3. **Install TypeScript**:
   ```bash
   npm install -g typescript
   ```

### Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ats-test
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
	- Create a `.dev.vars` file in the root directory.
	- Add environment variables to the file
	- Overwrite the environment variables in `wrangler.toml`
	- The interface of the environment variables in `worker-configuration.d.ts`
	- Example of the `.dev.vars` file:
	  ```.dev.vars
      KV_NAMESPACE=<your-test-kv-namespace>           // KV namespace for caching
      WORKER_URL=<your-worker-url>                    // URL of the Cloudflare Worker (for registering webhooks)
      TELEGRAM_BOT_TOKEN=<your-telegram-bot-token>    // telegram bot token
      CHAT_ID=<your-telegram-chat-id>                 // telegram chat id (user id for local testing)
      DB=<your-d1-database-binding>                   // D1 database binding for data storage
      NODE_ENV=local                                  // environment mode (development, production)
	  ```
4. Test the project locally:

- Open first terminal and run:
   ```bash
   npm run dev
   ```
- Open second terminal and run:
   ```bash
   npm run test:cli
   ```

---

## Workflow for Feature Development and Deployment

### Step 1: Create a Side Branch

1. From the `main` branch, create a new side branch for your feature or fix:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/<your-feature-name>
   ```

### Step 2: Develop Locally

1. Write your code and make necessary changes.
2. Test your changes locally using:
   ```bash
   npm run dev
   ```
3. Run linting and formatting checks:
   ```bash
   npm run lint --fix
   npm run prettier:fix
   ```
4. Run tests to ensure no regressions:
   ```bash
   npm run test
   ```

### Step 3: Commit and Push Changes

1. Stage and commit your changes:
   ```bash
   git add .
   git commit -m "feat: Add <brief-description-of-feature>"
   ```
2. Push the changes to the side branch:
   ```bash
   git push origin feature/<your-feature-name>
   ```

### Step 4: Open a Merge Request

1. Go to the GitHub repository and open a new pull/merge request from your side branch to `dev`.
2. Ensure your pull request includes:
	- A clear description of the feature or fix.
	- Evidence of passing tests.

### Step 5: Review and Approval

1. Wait for reviews from team members.
2. Address any requested changes and re-push if necessary.
3. Once approved, merge the branch into `dev`.

---

## Available Commands

### Development

- **Start Development Mode**:
  ```bash
  npm run dev
  ```

### Testing and Code Quality

- **Run Tests**:
  ```bash
  npm run test
  ```
- **Lint Code**:
  ```bash
  npm run lint
  ```
- **Prettier Check and Fix**:
	- Check:
	  ```bash
	  npm run prettier:check
	  ```
	- Fix:
	  ```bash
	  npm run prettier:fix
	  ```

### Deployment

- Deployment happens automatically after the merge request is approved and merged into `main`.

---

## Developer Guide

### Project Structure

- **`src/app.ts`**: Main entry point of the Cloudflare Worker.
- **`test/`**: Unit tests for the worker.
- **`wrangler.toml`**: Configuration for the Cloudflare Worker, including environment variables and bindings.
- **`package.json`**: Contains metadata, dependencies, and scripts.

### Environment Variables

- **`TELEGRAM_BOT_TOKEN`**: Token for the Telegram bot.
- **`DB`**: D1 database binding for data storage.
- **`KV_NAMESPACE`**: KV namespace for caching.
- **`WORKER_URL`**: URL of the Cloudflare Worker (for registering webhooks).
- **`CHAT_ID`**: Telegram chat ID (user ID for local testing).
- **`NODE_ENV`**: Environment mode (local, production).

---

## Enhancements for Developer Experience

### Swagger API Documentation

- Use Swagger to document Telegram bot interactions.
- Auto-generate API documentation for better developer onboarding.

### Typedoc

- Generate detailed documentation from TypeScript comments in the `src` folder.

### Pre-commit Hooks

- Utilize Husky and `lint-staged` to enforce linting and formatting before commits.

### Testing Framework

- Expand on Vitest by writing comprehensive unit tests for every module.

### Centralized Wiki

- Host all documentation in a shared GitHub Wiki or Notion workspace for easy access.

---

## Long-term Maintenance

### Version Control

- Follow semantic versioning for deployments.
- Maintain a `CHANGELOG.md` for tracking updates.

### Monitoring

- Enable Workers logs in `wrangler.toml` for error tracking and monitoring.

### Testing Coverage

- Maintain and monitor code coverage using Vitest.

---

## Next Steps

1. Integrate Swagger for API documentation.
2. Regularly update `README.md` with feature descriptions and architecture diagrams.
3. Write detailed tests and maintain developer onboarding guides.

---

Start contributing and make scheduling seamless!

