# Re-Mmogo

Web app for managing motshelo (savings) groups. Built for INFS 202 group project.

## Live URL
https://re-mmogo-three.vercel.app

## GitHub
https://github.com/kelvin-thale/RE-MMOGO

## Figma
https://www.figma.com/design/wJeryoteVarxaojhNvvBmj/Re-mmogo-web-app?node-id=0-1&t=Omsph6d9GaAJwQw4-1

## What it does
- Members submit P1000/month contributions, signatories approve them
- Members can request loans, needs 2 signatories to approve
- 20% monthly interest on loans
- Year-end reports show contributions, interest and payouts
- Roles: Admin (creates group), Signatory, Member

## Tech Stack
- React 19 + Vite
- Node.js + Express
- MySQL (Railway)
- JWT auth

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

## Deployment
Backend on Render, frontend on Vercel. DB hosted on Railway.

Set `VITE_API_URL` on Vercel to the Render backend URL. Set `CLIENT_URL` on Render to the Vercel URL.

## How to test
1. Register an account
2. Create a group (you become admin)
3. Get a friend to register too, then add them as a signatory from the Members page
4. Make a contribution, then login as the signatory to approve

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| POST | /api/groups | Create group |
| POST | /api/groups/join | Join by code |
| GET | /api/members | List members |
| POST | /api/members | Add member |
| GET | /api/contributions | List |
| POST | /api/contributions | Submit |
| PUT | /api/contributions/:id/approve | Approve |
| PUT | /api/contributions/:id/reject | Reject |
| GET | /api/loans | List loans |
| POST | /api/loans | Apply |
| PUT | /api/loans/:id/approve | Approve (needs 2) |
| PUT | /api/loans/:id/reject | Reject |
| POST | /api/loans/:id/repayments | Submit repayment |
| PUT | /api/loans/repayments/:id/approve | Approve repayment |
| GET | /api/reports/year-end | Year end report |
