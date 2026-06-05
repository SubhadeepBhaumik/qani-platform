# QANI — Production Backlog (Updated)
## Last updated: June 2026 — Post Phase 3 + Backlog Completion

---

## ✅ COMPLETED — Phase 3 + Backlog Items

### Candidate Portal (Phase 3) — COMPLETE
- [x] Dashboard with real stats, activity history, complete screening quick link
- [x] Browse Jobs with 25 real jobs (Atlassian, Canva, Seek), dynamic filters, pagination, apply button on cards
- [x] Job detail with company name, salary, employment type, nice-to-have requirements
- [x] AI Screening Chat with real GPT-4o-mini, mandatory questions (location, work rights, salary, experience, driver's licence)
- [x] Real AI scoring based on job context and answer quality
- [x] Resume/End screening with score saved to application
- [x] Session persists across logout/login
- [x] My Applications page with dedicated sidebar nav
- [x] Application detail with scorecard, recruiter notes, interview scheduling
- [x] Profile with all fields (LinkedIn, GitHub, work rights, salary expectation, available from, CV upload)
- [x] Notifications with mark read, mark all read, click navigation, interview modal
- [x] Settings with privacy toggle, notification preferences
- [x] URL routing fixed (direct URL paste works)
- [x] Notifications on apply, screening start, screening complete
- [x] Recruiter notified when candidate completes screening

### Recruiter Backlog — COMPLETE
- [x] JOBS-01: Job expiry date field with auto-notification 1 day before closing
- [x] COMPARE-01: Candidate comparison modal with score bars (side-by-side)
- [x] REPORTS-01: CSV export with real application data
- [x] APPS-02: Interview scheduling — recruiter sets date, candidate gets notification, Google Calendar for both
- [x] Create job form reset bug fixed
- [x] All "Gemini" text replaced with QANI AI / OpenAI
- [x] Mandatory screening questions (location, work rights, salary, experience, driver's licence) — recruiter configurable
- [x] Interview confirmation flow: candidate confirms → recruiter gets notification → recruiter opens Google Calendar

---

## 🔴 CRITICAL — Must complete before public launch (Phase 6)

### AUTH-01: Team Invite Real Email
- **Where:** `/recruiter/team` → Invite Team Member
- **Current state:** UI saves to list with "Pending" — no email sent, no account created
- **Needs:** SendGrid email with signup link

### AUTH-02: OTP Real Delivery (Email + SMS)
- **Where:** `/recruiter/settings` and `/candidate/settings` → Change Email / Change Phone
- **Current state:** Demo OTP hardcoded as `123456`
- **Needs:** SendGrid for email OTP, Twilio for SMS OTP

### NOTIFY-01: Real Email Notifications
- **Where:** All notification triggers
- **Current state:** In-app notifications work. No real emails sent.
- **Needs:** SendGrid integration

### DB-01: PostgreSQL Persistence
- **Where:** All backend controllers
- **Current state:** In-memory arrays — data resets on server restart
- **Needs:** PostgreSQL + Prisma (schema already exists)

### JWT-01: Token Expiry Extension
- **Where:** Backend auth
- **Current state:** JWT expires in 15 minutes — candidate gets logged out mid-screening
- **Needs:** Extend to 24h before client demo

---

## 🟡 IMPORTANT — Complete before client demo

### CAND-01: Candidate Profile Photo Upload
- **Where:** Candidate portal → Profile
- **Current state:** Avatar shows initials only
- **Needs:** File upload → base64 → show in sidebar and dashboard
- **Note:** CV upload works, same pattern needed for photo

### APPS-01: CV Shown in Recruiter Application Detail
- **Where:** Recruiter app detail → CV field
- **Current state:** Shows "No CV uploaded" — candidate uploads CV to profile but not linked to application
- **Needs:** Pass candidate CV from profile to application record

### PASS-01: Password Change Backend
- **Where:** Candidate and Recruiter settings
- **Current state:** UI shows "coming soon" toast
- **Needs:** Backend endpoint + OTP verification (depends on AUTH-02)

### SCORING-01: Job-Specific AI Screening System Prompt
- **Where:** Screening controller
- **Current state:** Generic system prompt — doesn't use job's custom screening questions fully
- **Needs:** Pass job's custom questions + weights into GPT system prompt

---

## 🟢 NICE TO HAVE — Post-launch

### REPORTS-02: Applications Over Time Chart
- Real data bar chart showing applications per week using live data

### ADMIN-01: Real Invoice PDF Download
- PDF generation from admin finance panel

### SEARCH-01: Elasticsearch Full-Text Search
- Replace in-memory filter with proper search engine

### CHUNK-01: Bundle Size Optimisation
- Current bundle: ~930KB — add code splitting via vite manualChunks

### SSL-01: HTTPS
- Add SSL certificate via Let's Encrypt

---

## 📋 PHASE TRACKER

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Complete | Admin panel, CMS |
| Phase 2 | ✅ Complete | Full recruiter module |
| Phase 3 | ✅ Complete | Full candidate portal |
| Phase 3.5 | ✅ Complete | Backlog items (comparison, interview, CSV, job expiry) |
| Phase 4 | 🔄 NEXT | End-to-end testing all 3 scenarios |
| Phase 5 | ⏳ Pending | AI screening refinement (system prompts, scoring tuning) |
| Phase 6 | ⏳ Pending | Production: SSL, PostgreSQL, SendGrid, Twilio, S3 |

---

## 🔧 TECHNICAL DEBT

| Item | Priority | Note |
|------|----------|------|
| In-memory data resets on restart | HIGH | Replace with PostgreSQL in Phase 6 |
| JWT 15min expiry | HIGH | Extend before client demo |
| localStorage CMS data | MED | Move to database in Phase 6 |
| Bundle 930KB | MED | Add code splitting |
| No HTTPS | HIGH | Add SSL before production |
| Candidate CV not linked to application | MED | Phase 6 with S3 |

