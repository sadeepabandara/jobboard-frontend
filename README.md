# TalentBoard — Frontend

A modern, responsive job board web application built with React, TypeScript, and Tailwind CSS. Deployed to Vercel with automatic deployments on every push.

## Live Demo

[https://jobboard-frontend-alpha.vercel.app](https://jobboard-frontend-alpha.vercel.app)

**Test credentials:**
- Email: `s3test@test.com`
- Password: `test123456`

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Icons | Lucide React |
| Auth | JWT (stored in localStorage) |
| Deployment | Vercel |

## Pages

| Route | Description | Auth Required |
|---|---|---|
| `/` | Home — hero search + recent listings | No |
| `/jobs` | Browse all jobs with search and filters | No |
| `/jobs/:id` | Job detail with apply modal + resume upload | No |
| `/post-job` | Create a new job listing | Yes |
| `/dashboard` | Track your applications and statuses | Yes |
| `/login` | Sign in to your account | No |
| `/register` | Create a new account | No |

## Features

- Job search and filter by type (Full-time, Part-time, Contract, Remote, Graduate)
- Resume upload on job applications (stored in AWS S3)
- Protected routes for authenticated actions
- Persistent auth with localStorage token storage
- Automatic redirect on token expiry
- Responsive design with clean corporate aesthetic
- Loading skeletons for async content

## Local Development

**Prerequisites:** Node.js 20+, jobboard-backend running on port 4000

```bash
# Clone the repo
git clone https://github.com/sadeepabandara/jobboard-frontend.git
cd jobboard-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:4000

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Environment Variables

```
VITE_API_URL=http://localhost:4000
```

For production, set `VITE_API_URL` to your deployed backend URL in Vercel's environment variable settings.

## Project Structure

```
src/
  ├── components/
  │   └── Navbar.tsx
  ├── context/
  │   └── AuthContext.tsx       # Global auth state + JWT management
  ├── pages/
  │   ├── Home.tsx
  │   ├── Jobs.tsx
  │   ├── JobDetail.tsx
  │   ├── PostJob.tsx
  │   ├── Dashboard.tsx
  │   ├── Login.tsx
  │   └── Register.tsx
  ├── App.tsx                   # Routes + protected route logic
  └── main.tsx
```

## Backend Repository

The API powering this frontend: [jobboard-backend](https://github.com/sadeepabandara/jobboard-backend)
