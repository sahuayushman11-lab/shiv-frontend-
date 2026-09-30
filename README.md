# TeenExpense Tracker

A teen-friendly expense tracker that records income and spending, visualizes habits with charts, tracks monthly budgets and savings goals, and provides practical spending insights.

## Live frontend

Open the deployed application at
`https://shiv-frontend-6lih62wla-ayushman13.vercel.app/login`.

## Tech stack

- Frontend: React, Vite, Tailwind CSS, Recharts
- Backend: Node.js, Express, MVC architecture
- Database: Supabase PostgreSQL
- Security: bcrypt password hashing and JWT authentication

## Project structure

```text
teen-expense-tracker/
├── frontend/  # React application
└── backend/   # Express API
```

## Run locally

1. Configure `backend/.env` from `backend/.env.example`.
2. Configure `frontend/.env` from `frontend/.env.example`.
3. Start the backend:

   ```bash
   cd backend
   npm run dev
   ```

4. Start the frontend in another terminal:

   ```bash
   cd frontend
   npm run dev
   ```

The app is served at `http://localhost:5173` and the API runs at `http://localhost:5000`.

## Deployed API

The production backend is available at
`https://teenexpense-tracker-backend-jsqk.onrender.com/api`.

Set `VITE_API_URL` to this value when deploying the frontend.

## Environment variables

Backend:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=replace-with-a-long-random-value
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=server-only-secret
CORS_ORIGIN=http://localhost:5173
```

Never commit `.env` files or expose the Supabase service key in the frontend.
