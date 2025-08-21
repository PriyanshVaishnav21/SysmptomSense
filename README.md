# SymptomSense-AI Hub

This is a full‑stack app with a React (Vite) frontend and an Express + MongoDB backend. You can run it locally or via Docker Compose.

## Run locally (backend + frontend)

Prereqs: Node 18+, npm, and a MongoDB instance (local or Atlas).

1) Backend (API)
- Create `server/.env` with:
	- PORT=4000
	- MONGODB_URI=<your_mongodb_uri>
	- JWT_SECRET=<any_secret>
	- OPENAI_API_KEY=<your_openai_key>
	- CORS_ORIGIN=http://localhost:8080
- Start API
```powershell
cd server
npm install
npm run start
```
- Health check: http://localhost:4000/api/health route

2) Frontend (Vite)
- Create `.env` at repo root:
```env
VITE_API_URL=http://localhost:4000
```
- Start Vite
```powershell
cd ./
npm install
npm run dev
```
- Open http://localhost:8080

## Run with Docker Compose (3 containers)

This spins up:
- symptomsense_frontend (Nginx serving built SPA on 8080)
- symptomsense_backend (Express API on 4000)
- symptomsense_database (MongoDB on 27017)

1) Provide secrets for backend (do not commit):
- Create a `.env` file next to `docker-compose.yml`:
```env
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=sk-...
```

2) Build and run containers
```powershell
docker compose up -d --build
```

3) Access
- App: http://localhost:8080
- API health: http://localhost:4000/api/health

Notes
- The frontend is built with `VITE_API_URL` pointing to `http://localhost:4000` by default. To serve everything on one port (8080), proxy `/api` in `nginx.conf` and build with `VITE_API_URL=/api`.
- If you prefer MongoDB Atlas instead of the DB container, remove the database service and set `MONGODB_URI` to your Atlas URI under the backend service.

## Tech stack
- React, Vite, TypeScript, Tailwind, shadcn-ui
- Express, Mongoose, JSON Web Tokens
- OpenAI API integration
