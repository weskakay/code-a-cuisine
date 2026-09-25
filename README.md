# Code à Cuisine

Recipe generator that turns the ingredients you already have at home into three recipe
ideas. Every generated recipe is stored and stays available in a public library, so
nobody needs an account to browse them.

The frontend is an Angular app. The recipes come from an automation workflow in n8n that
validates the request, asks an AI model for three recipes and writes the result to the
database.

![The start page](docs/home.png)

## What it does

1. You list what is in your kitchen, with amount and unit.
2. You say how many portions, how many cooks, how much time, which cooking style and
   which diet.
3. The workflow asks the model for exactly three recipes, checks the answer and stores it.
4. You get three suggestions, each with steps split by cook, waiting times and the
   nutritional values per portion and for the whole dish.
5. Every recipe stays in the library, browsable without an account.

Three recipes per address and day, twelve per day in total. A failed run gives the
attempt back.

| Library | One recipe |
|---|---|
| ![The library](docs/cookbook.png) | ![A recipe](docs/recipe.png) |

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

Check the code style:

```bash
npm run lint
```

Run the tests:

```bash
npm test
```

Build for production:

```bash
npm run build
```

## Pages

| Route | Content |
|---|---|
| `/` | start page |
| `/generate` | the ingredients you have |
| `/preferences` | portions, cooks, time, cuisine, diet |
| `/results` | the three suggestions |
| `/recipe/:id` | one recipe in full |
| `/cookbook` | the library, filtered by cooking style |
| `/imprint` | legal notice |

## Project structure

```text
src/app/components   screens and reusable parts
src/app/services     data access and shared logic
src/app/interfaces   the types shared with the workflow
src/styles           design tokens and base styles
n8n/workflows        exported automation workflows
```

## Hosting note for the workflow

n8n has to sit behind our own reverse proxy in production, with the proxy appending the
caller address to `x-forwarded-for` and `N8N_PROXY_HOPS` set to the number of proxies.
The daily limit reads the last entry of that header, so a caller cannot fake an address
and ask for more recipes than allowed.

## Data format

The app posts this to the workflow:

```json
{
  "ingredients": [{ "name": "Pasta", "amount": 100, "unit": "g" }],
  "portions": 2,
  "cookingTime": "quick",
  "cuisine": "italian",
  "diet": "vegetarian",
  "helpers": 2
}
```

`unit` is `g`, `ml` or `piece`. `cookingTime` is `quick`, `medium` or `complex`. `cuisine`
is one of german, italian, japanese, indian, gourmet, fusion. `diet` is vegetarian, vegan,
keto or none. Portions run from 1 to 12, helpers from 1 to 3.

The answer holds three saved recipes and what is left of the daily limit:

```json
{
  "recipes": [{ "id": "…", "title": "…", "steps": [], "nutritionPerPortion": {} }],
  "quota": { "remaining": 2, "limit": 3 }
}
```

Errors come back as `{ "error": "one sentence" }` with status 400 for a bad request, 429
when the limit is reached and 502 when the model broke the rules. The types live in
`src/app/interfaces/recipe.interface.ts`.

## Importing the workflows

The exported workflows live in `n8n/workflows/`.

Start n8n, open it, then use the menu next to the workflow name and pick Import from File.
Import `generate-recipes.json` and `error-handler.json`.

Credentials are not part of the export, so create them once in n8n and select them in the
nodes that need them:

| Credential | Used by |
|---|---|
| Google Gemini(PaLM) API | Gemini model |
| Supabase API, service role secret | Use quota, Save recipes |
| SMTP account | Send alert mail |

Publish `Error handler`, then open the settings of `Generate recipes` and pick it as the
error workflow. Publish `Generate recipes` last.

The database part lives in `supabase/schema.sql`. Run it once in the Supabase SQL editor.

## Licence

MIT
