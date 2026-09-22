# Code à Cuisine

Recipe generator that turns the ingredients you already have at home into three recipe
ideas. Every generated recipe is stored and stays available in a public library, so
nobody needs an account to browse them.

The frontend is an Angular app. The recipes come from an automation workflow in n8n that
validates the request, asks an AI model for three recipes and writes the result to the
database.

## Status

In development. The setup and the data layer are in place, the workflow and the screens
follow.

## Tech stack

- Angular 22, standalone components, signals, reactive forms
- SCSS with design tokens
- n8n for the automation workflow, running in Docker
- Supabase as the database

## Requirements

- Node.js 24 and npm 11
- Docker Desktop

## Setup on macOS

Clone the repository:

```bash
git clone <repository-url>
```

Change into the folder:

```bash
cd code-a-cuisine
```

Install the dependencies:

```bash
npm ci
```

Copy the environment file:

```bash
cp .env.example .env
```

Start the app:

```bash
npm start
```

## Setup on Windows

Clone the repository:

```powershell
git clone <repository-url>
```

Change into the folder:

```powershell
cd code-a-cuisine
```

Install the dependencies:

```powershell
npm ci
```

Copy the environment file:

```powershell
copy .env.example .env
```

Start the app:

```powershell
npm start
```

The app runs on http://localhost:4200.

## Running n8n

Start n8n in the background:

```bash
docker compose up -d
```

Stop it again:

```bash
docker compose down
```

The editor runs on http://localhost:5678. Workflows are stored in the Docker volume
`n8n_data` and survive a restart.

## Scripts

```bash
npm run lint
```

```bash
npm test
```

```bash
npm run build
```

## Project structure

```text
src/app/components   screens and reusable parts
src/app/services     data access and shared logic
src/app/interfaces   the types shared with the workflow
src/styles           design tokens and base styles
n8n/workflows        exported automation workflows
```

## Data format

The JSON contract between the app and the workflow is described here once it is in place.

## Importing the workflow

The exported workflows live in `n8n/workflows/`. The import steps follow with the first
workflow.

## Licence

MIT
