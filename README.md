# Real Estate Sorter

Email-driven real estate deal filtering and extraction workflow built with Node.js.

## What It Does

- reads Gmail messages through OAuth credentials
- filters likely real-estate deal emails
- parses deal content with Anthropic
- writes extracted rows into a CSV output

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set `ANTHROPIC_API_KEY`.

3. Create `credentials.json` from `credentials.example.json` and fill in your Gmail OAuth app values.

4. Start the server:

```bash
npm start
```

## Security

This public snapshot intentionally excludes:

- live OAuth credentials
- access tokens
- local runtime state
- installed dependencies

Use the example files in this repo and supply your own secrets locally.
