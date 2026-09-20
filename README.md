# MERN Task Board

A small full-stack task tracker built with MongoDB, Express, React, and Node.js.

## Local setup

1. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`.
2. Install dependencies:

   ```bash
   npm install
   npm run install:all
   ```

3. Start both applications:

   ```bash
   npm run dev
   ```

The client runs at `http://localhost:5173` and proxies `/api` calls to the API at
`http://localhost:5000`.

## Production

Run `npm run build`, set `NODE_ENV=production`, and start with `npm start`.
Express serves the generated React application from `client/dist`.

## Docker

Build and run the application with MongoDB:

```bash
docker compose up --build
```

Open `http://localhost:5000`. Data is stored in the named `mongo-data` volume.
Stop the stack with `docker compose down`.

## CI/CD

The workflow in `.github/workflows/ci-cd.yml` runs the client build, checks the
server source, and builds the Docker image for pull requests. Pushes to `main`
also publish two image tags to GitHub Container Registry:

- `ghcr.io/<owner>/<repository>:latest`
- `ghcr.io/<owner>/<repository>:sha-<short-commit>`

The workflow uses the repository's automatic `GITHUB_TOKEN`, so no registry
secret is required. A deployment job can consume the immutable SHA tag once a
hosting target is selected.

## API

- `GET /api/health`
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`
