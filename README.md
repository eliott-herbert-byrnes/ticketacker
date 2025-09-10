# TickeTacker

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/) [![Stripe](https://img.shields.io/badge/Stripe-API-626CD9?logo=stripe&logoColor=white)](https://stripe.com/) [![AWS S3](https://img.shields.io/badge/AWS-S3-FF9900?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/s3/) [![Inngest](https://img.shields.io/badge/Inngest-Events-000000)](https://www.inngest.com/)

A modern, full‑stack SaaS starter built with Next.js App Router that showcases product‑grade architecture: authentication, organizations and memberships, ticketing with comments and attachments hosted on s3, subscriptions and billing with Stripe, background jobs with Inngest, transactional emails, and a polished UI powered by Tailwind and shadcn/ui.

## Highlights

- **Tickets & comments**: Create, list, search, sort, paginate, and reference tickets; threaded comments.
- **Attachments**: Secure S3 file access via short‑lived presigned URLs.
- **Auth**: Username/password with `next-auth` (JWT sessions) and Prisma adapter; email verification and password reset flows.
- **Organizations & memberships**: Invite users, manage roles, track active membership, and gate private content.
- **Subscriptions**: Stripe products, prices, checkout, and webhooks to sync subscription state per organization.
- **Background jobs**: Inngest functions for email workflows and periodic digests.
- **Transactional emails**: React Email + Resend for consistent, type‑safe email templates.
- **Modern UI/UX**: Tailwind CSS v4, shadcn/ui components, theme support, responsive layout, and nuanced motion.
- **DX**: TypeScript everywhere, Prisma typed SQL, React Query, and modular feature folders.

## Live demo

- `https://ticketacker.com`

## Tech stack

- **Runtime**: Node.js + Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS 4, shadcn/ui, lucide-react icons
- **State/Data**: React Server Components, `@tanstack/react-query` for client data fetching
- **Auth**: `next-auth` (JWT) + Prisma Adapter
- **ORM/DB**: Prisma, PostgreSQL
- **Background jobs**: Inngest (`/api/inngest` endpoint)
- **Emails**: React Email + Resend
- **Storage**: AWS S3 (attachments, signed URLs)
- **Payments**: Stripe (Products, Prices, Checkout, Webhooks)

## Repository structure

```
src/
  app/                 # App Router routes, layouts, API routes
    (authenticated)/   # Auth‑protected routes wrapper
    api/               # API endpoints (auth, stripe, aws, inngest)
    _navigation/       # Header, sidebar
    _providers/        # Providers (React Query)
    ...                # Public pages: sign-in/up, onboarding, pricing, etc.
  components/          # Reusable UI and helpers (shadcn/ui based)
  features/            # Domain‑oriented feature modules
    attachments/       # S3 integration, presigned URLs, UI
    auth/              # Sign-in, session, verification, password reset
    invitation/        # Invite flow and events
    membership/        # Membership queries and actions
    organization/      # Organization CRUD and queries
    stripe/            # Products, prices, checkout, webhooks
    ticket/            # Ticket CRUD, list/search/sort/pagination
    ...
  emails/              # React Email templates
  infra/               # Infrastructure adapters (S3 storage)
  lib/                 # Shared libs (auth, prisma, inngest, stripe, aws)
  utils/               # Utilities (currency, crypto, urls)
prisma/
  schema.prisma        # DB schema
  seed.ts              # Database seed
```

## Getting started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account (test mode)
- AWS S3 bucket and credentials (for attachments)
- Resend account (for email)

### Installation

```bash
npm install
npm run prisma-seed   # Seed the database (creates users, org, tickets, comments)
npm run stripe-seed   # Seed Stripe Products/Prices and a Customer (optional, requires org seeded)
```

Then start the dev server:

```bash
npm run dev
```

App runs at `http://localhost:3000`.

### Default seed data

- Users (password for all: `geheimnis`)
  - admin: `admin@admin.com`
  - user: `eliott.c.h.byrnes@googlemail.com`
- One organization with both users as members
- Sample tickets and comments

## Environment variables

Create a `.env` file at the project root and set the following values.

Database:
- `DATABASE_URL`=postgres connection string
- `DIRECT_URL`=postgres direct connection string (for Prisma)

Auth:
- `AUTH_SECRET` or `NEXTAUTH_SECRET`=random 32+ char string

Stripe:
- `STRIPE_SECRET_KEY`=sk_test_...
- `STRIPE_WEBHOOK_SECRET`=whsec_...

AWS S3:
- `AWS_BUCKET_NAME`=your-bucket
- `AWS_BUCKET_REGION`=eu-west-1 (example)
- `AWS_ACCESS_KEY`=...
- `AWS_SECRET_ACCESS_KEY`=...

Resend:
- `RESEND_API_KEY`=re_...

Runtime:
- `NODE_ENV`=development

Optional (platform):
- `NEXT_PUBLIC_VERCEL_URL`=project-url.vercel.app (used for absolute URL building)

## Scripts

- `npm run dev`: Start Next.js dev server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Lint the project
- `npm run lint-fix`: Lint with auto‑fix
- `npm run type`: Type‑check with TypeScript
- `npm run prisma-seed`: Seed the database (`prisma/seed.ts`)
- `npm run stripe-seed`: Seed Stripe (products, prices, and a customer)
- `npm run seed`: Runs both DB and Stripe seeds
- `npm run email`: Start React Email preview server for templates in `src/emails`

## Key flows

- **Authentication**: `next-auth` with Credentials provider; secure password hashing via `@node-rs/argon2`. JWT strategy with Prisma adapter and user metadata enrichment.
- **Authorization guard**: `get-auth-or-redirect` enforces login, email verification, organization presence, and active membership before accessing protected routes.
- **Tickets**: Server component `TicketList` fetches via feature query, supports search params with `nuqs`, sorting, pagination, and org filtering.
- **Attachments**: API route generates S3 presigned URLs per attachment and streams content with a download header. Keys are namespaced by organization and entity.
- **Billing**: Pricing page lists active Stripe products and prices; checkout sessions are created client‑side and webhooks (`/api/stripe`) update the `StripeCustomer` record and subscription state.
- **Background jobs**: Inngest functions are served from `/api/inngest` and trigger email workflows and scheduled jobs.
- **Emails**: Templates in `src/emails` (React Email); sent via Resend.

## Development notes

- Tailwind v4 and shadcn/ui are used for consistent, accessible UI.
- React Query is provided globally for client components that need client‑side fetching.
- Prisma uses typed SQL preview features and a conventional Postgres schema.
- The app uses Next.js App Router (server components by default) with selective client components.

## Running webhooks locally

- Stripe: use the Stripe CLI to forward events to the local webhook.
```bash
stripe listen --forward-to localhost:3000/api/stripe
```
- Inngest: see Inngest docs for dev server or cloud‑based triggers.

## Deployment

- Provision Postgres and set `DATABASE_URL` and `DIRECT_URL`.
- Configure Stripe keys and add the webhook endpoint (`/api/stripe`).
- Configure AWS S3 bucket and credentials with least privilege.
- Set `RESEND_API_KEY` for email.
- Build and run with `npm run build && npm run start` (or deploy to Vercel). Ensure environment variables are set for the host environment.

## Security considerations

- Passwords hashed with Argon2.
- JWT session strategy; secrets loaded from env.
- Presigned URLs scoped and short‑lived.
- Feature APIs validate membership and email verification before access.

## License

This project is provided as a portfolio/reference. No warranty. Use at your own risk.
