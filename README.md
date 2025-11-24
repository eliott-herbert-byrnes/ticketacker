# TickeTacker

**Modern Full-Stack SaaS Ticketing Platform**

A production-ready ticketing and project management platform built with cutting-edge web technologies, demonstrating enterprise-grade architecture patterns including multi-tenancy, subscription billing, real-time collaboration, and secure file storage.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-626CD9?style=flat-square&logo=stripe)](https://stripe.com/)
[![AWS S3](https://img.shields.io/badge/AWS-S3-FF9900?style=flat-square&logo=amazon-aws)](https://aws.amazon.com/s3/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Project Background](#project-background)
- [Business Case](#business-case)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Core Functionality](#core-functionality)
- [Installation & Setup](#installation--setup)
- [Database Schema](#database-schema)
- [Authentication & Security](#authentication--security)
- [Subscription & Billing](#subscription--billing)
- [Background Jobs & Emails](#background-jobs--emails)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Developer](#developer)

---

## Overview

TickeTacker is a comprehensive SaaS ticketing platform designed for modern teams requiring robust issue tracking, project management, and collaboration capabilities. Built as a learning project to master contemporary full-stack web development, it showcases production-grade patterns including multi-tenant architecture, subscription billing, secure file storage, and asynchronous job processing.

**Core Value Proposition:**

- Multi-tenant organisation management with role-based access control
- Comprehensive ticket lifecycle management with threaded discussions
- Secure file attachments with AWS S3 integration
- Flexible subscription tiers with Stripe integration
- Professional email workflows powered by transactional email service
- Modern, responsive interface with dark mode support
- Type-safe full-stack development with end-to-end TypeScript

---

## 🎓 Project Background

### The Learning Journey

This project was conceived as an advanced learning exercise to develop expertise in modern full-stack web application development. Rather than building a simple tutorial application, the goal was to create a production-ready SaaS platform incorporating real-world architectural patterns and integrations that professional developers encounter daily.

**Learning Objectives:**

1. **Master Modern React & Next.js**: Understand React Server Components, Next.js 15 App Router, Server Actions, and streaming
2. **Full-Stack TypeScript**: Achieve end-to-end type safety from database to UI
3. **Enterprise Authentication**: Implement secure multi-tenant authentication with email verification and password reset flows
4. **Payment Integration**: Build complete subscription billing system with Stripe
5. **Cloud Infrastructure**: Integrate AWS S3 for secure file storage with presigned URLs
6. **Background Processing**: Implement asynchronous job processing and scheduled tasks
7. **Database Design**: Design normalised PostgreSQL schema with Prisma ORM
8. **Email Systems**: Create transactional email templates and delivery workflows
9. **UI/UX Excellence**: Build accessible, responsive interfaces with modern design systems
10. **Production Patterns**: Apply industry best practices for security, performance, and maintainability

### Why Ticketing?

Ticketing systems represent an ideal learning vehicle because they require:

- Complex data relationships (tickets, comments, attachments, users, organisations)
- Real-time collaboration features
- File upload and storage management
- Permission systems and access control
- Search, filtering, and pagination
- Email notifications and background jobs
- Subscription-based access tiers

These requirements mirror challenges encountered in virtually all modern web applications, making the knowledge highly transferable.

---

## 💼 Business Case

### The Problem

Small to medium-sized teams face several challenges when selecting ticketing and project management tools:

1. **Cost Barriers**: Enterprise solutions like Jira and ServiceNow are prohibitively expensive for small teams
2. **Complexity Overhead**: Many platforms are over-engineered for simple use cases
3. **Vendor Lock-In**: Proprietary formats make data migration difficult
4. **Privacy Concerns**: Sensitive project data stored on third-party servers
5. **Customisation Limitations**: Rigid workflows that don't adapt to team needs

### The Solution

TickeTacker addresses these pain points by providing:

**Affordable Pricing Model:**
- Free tier for small teams (up to 5 members)
- Transparent subscription tiers without per-user pricing traps
- Self-hosted option for teams requiring full data control

**Streamlined Workflow:**
- Clean, intuitive interface focused on essential features
- Fast ticket creation and minimal clicks to common actions
- Powerful search and filtering without overwhelming complexity
- Keyboard shortcuts for power users

**Data Ownership:**
- Open database schema built on PostgreSQL
- Export functionality for all data (tickets, comments, attachments)
- Self-hosting capability for complete control
- No proprietary formats or lock-in strategies

**Security & Privacy:**
- Self-contained authentication without third-party tracking
- Secure file storage with access controls
- Audit logs for compliance requirements
- EU data residency options

**Flexibility:**
- API-first architecture enabling custom integrations
- Webhook support for external workflow automation
- Customisable ticket fields and workflows
- Open-source foundation allowing modifications

### Target Market

**Primary Users:**
- Startups and small businesses (5-50 employees)
- Development teams requiring simple issue tracking
- Customer support teams needing ticket management
- Project managers coordinating team tasks
- Freelancers managing client projects

**Secondary Markets:**
- Educational institutions teaching project management
- Non-profit organisations with budget constraints
- Internal IT helpdesks at medium enterprises
- Agencies managing multiple client projects

### Competitive Advantages

1. **Modern Technology Stack**: Built on latest frameworks ensuring long-term maintainability
2. **Developer-Friendly**: Full TypeScript, comprehensive API, webhook support
3. **Performance**: Server-side rendering, optimistic updates, efficient caching
4. **Transparent Pricing**: Clear tiers without hidden fees or user limits
5. **Community-Driven**: Open development roadmap with user feedback integration

---

## ✨ Key Features

### **Comprehensive Ticket Management**

- Create, edit, archive, and delete tickets with full lifecycle tracking
- Rich text descriptions with markdown support
- Custom fields for priority, status, category, and assignees
- Ticket references and linking for relationship mapping
- Advanced search with full-text capabilities
- Filtering by status, priority, assignee, and date ranges
- Sorting by creation date, priority, last updated
- Pagination with configurable page sizes

### **Threaded Discussions**

- Comment system with markdown formatting
- Reply threading for organised conversations
- @mentions for user notifications
- Edit and delete permissions based on authorship
- Real-time comment updates
- Comment history and audit trail

### **Secure File Attachments**

- Drag-and-drop file upload interface
- AWS S3 storage with organisation-namespaced buckets
- Presigned URL generation for temporary secure access
- Automatic file type validation and size limits
- Thumbnail generation for images
- Virus scanning integration ready
- Attachment versioning support

### **Multi-Tenant Organisation Management**

- Create and manage multiple organisations per user
- Organisation switching without re-authentication
- Custom branding per organisation (logos, colours)
- Organisation-level settings and preferences
- Data isolation ensuring privacy between tenants
- Organisation transfer and ownership management

### **Membership & Access Control**

- Role-based permissions (Owner, Admin, Member, Guest)
- Invitation system with email-based onboarding
- Pending invitation management and resending
- Membership deactivation and reactivation
- Activity tracking per member
- Permission inheritance and custom role creation

### **Subscription & Billing**

- Multiple pricing tiers (Free, Professional, Enterprise)
- Stripe-powered checkout with secure payment processing
- Subscription management dashboard
- Automatic billing and invoice generation
- Usage-based limits per tier
- Upgrade/downgrade flows with prorated billing
- Cancellation with end-of-period access retention

### **Email Workflows**

- Welcome emails with onboarding steps
- Email verification with secure tokens
- Password reset with time-limited links
- Invitation emails with organisation context
- Ticket notification digests
- Billing and payment confirmations
- Custom email templates with React Email

### **Background Processing**

- Asynchronous job queue with Inngest
- Scheduled digest emails (daily, weekly)
- Automated cleanup of expired resources
- Bulk operations (import/export)
- Analytics aggregation jobs
- Webhook delivery retry logic

### **Modern User Interface**

- Responsive design optimised for mobile, tablet, and desktop
- Dark mode with system preference detection
- Keyboard shortcuts for power users
- Accessible components following WCAG guidelines
- Smooth animations and transitions
- Loading states and optimistic UI updates
- Toast notifications for user feedback

---

## 🛠️ Technology Stack

### **Frontend**

- **Framework**: Next.js 15 (App Router, React Server Components, Server Actions)
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4 (with CSS variables, dark mode)
- **Component Library**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Client State**: TanStack React Query v5
- **URL State**: nuqs (Next.js URL state management)
- **Form Handling**: React Hook Form with Zod validation
- **Rich Text**: Markdown editor with preview

### **Backend**

- **Runtime**: Node.js 18+
- **Framework**: Next.js API Routes & Server Actions
- **ORM**: Prisma 5 (with typed SQL preview)
- **Database**: PostgreSQL 15+
- **Authentication**: NextAuth.js v5 (JWT strategy)
- **Password Hashing**: @node-rs/argon2
- **Validation**: Zod schemas
- **File Storage**: AWS S3 SDK v3
- **Payment Processing**: Stripe SDK
- **Background Jobs**: Inngest
- **Email Delivery**: Resend API
- **Email Templates**: React Email

### **Infrastructure & DevOps**

- **Hosting**: Vercel
- **Database Hosting**: Vercel Postgres, Supabase, or self-hosted PostgreSQL
- **File Storage**: AWS S3 or S3-compatible (MinIO, DigitalOcean Spaces)
- **Email Service**: Resend, SendGrid, or AWS SES
- **Payment Gateway**: Stripe
- **Job Processing**: Inngest Cloud or self-hosted

### **Developer Tools**

- **Package Manager**: npm (or pnpm/yarn)
- **Code Quality**: ESLint 9
- **Type Checking**: TypeScript strict mode
- **Database Migrations**: Prisma Migrate
- **API Testing**: REST Client or Postman
- **Webhook Testing**: Stripe CLI, ngrok

---

## 🏗️ System Architecture

### **Application Architecture**

```
Browser Client
Next.js 15, React 19, TanStack Query
│
▼
Vercel Edge Network
Static Generation, ISR, Server-Side Rendering, Edge Functions
│
▼
Next.js Server (Node.js)
│
├─ React Server Components (RSC)
│   ├─ Data Fetching (Prisma)
│   ├─ Authentication (NextAuth)
│   └─ Authorisation Guards
│
├─ Server Actions
│   ├─ Ticket CRUD
│   ├─ Comment Management
│   ├─ Organisation Operations
│   ├─ Membership Management
│   └─ User Profile Updates
│
└─ API Routes
    ├─ NextAuth Endpoints (/api/auth/*)
    ├─ Stripe Webhooks (/api/stripe)
    ├─ S3 Presigned URLs (/api/aws/*)
    └─ Inngest Functions (/api/inngest)
│
▼
External Services
├─ PostgreSQL (Prisma ORM)
├─ AWS S3 (File Storage)
├─ Stripe API (Payments)
├─ Resend API (Emails)
└─ Inngest (Background Jobs)
```

### **Data Flow Architecture**

**Authenticated Request Flow:**

```
User Action (Browser)
    ↓
Server Component / Server Action
    ↓
Authentication Middleware (NextAuth)
    ├─ Verify JWT Token
    ├─ Load User Session
    └─ Check Email Verification
    ↓
Authorisation Guard
    ├─ Verify Organisation Membership
    ├─ Check Active Subscription
    └─ Validate Role Permissions
    ↓
Business Logic Layer
    ├─ Input Validation (Zod)
    ├─ Database Queries (Prisma)
    └─ External API Calls
    ↓
Response / Revalidation
    ├─ Return Data
    ├─ Trigger Background Jobs
    └─ Invalidate Caches
```

**File Upload Flow:**

```
User Uploads File (Browser)
    ↓
Server Action (Validation)
    ├─ Check File Type
    ├─ Verify Size Limits
    └─ Validate User Permissions
    ↓
AWS S3 Upload
    ├─ Generate Unique Key
    ├─ Namespace by Organisation
    └─ Upload to Bucket
    ↓
Database Record Creation
    ├─ Store Metadata
    ├─ Link to Ticket/Comment
    └─ Record Upload Timestamp
    ↓
Return Success / Generate Presigned URL
```

**Subscription Webhook Flow:**

```
Stripe Event (Webhook)
    ↓
Webhook Endpoint (/api/stripe)
    ├─ Verify Signature
    └─ Parse Event Data
    ↓
Event Handler (Switch by Type)
    ├─ checkout.session.completed
    ├─ customer.subscription.updated
    ├─ customer.subscription.deleted
    └─ invoice.payment_succeeded
    ↓
Database Update (Prisma Transaction)
    ├─ Update StripeCustomer Record
    ├─ Sync Subscription Status
    └─ Update Organisation Tier
    ↓
Trigger Side Effects (Inngest)
    ├─ Send Confirmation Email
    ├─ Update User Permissions
    └─ Log Event for Analytics
```

---

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

- Users 
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
