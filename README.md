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

## API

- `GET /api/health`
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`
