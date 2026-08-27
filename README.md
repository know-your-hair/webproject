# KnowYourHair

A hair porosity test, routine builder, and scalp check-in, backed by an
Express + MongoDB API. Static guide pages for oils, ingredients, common
mistakes, and hair concerns.

## Stack
- Frontend: plain HTML/CSS/JS (`/client`)
- Backend: Node.js + Express (`/server`)
- Database: MongoDB (Mongoose), auth via bcrypt + JWT

## Run locally

```bash
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev             # nodemon, http://localhost:5000
```

The Express server also serves the `client/` folder, so the whole
app — pages and API — runs from one server on one port.

## Project structure

```
client/            static frontend
  index.html
  pages/           take-test, get-routine, scalp-analysis, oils,
                    ingredients, mistakes, concerns, about
  css/style.css
  js/               api.js (fetch wrapper), main.js (header/footer/auth
                     modal), and one script per interactive page

server/
  server.js
  config/db.js
  models/           User, TestResult, Routine, ScalpAnalysis
  routes/           auth, tests, routines, scalp
  middleware/auth.js
```

## API

| Method | Route              | Auth | Body                                          |
|--------|--------------------|------|------------------------------------------------|
| POST   | /api/auth/signup   | No   | `{ email, password }`                           |
| POST   | /api/auth/login    | No   | `{ email, password }`                           |
| POST   | /api/tests         | Yes  | `{ porosity }`                                  |
| GET    | /api/tests         | Yes  | —                                                |
| POST   | /api/routines      | Yes  | `{ porosity, steps: [...] }`                    |
| GET    | /api/routines      | Yes  | —                                                |
| POST   | /api/scalp         | Yes  | `{ flakiness, itchiness, oiliness, notes }`     |
| GET    | /api/scalp         | Yes  | —                                                |

Protected routes need `Authorization: Bearer <token>`.

## Deploy

1. **MongoDB Atlas**: create a free (M0) cluster, a database user, and
   allow network access from anywhere (`0.0.0.0/0`) for a small project.
   Copy the connection string into `MONGO_URI`.
2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<you>/knowyourhair.git
   git push -u origin main
   ```
3. **Deploy on Render** (render.com): New → Web Service → connect this
   repo → build command `npm install` → start command `npm start` →
   add `MONGO_URI` and `JWT_SECRET` as environment variables in the
   dashboard. This single service serves both the API and the static
   frontend.

## Notes
- This is general hair-care information, not medical advice — every
  relevant page says so.
- `.env` is gitignored; never commit real secrets. Use `.env.example`
  as the template.
