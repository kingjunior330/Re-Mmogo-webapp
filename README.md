# Re-Mmogo

Web app for managing motshelo (savings) groups. Built for INFS 202 group project.

## Live URLs

- Frontend: https://re-mmogo-webapp.vercel.app
- Backend:  https://re-mmogo-webapp.onrender.com
- GitHub:   https://github.com/kingjunior330/Re-Mmogo-webapp

## Figma
https://www.figma.com/design/wJeryoteVarxaojhNvvBmj/Re-mmogo-web-app?node-id=0-1

## What it does

- Members submit P1000/month contributions, signatories approve them
- Members can request loans, needs 2 different signatories to approve
- 20% monthly interest on loans (auto-accrued each time loans are fetched)
- Year-end reports show contributions, interest earned and payouts per member
- Optional proof-of-payment URL on contributions and loan repayments
- Users can be in multiple motshelo groups and switch between them

Roles per group:
- **Admin** — group creator, can promote/demote members, also counts as a signatory
- **Signatory** — can approve contributions, loans (needs 2 sigs total), and repayments
- **Member** — submits payments and applies for loans

Cap of 2 approvers per group total (admin counts as one).

## Tech Stack

- React 19 + Vite + React Router 7
- Node.js + Express 4
- MySQL hosted on Railway
- JWT auth (jsonwebtoken + bcryptjs)
- Deployed: frontend on Vercel, backend on Render

## Run locally

Backend:
```
cd backend
cp .env.example .env
# fill in your DB creds and a JWT_SECRET
npm install
npm run dev
```

Frontend:
```
npm install
npm run dev
```

Open http://localhost:5173 — Vite proxies `/api` to localhost:5000 in dev. Run `backend/schema.sql` against your MySQL to create the tables.

## Deployment

Backend (Render):
- Root directory: `backend`
- Build: `npm install`
- Start: `npm start`
- Env vars: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `JWT_SECRET`, `JWT_EXPIRE`, `CLIENT_URL`, `NODE_ENV=production`

Frontend (Vercel):
- Framework preset: Vite
- Root directory: `./`
- `vercel.json` rewrites `/api/*` to the Render backend URL — update that URL if your backend is named differently.
- After deploy, set `CLIENT_URL` on Render to the Vercel URL so CORS lets it through.

## How to test

1. Register an account at /register
2. Create a group (you become admin) OR join one with an invite code
3. Get a friend to register, then on the **Groups** page click **+ Add Member** and add them as a signatory (or promote an existing member with the **Make Signatory** button)
4. Submit a P1000 contribution from /contributions, then have the signatory approve it from /approvals
5. Apply for a loan, get both approvers to approve it on /approvals
6. Make a repayment with an optional proof URL
7. View the year-end report on /reports

To use multiple groups, click the group name dropdown in the sidebar and choose **+ Create or join another group**.

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new account |
| POST | /api/auth/login | Login, get JWT |
| GET  | /api/auth/me | Current user + active group |
| PUT  | /api/auth/profile | Update name + phone |
| PUT  | /api/auth/password | Change password |
| POST | /api/groups | Create a group (returns new JWT) |
| POST | /api/groups/join | Join by invite code (returns new JWT) |
| GET  | /api/groups/mine | Get active group details |
| GET  | /api/groups/my-groups | List every group you're in |
| POST | /api/groups/switch | Switch active group (returns new JWT) |
| GET  | /api/members | List members of active group |
| POST | /api/members | Add a member (signatory/admin only) |
| PUT  | /api/members/:id/role | Promote/demote (admin only) |
| GET  | /api/contributions | List contributions (`?mine=true` for own only) |
| POST | /api/contributions | Submit a P1000 contribution |
| PUT  | /api/contributions/:id/approve | Approve (signatory) |
| PUT  | /api/contributions/:id/reject | Reject (signatory) |
| GET  | /api/loans | List loans (`?mine=true` for own only) |
| POST | /api/loans | Apply for a loan |
| PUT  | /api/loans/:id/approve | Approve (needs 2 different signatories) |
| PUT  | /api/loans/:id/reject | Reject |
| POST | /api/loans/:id/repayments | Submit a repayment |
| GET  | /api/loans/:id/repayments | List repayments for a loan |
| GET  | /api/loans/repayments | All repayments in group (`?pending=true` for approval queue) |
| PUT  | /api/loans/repayments/:id/approve | Approve a repayment (signatory) |
| GET  | /api/reports/year-end | Year-end report |
