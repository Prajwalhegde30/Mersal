# Mersal SQL Agent - Documentation

Mersal is an autonomous SQL Agent designed for Next.js and Neon DB. It features a Brutalist and Glassmorphic web interface.

## Features
- **Autonomous DB Operations**: Instruct the agent to create tables, alter schemas, or fetch data, and it natively executes the SQL via OpenRouter's tool-calling logic.
- **Context Scanner**: Point the agent to a local project directory, and it will analyze the files (ignoring node_modules, etc.) to understand the project structure and make accurate database schema recommendations.
- **Glassmorphism & Brutalism**: A highly unique, high-contrast, visually engaging aesthetic.
- **Self-Hosted**: You maintain control of your API keys and Neon DB instance without passing them to an external, hosted agent service.

## Configuration (Settings Panel)
Upon logging into Mersal (default credentials `admin:admin`), you must configure the Settings Panel:
1. **OpenRouter API Key**: Obtain from [OpenRouter](https://openrouter.ai/).
2. **Model Name**: Recommended defaults include `meta-llama/llama-3-8b-instruct` or `google/gemini-pro`.
3. **Neon DB URL**: The direct Postgres connection string provided in your Neon DB dashboard (e.g., `postgresql://user:password@ep-name.region.aws.neon.tech/dbname?sslmode=require`).

## Development
To run locally:
```bash
npm install
npm run dev
```

*Note on Network Access*: If you access the dev server via an IP address (e.g. `http://100.120.253.88:3000`) and see WebSocket HMR errors in the console, start the server using `npm run dev -- -H 0.0.0.0` to allow the websocket hot-reloader to connect properly.

## Deployment
Mersal is configured for Docker containerization and auto-deployment to the GitHub Container Registry (GHCR) using GitHub Actions.

See `Dockerfile` and `.github/workflows/docker-deployment.yml` for specifics.

### Note on Directory Scanning in Production
> [!WARNING]  
> If deploying Mersal to a publicly accessible server, the Directory Scanner (`/api/scan`) should be disabled or protected, as it allows absolute file path reading. If you only deploy it locally or on a private home-server/container, it is safe to use.
