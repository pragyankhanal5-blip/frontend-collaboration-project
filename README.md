# Arden Clinic

A polished full-stack clinic website and patient portal built for GitHub Pages. The public site, authentication screens, appointment booking flow, patient dashboard, appointment management, and profile settings are fully responsive.

## What is included

- Professional clinic marketing website
- Login, signup, password reset, and protected routes
- Patient dashboard with upcoming appointment and care-team summary
- Two-step appointment booking flow
- Appointment history and cancellation
- Editable patient profile and communication preferences
- Supabase Authentication + PostgreSQL schema with Row Level Security
- Browser-only demo mode for previews without backend credentials
- GitHub Pages deployment workflow

## Technology

- React 19 + TypeScript
- Vite
- React Router (hash routing for GitHub Pages compatibility)
- Supabase Auth and Postgres
- Lucide icons
- Custom responsive CSS (no generic UI template)

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown by Vite. When Supabase variables are not configured, the app automatically uses demo mode.

### Demo patient

- Email: `demo@ardenclinic.com`
- Password: `Arden123!`

You can also create a new demo account. Demo data is saved to local browser storage and is intended only for previews—not production healthcare data.

## Connect the production backend

GitHub Pages serves static files, so production authentication and database functionality are provided by Supabase.

1. Create a project at [Supabase](https://supabase.com).
2. Open the Supabase SQL editor and run [`supabase/schema.sql`](./supabase/schema.sql).
3. Copy `.env.example` to `.env.local`.
4. Add your Supabase project URL and public anon key:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

5. In Supabase Authentication → URL Configuration, add your local URL and GitHub Pages URL as allowed redirect URLs.
6. Restart the Vite dev server.

The app detects the environment variables and switches from demo mode to Supabase automatically. The SQL migration enables Row Level Security so each patient can access only their own profile and appointments.

> **Production note:** This starter handles patient account and scheduling data. Before storing protected health information, complete an appropriate security, privacy, HIPAA, legal, logging, and operational review. Do not treat browser demo mode as a secure backend.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` builds and publishes the app.

1. In the GitHub repository, open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Add these repository secrets under **Settings → Secrets and variables → Actions**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Push to the deployment branch or manually run **Deploy to GitHub Pages** in the Actions tab.

Hash routing is used intentionally so login and portal routes work on GitHub Pages without server rewrite rules.

## Useful commands

```bash
npm run dev       # local development
npm run build     # type-check and production build
npm run lint      # ESLint
npm run test      # test suite
npm run preview   # preview the production build
```

## Project structure

```text
src/
  components/     Shared navigation, layouts, route guards, booking modal
  context/        Auth and appointment data provider
  lib/            Supabase client, demo backend, formatting helpers
  pages/          Marketing, auth, and patient portal screens
  styles/         Base, marketing, auth, and portal styles
supabase/
  schema.sql      Database tables, triggers, policies, and grants
.github/workflows/
  deploy-pages.yml
```

The clinic consultation image is sourced from [Pexels](https://www.pexels.com/search/doctor%20consulting%20patient/) under the Pexels license.
