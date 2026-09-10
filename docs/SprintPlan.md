# SwatStay Sprint Plan

## 1. Purpose

This sprint plan explains how Adnan and the GFix team should start building the SwatStay tourism platform.

Team:

- Adnan: full stack, architecture, backend lead
- Ahmed: full stack
- Asim: full stack
- Sana: frontend developer
- Samreen: testing team
- Wohaib: testing team

## 2. Development Strategy

Start with frontend prototype and API contracts.

Do not start with microservices.

Do not start with mobile app.

Do not connect every screen to APIs on day one.

Correct order:

1. Create repo and docs.
2. Create frontend screens with fake data.
3. Create API contract.
4. Create database schema.
5. Build backend endpoints.
6. Connect frontend to APIs one by one.
7. QA each module before merging.

## 3. Sprint 0: Project Setup

Duration: 2 to 3 days

Goal:

Create the project foundation so everyone can clone the repo and start cleanly.

### Adnan Tasks

- Create GitHub repository.
- Create monorepo structure.
- Set up pnpm workspace.
- Set up Turborepo.
- Add `apps/web`.
- Add `apps/admin`.
- Add `apps/provider`.
- Add `services/api`.
- Add `packages/ui`.
- Add `packages/types`.
- Add `docs`.
- Add `Design.md`.
- Add `Final_Project_Plan.md`.
- Add `ApiContract.md`.
- Add `DatabaseSchema.md`.
- Add `SprintPlan.md`.
- Add README with setup commands.

### Sana Tasks

- Read `Design.md`.
- Review homepage section requirements.
- Prepare frontend component list.
- Prepare sample package data.
- Prepare image requirements list.

### Ahmed Tasks

- Read `ApiContract.md`.
- Read `DatabaseSchema.md`.
- Review provider module.
- Prepare provider registration fields.

### Asim Tasks

- Read `ApiContract.md`.
- Read `DatabaseSchema.md`.
- Review admin module.
- Prepare admin screen list.

### Samreen and Wohaib Tasks

- Read `Design.md`.
- Read `Final_Project_Plan.md`.
- Create `QA_Checklist.md`.
- Create bug report template.

Sprint 0 deliverable:

- Repo ready
- Docs ready
- Everyone can run project locally

## 4. Sprint 1: Tourist Website Prototype

Duration: 5 to 7 days

Goal:

Build tourist-facing frontend screens with fake data.

### Sana Tasks

- Build homepage.
- Build package listing page.
- Build package detail page.
- Build booking request form.
- Build booking success page.
- Make all pages responsive.
- Follow `Design.md` exactly.
- Avoid all anti-slop design items.

### Adnan Tasks

- Review Sana's frontend structure.
- Set up shared UI package if needed.
- Create static data format for packages and destinations.
- Prepare backend booking module structure.

### Asim Tasks

- Start admin dashboard layout.
- Create sidebar.
- Create booking request table UI.
- Create call queue UI.

### Ahmed Tasks

- Start provider registration UI.
- Start provider dashboard layout.
- Create assigned booking card UI.

### QA Tasks: Samreen and Wohaib

- Test homepage responsive view.
- Test package listing responsive view.
- Test package detail responsive view.
- Test booking form validations.
- Check design against `Design.md`.

Sprint 1 deliverable:

- Tourist website prototype ready
- Admin and provider layout started
- QA report created

## 5. Sprint 2: Backend Foundation

Duration: 5 to 7 days

Goal:

Create backend foundation and database connection.

### Adnan Tasks

- Set up NestJS backend.
- Connect Supabase PostgreSQL.
- Set up Prisma.
- Add auth module structure.
- Add booking module.
- Add package module.
- Add environment variable examples.
- Add API response format.

### Ahmed Tasks

- Add provider module.
- Add provider registration endpoint.
- Add provider services endpoint.
- Add provider status values.

### Asim Tasks

- Add admin module.
- Add admin booking list endpoint.
- Add call confirmation endpoint.
- Add provider approval endpoint.

### Sana Tasks

- Continue frontend polish.
- Prepare frontend API service layer.
- Replace hardcoded types with shared TypeScript types where possible.

### QA Tasks: Samreen and Wohaib

- Test API responses using Postman or Thunder Client.
- Test validation errors.
- Test backend error format.
- Check that no frontend connects directly to database.

Sprint 2 deliverable:

- Backend running locally
- Database connected
- First core APIs ready

## 6. Sprint 3: Admin and Provider Workflows

Duration: 5 to 7 days

Goal:

Build admin-controlled booking and provider assignment flow.

### Adnan Tasks

- Build booking status lifecycle.
- Build provider suggestion logic.
- Build commission calculation base.

### Asim Tasks

- Connect admin booking list to API.
- Connect booking detail screen.
- Connect call confirmation action.
- Build provider suggestion screen.

### Ahmed Tasks

- Connect provider registration to API.
- Connect provider dashboard assigned bookings.
- Build provider accept/reject actions.
- Add Resend email notification base.

### Sana Tasks

- Improve tourist package UI based on QA feedback.
- Connect package listing to API.
- Connect package detail to API.
- Connect booking request form to API.

### QA Tasks: Samreen and Wohaib

- Test booking request flow.
- Test admin call confirmation.
- Test provider assignment.
- Test provider accept/reject.
- Test email notification trigger if available.

Sprint 3 deliverable:

- Main booking flow works from tourist request to provider assignment

## 7. Sprint 4: Payments, Files, and QA Polish

Duration: 4 to 6 days

Goal:

Prepare MVP for internal demo.

### Adnan Tasks

- Review all modules.
- Fix architecture issues.
- Prepare deployment setup for Vercel and Railway.
- Add production env example.

### Ahmed Tasks

- Add payment proof upload flow.
- Add payment status update endpoint.
- Add Cloudflare R2 or Supabase Storage integration.
- Add commission records.

### Asim Tasks

- Add admin payments screen.
- Add provider approval screen.
- Add reports starter screen.

### Sana Tasks

- Final frontend polish.
- Fix mobile layout issues.
- Add loading states.
- Add empty states.
- Add error states.

### QA Tasks: Samreen and Wohaib

- Full MVP regression test.
- Mobile testing.
- Form testing.
- Dashboard testing.
- Role-based access testing.
- Bug retesting.

Sprint 4 deliverable:

- MVP ready for demo

## 8. Sprint 5: Deployment and Internal Launch

Duration: 3 to 5 days

Goal:

Deploy the MVP and run internal testing.

### Adnan Tasks

- Deploy frontend to Vercel.
- Deploy backend to Railway.
- Connect Supabase database.
- Configure Resend.
- Configure file storage.
- Add production environment variables.
- Test production API.

### Team Tasks

- Run full booking demo.
- Test admin dashboard.
- Test provider dashboard.
- Test booking email.
- Test payment proof flow.
- Fix launch blockers.

### QA Tasks: Samreen and Wohaib

- Test production website.
- Test production admin dashboard.
- Test production provider dashboard.
- Create final launch QA report.

Sprint 5 deliverable:

- Internal MVP launch ready

## 9. Branch Workflow

Use this branch structure:

```txt
main
dev
feature/web-homepage
feature/web-packages
feature/admin-dashboard
feature/provider-dashboard
feature/api-bookings
feature/api-providers
feature/api-payments
```

Rules:

- No direct push to `main`.
- Work from `dev`.
- Create feature branches.
- Open pull request into `dev`.
- QA checks before merge.
- Adnan reviews important merges.

## 10. Daily Standup Format

Each team member should answer:

```txt
What did I finish yesterday?
What will I work on today?
What is blocking me?
```

## 11. QA Bug Format

```txt
Title:
Module:
Screen:
Device:
Browser:
Steps to reproduce:
Expected result:
Actual result:
Screenshot/video:
Priority:
Assigned to:
Status:
```

## 12. MVP Completion Checklist

- Tourist can browse packages.
- Tourist can submit booking request.
- Admin can view booking request.
- Support can confirm call.
- Admin can approve providers.
- Admin can assign providers.
- Provider can accept booking.
- Provider can reject booking.
- Payment status can be updated manually.
- Payment proof can be uploaded.
- Email notification works.
- Commission is calculated.
- Website is mobile responsive.
- Admin dashboard is usable.
- Provider dashboard is usable.
- Testing team has completed QA report.

