# QANI PLATFORM - COMPLETE MASTER DOCUMENTATION
## EVERYTHING INCLUDED - NOTHING LEFT OUT

**Created:** May 31, 2026
**Status:** CRITICAL LIFE-OR-DEATH SITUATION
**Owner:** Subhadeep Bhaumik (bhaumiksubhadeep@gmail.com)
**Family:** Wife + 9-year-old son DEPEND on this project
**Situation:** If this fails → Family in financial ruin → Developer will commit suicide with family
**This is:** ABSOLUTE LAST RESORT

---

## 🚨 CRITICAL SITUATION - NOT TO BE IGNORED

**Developer's Mental State:**
- In severe financial crisis
- Wife and 9-year-old son depend entirely on this project
- This is the ONLY way to earn money
- Suicidal ideation present
- Previous attempts have failed

**What This Means:**
- NO DELAYS
- NO FAILURES
- COMPLETE SUCCESS REQUIRED
- EVERY STEP MUST WORK
- TESTING MANDATORY
- NO SHORTCUTS

**Timeline:** IMMEDIATE - Must be earning-ready within days, not weeks

---

## ✅ WORK ALREADY COMPLETED

### Backend (100% DONE)
- ✅ Node.js + Express server running on port 5001
- ✅ TypeScript configured
- ✅ PostgreSQL database schema (13 tables)
- ✅ Prisma ORM set up
- ✅ 78+ API endpoints implemented (see API list below)
- ✅ JWT authentication working
- ✅ OpenAI GPT-4o-mini integration for screening
- ✅ SendGrid email integration
- ✅ Error handling & validation
- ✅ Audit logging
- ✅ PM2 process management configured
- ✅ Deployed on Vultr (139.180.181.11)
- ✅ Backend running: http://139.180.181.11:5001 (ALIVE)
- ✅ Health check working: /api/v1/health → {status: ok}

### Database (100% DONE)
- ✅ PostgreSQL 15 on Vultr
- ✅ All 13 tables created
- ✅ Relationships configured
- ✅ 20+ demo candidates seeded
- ✅ 5 demo jobs created
- ✅ Sample applications created
- ✅ Data persisting properly

### Frontend (PARTIALLY DONE)
- ✅ React 18 + Vite project created
- ✅ Tailwind CSS configured
- ✅ TypeScript set up
- ❌ UI needs to match Google AI Studio EXACTLY
- ❌ Landing page routing needs fix (currently shows dashboard for new users)
- ❌ All pages need to be designed exactly like Google mockup
- ❌ Not connected to backend APIs properly yet
- ❌ Testing incomplete

### Deployment (PARTIALLY DONE)
- ✅ GitHub repo created: https://github.com/SubhadeepBhaumik/qani-platform
- ✅ Vultr server running (139.180.181.11)
- ✅ Nginx configured to proxy port 80
- ✅ PM2 managing backend & frontend processes
- ✅ Both services running (qani-backend ONLINE, qani-frontend ONLINE)
- ❌ Frontend UI not matching design
- ❌ qani.io showing wrong page for new users
- ❌ Frontend-backend API integration incomplete

### Features (ALL BUILT IN BACKEND)
✅ Sprint 1: Authentication (register, login, email verify, password reset)
✅ Sprint 2: Job Management (create, edit, delete jobs)
✅ Sprint 3: Applications (apply, track, update status)
✅ Sprint 4: AI Screening (conversational, real-time evaluation)
✅ Sprint 5: Scoring (5-area qualification, weighted scoring)
✅ Sprint 6: Dashboard (stats, pipeline, analytics)
✅ Sprint 7: Notifications (email, in-app)
✅ Sprint 8: Admin & Audit (user management, logs)

---

## 🔐 API KEYS & CREDENTIALS (PRODUCTION)

### OpenAI (AI Screening Engine)
```
API Key: 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
Model: gpt-4o-mini
Purpose: Conversational candidate screening, evaluation, scoring
Status: ACTIVE & WORKING
```

### SendGrid (Email Service)
```
API Key: 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
From Email: noreply@qani.io
Purpose: Registration confirmations, screening results, notifications
Status: ACTIVE & WORKING
```

### JWT Authentication
```
Secret: qani-production-secret-key-2026
Algorithm: HS256
Token Expiry: 24 hours
Purpose: User session management, API protection
Status: ACTIVE & WORKING
```

### Database
```
Host: localhost on Vultr (139.180.181.11)
Port: 5432
Database: qani_dev
User: postgres
Password: [Secure on Vultr]
Purpose: Store all users, jobs, applications, screening data
Status: RUNNING & CONNECTED
```

### GitHub
```
Repository: https://github.com/SubhadeepBhaumik/qani-platform
Branch: main
Access: Subhadeep's account
Purpose: Version control, code storage
Status: ACTIVE
```

### Vultr Server
```
IP: 139.180.181.11
Location: Sydney, Australia
OS: AlmaLinux 8
SSH: root@139.180.181.11
Purpose: Production deployment
Domain: qani.io → 139.180.181.11
Status: RUNNING & ONLINE
```

---

## 🔄 DEPLOYMENT PROCESS (localhost → GitHub → Vultr → qani.io)

### PHASE 1: Local Development (Mac)

**Directory:** ~/Desktop/qani-platform/

**Structure:**
```
qani-platform/
├── backend/
│   ├── src/
│   │   ├── main.ts (Express app)
│   │   ├── routes/ (API endpoints)
│   │   ├── controllers/ (business logic)
│   │   ├── services/ (OpenAI, SendGrid, etc)
│   │   └── middleware/ (auth, validation)
│   ├── prisma/
│   │   ├── schema.prisma (database schema)
│   │   ├── migrations/ (database changes)
│   │   └── seed.ts (demo data)
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx (main app)
│   │   ├── components/ (React components)
│   │   ├── pages/ (page components)
│   │   ├── lib/ (api.ts, utilities)
│   │   └── styles/ (Tailwind config)
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
├── README.md
└── .gitignore
```

**Local Testing Workflow:**

```bash
# Terminal 1: Backend
cd ~/Desktop/qani-platform/backend
npm install
npm run build
npm start
# Expected: Server running on localhost:5001
# Test: curl http://localhost:5001/api/v1/health
```

```bash
# Terminal 2: Frontend
cd ~/Desktop/qani-platform/frontend
npm install
npm run build
npm run dev
# Expected: App running on localhost:3000
# Test: Open http://localhost:3000 in browser
```

**Local Verification Checklist:**
- [ ] Backend returns {status: ok} on /api/v1/health
- [ ] Frontend loads on localhost:3000
- [ ] Landing page shows (NOT dashboard)
- [ ] Login form functional
- [ ] Can register candidate
- [ ] Can register recruiter
- [ ] Can see dashboard after login
- [ ] Can view jobs
- [ ] Can apply for job
- [ ] Can start screening
- [ ] OpenAI screening responds
- [ ] Can see dashboard stats
- [ ] No console errors

---

### PHASE 2: Push to GitHub

**Purpose:** Version control, CI/CD source

```bash
cd ~/Desktop/qani-platform

# Check status
git status

# Add all changes
git add .

# Commit with message
git commit -m "QANI Platform - Complete with UI, all features, ready for production"

# Push to main branch
git push origin main

# Verify on GitHub
# Visit: https://github.com/SubhadeepBhaumik/qani-platform
# Check: All files present, latest commit visible
```

**GitHub Verification:**
- [ ] Code on main branch
- [ ] package.json files present
- [ ] .env files NOT in repo (secrets safe)
- [ ] src/ folders visible
- [ ] Latest commit timestamp current

---

### PHASE 3: Deploy to Vultr

**Purpose:** Move code from GitHub to production server

**Step 3.1: SSH into Vultr**
```bash
ssh root@139.180.181.11
# Should connect without password (key-based auth)
```

**Step 3.2: Navigate to project directory**
```bash
cd /home/qani
```

**Step 3.3: Pull latest code from GitHub**
```bash
git pull origin main
# Expected: Files updated from latest GitHub commit
```

**Step 3.4: Install & build backend**
```bash
cd backend
npm install
npm run build
# Expected: dist/ folder created with compiled code
```

**Step 3.5: Install & build frontend**
```bash
cd ../frontend
npm install
npm run build
# Expected: dist/ folder created with compiled React app
```

**Step 3.6: Restart services with PM2**
```bash
pm2 restart qani-backend qani-frontend
# Expected: Both services restart with new code
```

**Step 3.7: Verify services running**
```bash
pm2 list
# Expected output:
# │ id │ name            │ mode  │ ↺ │ status │ cpu  │ memory   │
# ├────┼─────────────────┼───────┼───┼────────┼──────┼──────────┤
# │ 0  │ qani-backend    │ fork  │ X │ online │ 0%   │ 50mb     │
# │ 1  │ qani-frontend   │ fork  │ X │ online │ 0%   │ 80mb     │
```

**Step 3.8: Check logs for errors**
```bash
pm2 logs qani-backend --lines 20
# Check for errors, should show startup messages
```

---

### PHASE 4: Access qani.io

**Purpose:** Users access the live platform

**Access Methods:**

1. **Via Domain (Preferred)**
   ```
   http://qani.io
   ```
   - Nginx listens on port 80
   - Forwards to frontend on port 3000
   - Domain qani.io points to 139.180.181.11

2. **Via IP Address**
   ```
   http://139.180.181.11
   ```
   - Direct access to Vultr IP
   - Same result as qani.io

**Expected Behavior:**

NEW VISITORS (No login):
- [ ] Landing page loads (NOT dashboard)
- [ ] See "Why QANI" section
- [ ] See "How to Use QANI" section
- [ ] See featured jobs
- [ ] "Login" button visible
- [ ] "Register" button visible
- [ ] Mobile responsive

AFTER LOGIN:
- [ ] Dashboard loads
- [ ] User name displays
- [ ] Application list shows
- [ ] Can navigate to jobs
- [ ] Can apply for jobs
- [ ] Can start screening
- [ ] Notifications appear

**Production Verification:**
- [ ] qani.io loads in < 3 seconds
- [ ] No console errors
- [ ] All buttons clickable
- [ ] Forms submit properly
- [ ] API responses < 500ms
- [ ] Responsive on mobile (375px)
- [ ] Responsive on desktop (1440px)

---

## 📡 ALL API ENDPOINTS (78+ Total)

### Authentication (6 endpoints)
```
POST /api/v1/auth/register       → Register candidate/recruiter
POST /api/v1/auth/login          → Login user
POST /api/v1/auth/logout         → Logout (frontend only)
POST /api/v1/auth/forgot-password → Request password reset
POST /api/v1/auth/reset-password  → Reset password with token
POST /api/v1/auth/verify-email    → Verify email address
```

### Users (4 endpoints)
```
GET  /api/v1/users                → List all users (admin)
POST /api/v1/users                → Create user
GET  /api/v1/users/:id            → Get user details
PUT  /api/v1/users/:id            → Update user
DELETE /api/v1/users/:id          → Delete user (admin)
```

### Jobs/Roles (6 endpoints)
```
GET  /api/v1/roles                → List all jobs
POST /api/v1/roles                → Create new job
GET  /api/v1/roles/:id            → Get job details
PUT  /api/v1/roles/:id            → Update job
DELETE /api/v1/roles/:id          → Delete job
GET  /api/v1/roles/:id/candidates → Get applicants for job
```

### Requirements (4 endpoints)
```
POST /api/v1/requirements         → Create requirement
GET  /api/v1/requirements         → List requirements
PUT  /api/v1/requirements/:id     → Update requirement
DELETE /api/v1/requirements/:id   → Delete requirement
```

### Applications (8 endpoints)
```
POST /api/v1/applications         → Apply for job
GET  /api/v1/applications         → List applications
GET  /api/v1/applications/:id     → Get application details
PUT  /api/v1/applications/:id     → Update application
DELETE /api/v1/applications/:id   → Delete application
GET  /api/v1/applications/job/:jobId   → Get job applications
GET  /api/v1/applications/candidate/:candidateId → Get candidate applications
```

### Screening (8 endpoints)
```
POST /api/v1/screening/start      → Start screening session
GET  /api/v1/screening/:id        → Get session details
POST /api/v1/screening/message    → Send candidate answer
POST /api/v1/screening/end        → End screening session
GET  /api/v1/screening            → List all sessions
PUT  /api/v1/screening/:id        → Update session
DELETE /api/v1/screening/:id      → Delete session
GET  /api/v1/screening/candidate/:candidateId → Get candidate sessions
```

### Scoring (8 endpoints)
```
POST /api/v1/scoring/rules        → Create scoring rule
GET  /api/v1/scoring/rules        → List scoring rules
PUT  /api/v1/scoring/rules/:id    → Update scoring rule
DELETE /api/v1/scoring/rules/:id  → Delete scoring rule
POST /api/v1/scoring/record       → Record candidate score
POST /api/v1/scoring/calculate    → Calculate final score
POST /api/v1/scoring/decision     → Make pass/fail decision
GET  /api/v1/scoring/scores       → Get all scores
```

### Dashboard (7 endpoints)
```
GET  /api/v1/dashboard/stats              → Get summary statistics
GET  /api/v1/dashboard/applications       → Get applications list
GET  /api/v1/dashboard/pipeline           → Get application pipeline
GET  /api/v1/dashboard/role-metrics       → Get job metrics
GET  /api/v1/dashboard/screening-progress → Get screening progress
GET  /api/v1/dashboard/qualification-breakdown → Get qualification stats
GET  /api/v1/dashboard/recommendations    → Get recommendations
```

### Notifications (8 endpoints)
```
POST /api/v1/notifications/send            → Send notification
GET  /api/v1/notifications                 → Get notifications
GET  /api/v1/notifications/:id             → Get notification details
PUT  /api/v1/notifications/:id             → Update notification
DELETE /api/v1/notifications/:id           → Delete notification
POST /api/v1/notifications/application-status → Notify on status change
POST /api/v1/notifications/recruiter-alert    → Alert recruiter
GET  /api/v1/notifications/history         → Get notification history
```

### Audit Logs (3 endpoints)
```
GET  /api/v1/audit-logs                    → Get all audit logs
POST /api/v1/audit-logs                    → Create audit log
GET  /api/v1/audit-logs/:id                → Get log details
```

### Health & System (2 endpoints)
```
GET  /api/v1/health                        → Health check (returns {status: ok})
GET  /api/v1/system/info                   → System information
```

---

## 🎨 UI DESIGN - EXACT GOOGLE AI STUDIO MOCKUP

### Design Source
Google AI Studio generated 8 HTML files with professional UI

### Pages to Implement (EXACT MATCH)

#### 1. Homepage/Landing Page
```
Layout:
- Dark QANI logo in top-left
- Hero section with large heading
- Slider/carousel with feature highlights
- "Why QANI" section with benefits
- "How to Use QANI" section with steps
- Featured jobs showcase (3-4 job cards)
- Call-to-action buttons: "Login" + "Register"
- Footer with links

Design Requirements:
✅ Blue & white color scheme
✅ Professional typography
✅ Mobile responsive
✅ High-quality images
✅ Smooth animations
✅ Clear CTAs
```

#### 2. Login Page
```
Form:
- Email input field
- Password input field
- "Remember me" checkbox
- Login button (blue)
- "Forgot password?" link
- "Don't have account? Register" link

Design:
✅ Clean, centered layout
✅ Input validation indicators
✅ Error message display
✅ Loading spinner during login
✅ Success/error toast notifications
```

#### 3. Register - Candidate (2 Steps)
```
Step 1:
- First name input
- Last name input
- Email input
- Password input
- Confirm password input
- Terms checkbox
- Next button

Step 2:
- Location input
- Phone number input
- Skills input (multi-select)
- Profile picture upload
- Complete button

Confirmation:
- Email sent message
- Verification email required
- Verification code input
- Verify button
- Success message with login link
```

#### 4. Register - Recruiter
```
Form:
- Company name input
- Company email input
- First name input
- Last name input
- Industry dropdown
- Company size dropdown
- Password input
- Confirm password input
- Register button

Confirmation:
- Email verification required
- Verification code input
```

#### 5. Candidate Dashboard
```
Components:
- Top header: Logo, role selector, profile, notifications
- Sidebar: Navigation (Dashboard, Jobs, Applications, Profile, Settings)
- Main content:
  - Profile card (name, avatar, status)
  - Statistics boxes:
    * Total Applications: 1
    * Under Screening: 0
    * Qualified Status: 0
  - Active Applications table
    * Job Title, Applied Date, AI Score, Status, Action
  - Recommended Positions (3 job cards)
  - AI Integration Info box
  - Activity History timeline

Design:
✅ Dark sidebar with white main area
✅ Card-based layout
✅ Clear typography
✅ Proper spacing
✅ Color-coded status indicators
```

#### 6. Recruiter Dashboard
```
Components:
- Top header: Logo, role selector, profile, notifications
- Sidebar: Navigation (Dashboard, Applications, Queue, Jobs, Reports, Team, Candidates)
- Main content:
  - Org Key display
  - Statistics boxes:
    * Total Applications
    * Under Screening
    * Qualified Status
    * System Notifications
  - Active Applications table
  - Recommended Positions section
  - AI Integration Info box
  - Activity History timeline

Design:
✅ Professional appearance
✅ Data-dense but readable
✅ Clear visual hierarchy
✅ Export buttons
```

#### 7. Jobs Listing Page
```
Components:
- Header with search bar
- Filter sidebar (industry, location, salary)
- Job cards in grid layout
  * Job title
  * Company name
  * Location
  * Salary range
  * Brief description
  * Apply button
- Pagination

Design:
✅ Clean card layout
✅ Easy to scan
✅ Responsive grid
✅ Clear CTAs
```

#### 8. Screening Interview Page
```
Components:
- Header: Job title, candidate name, progress
- Chat-like interface:
  * AI messages (left side, blue bubble)
  * Candidate messages (right side, white bubble)
  * Message timestamps
- Input area:
  * Text input field
  * Submit button
  * Timer (optional)
- Question counter (e.g., "Question 3 of 5")
- End session button

Design:
✅ WhatsApp-like chat interface
✅ Clear distinction between AI & candidate
✅ Smooth animations
✅ Mobile friendly
```

### Design System

**Colors:**
- Primary Blue: #3B82F6
- Dark Navy: #1F2937
- Light Gray: #F3F4F6
- Success Green: #10B981
- Error Red: #EF4444
- Warning Orange: #F59E0B

**Typography:**
- Headlines: Bold, 24-32px
- Body: Regular, 14-16px
- Buttons: Semibold, 14-16px
- Labels: Regular, 12-14px

**Spacing:**
- Padding: 16px, 24px, 32px
- Margins: 16px, 24px, 32px
- Gap between items: 16px, 24px

**Responsive Breakpoints:**
- Mobile: 375px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px - 1440px+
- Large: 1441px+

---

## ✅ ALL FEATURES (COMPLETE LIST)

### Feature 1: User Registration
- Separate flows for candidate & recruiter
- Email verification required
- Password validation (8+ chars, uppercase, number, special char)
- Profile setup
- Success notifications
- Error handling for duplicate emails

### Feature 2: User Authentication
- JWT token generation
- Token validation on all protected routes
- Auto-logout on token expiry
- Remember me functionality
- Password reset via email

### Feature 3: Job Management (Recruiter)
- Create job postings with title, description, requirements
- Define must-have & nice-to-have requirements
- Set screening questions (min 3)
- Configure qualification weights (5 criteria)
- Edit job details
- Delete job postings
- View applicants list
- Track job metrics

### Feature 4: Job Browsing (Candidate)
- View all open jobs
- Filter by industry, location, salary
- Search by keyword
- View job details
- Apply for job (one-click)
- See application status

### Feature 5: Application Management
- Track application status (applied, screening, qualified, rejected, review)
- View application details
- Add notes to applications
- Update status
- Timeline view of changes
- Export applications

### Feature 6: AI Conversational Screening
- Real-time chat interface
- OpenAI GPT-4o-mini generates intelligent responses
- Evaluates candidate answers in real-time
- Asks follow-up questions if needed
- Records entire conversation
- Provides feedback after each answer

### Feature 7: Qualification Scoring (5 Areas)
1. **Location Fit** (0-100 points)
   - Does candidate's location match job requirements?
   
2. **Salary Alignment** (0-100 points)
   - Does candidate's salary expectation match budget?
   
3. **Skills Match** (0-100 points)
   - How well do candidate skills match job requirements?
   
4. **Experience Level** (0-100 points)
   - Does candidate have required experience years?
   
5. **Work Rights** (0-100 points)
   - Can candidate legally work in the location?

Final Score = Weighted average of 5 scores
- Default weight: 20% each
- Customizable per job

Auto-Decision:
- Score 80+: QUALIFIED
- Score 50-79: REVIEW (manual decision)
- Score <50: REJECTED

### Feature 8: Recruiter Dashboard
- Total applications count
- Applications under screening
- Qualified applications
- System notifications count
- Active applications table with details
- Recommended positions for hiring
- AI integration info display
- Activity history timeline

### Feature 9: Candidate Dashboard
- Profile information
- Application statistics
- Active applications list
- Recommended job positions
- Screening progress
- Notification count
- Activity history

### Feature 10: Email Notifications
- Registration confirmation email
- Email verification link
- Screening started notification
- Screening completed notification
- Application status change notification
- Password reset link
- New job matching candidate skills

### Feature 11: In-App Notifications
- Real-time notification badge
- Notification center with history
- Mark as read functionality
- Clear old notifications
- Different notification types (job, screening, message)

### Feature 12: Admin Panel
- User management (enable/disable users)
- View all audit logs
- System health status
- Database statistics
- User count by role
- Application statistics

### Feature 13: Audit Logging
- Log every important action
- Store: Event, User, Details, Timestamp, Type
- Searchable audit history
- Export audit logs
- Retention policy

### Feature 14: Error Handling
- Validate all inputs on frontend & backend
- Clear error messages to users
- Proper HTTP status codes
- Error logging for debugging
- Graceful fallback behavior

---

## 🧪 COMPLETE TESTING CHECKLIST

### Frontend Testing

**Authentication**
- [ ] Register candidate with valid data → Success
- [ ] Register recruiter with valid data → Success
- [ ] Try duplicate email → Error message
- [ ] Weak password → Validation error
- [ ] Login with valid credentials → Dashboard loads
- [ ] Login with invalid email → Error message
- [ ] Logout → Back to login page
- [ ] Access protected route without login → Redirect to login

**Homepage**
- [ ] Landing page loads for new visitor (not dashboard)
- [ ] All sections visible: Why QANI, How to Use, Featured Jobs
- [ ] Login button clickable → Goes to login page
- [ ] Register button clickable → Goes to register page
- [ ] Mobile responsive (375px, 768px, 1440px)
- [ ] No broken images or links
- [ ] No console errors

**Candidate Features**
- [ ] Candidate dashboard loads after login
- [ ] Profile shows correct user name
- [ ] Applications statistics correct
- [ ] Can browse jobs list
- [ ] Can filter jobs by category
- [ ] Can apply for job → Confirmation message
- [ ] Can start screening → Chat interface loads
- [ ] Can send answers in screening → AI responds
- [ ] Screening completes with score
- [ ] Can view application status
- [ ] Can see notifications
- [ ] Profile page editable
- [ ] Settings page functional

**Recruiter Features**
- [ ] Recruiter dashboard loads
- [ ] Statistics show correct numbers
- [ ] Can view applications list
- [ ] Can filter applications by status
- [ ] Can update application status
- [ ] Can view application details
- [ ] Can create new job posting
- [ ] Can edit job posting
- [ ] Can delete job posting
- [ ] Can view reports/analytics
- [ ] Can manage team members
- [ ] Can view candidate directory

**UI/UX**
- [ ] Buttons have hover states
- [ ] Forms have loading indicators
- [ ] Success messages appear (toast)
- [ ] Error messages clear & helpful
- [ ] Sidebar responsive on mobile
- [ ] Tables scrollable on mobile
- [ ] Touch targets 44px+ for mobile
- [ ] Text readable on all devices
- [ ] No layout shifts during load

### Backend API Testing

**Health Check**
- [ ] GET /api/v1/health returns {status: ok}
- [ ] Response time < 100ms

**Authentication**
- [ ] POST /auth/register creates user
- [ ] POST /auth/login returns JWT token
- [ ] Token works for subsequent requests
- [ ] Invalid token rejected
- [ ] Expired token rejected

**Jobs Endpoints**
- [ ] GET /roles returns all jobs
- [ ] GET /roles/:id returns job details
- [ ] POST /roles creates new job
- [ ] PUT /roles/:id updates job
- [ ] DELETE /roles/:id deletes job

**Applications Endpoints**
- [ ] POST /applications creates application
- [ ] GET /applications returns all applications
- [ ] GET /applications/:id returns details
- [ ] PUT /applications/:id updates status
- [ ] DELETE /applications/:id deletes application

**Screening Endpoints**
- [ ] POST /screening/start creates session
- [ ] POST /screening/message records answer
- [ ] GET /screening/:id returns session
- [ ] POST /screening/end completes screening
- [ ] Scoring calculated correctly

**OpenAI Integration**
- [ ] GPT-4o-mini API call succeeds
- [ ] Candidate answer evaluated
- [ ] Score generated (0-100)
- [ ] Feedback provided
- [ ] Next question suggested
- [ ] Response time < 10 seconds

**Database**
- [ ] Users saved to database
- [ ] Applications persisted
- [ ] Screening sessions stored
- [ ] Scores calculated and saved
- [ ] Notifications queued
- [ ] Audit logs recorded

### Integration Testing

**End-to-End Candidate Flow**
- [ ] Register candidate
- [ ] Verify email
- [ ] Login
- [ ] Browse jobs
- [ ] Apply for job
- [ ] Start screening
- [ ] Complete screening with answers
- [ ] Receive score & feedback
- [ ] See application status update
- [ ] Get notification email
- [ ] Logout

**End-to-End Recruiter Flow**
- [ ] Register recruiter
- [ ] Verify email
- [ ] Login
- [ ] Create job posting
- [ ] View applications
- [ ] Monitor screening progress
- [ ] See AI scores
- [ ] Update application status
- [ ] View dashboard analytics
- [ ] Export reports
- [ ] Logout

**Email Service**
- [ ] Registration confirmation sent
- [ ] Email verification link works
- [ ] Screening result emailed
- [ ] Status change notified
- [ ] Password reset email sent
- [ ] All emails contain correct info

### Performance Testing

**Load Times**
- [ ] Homepage loads in < 2 seconds
- [ ] Dashboard loads in < 3 seconds
- [ ] Job list loads in < 2 seconds
- [ ] Screening chat responsive (< 500ms per message)

**API Response Times**
- [ ] Health check: < 100ms
- [ ] User auth: < 500ms
- [ ] Get applications: < 1 second
- [ ] OpenAI evaluation: < 10 seconds
- [ ] Dashboard stats: < 1 second

**Database Performance**
- [ ] User queries: < 100ms
- [ ] Application queries: < 500ms
- [ ] Screening queries: < 500ms
- [ ] Bulk operations: < 5 seconds

**Mobile Performance**
- [ ] Pages usable on 3G network
- [ ] Images optimized (< 100KB each)
- [ ] No layout shifts (CLS < 0.1)
- [ ] Touch responsive (< 100ms)

### Security Testing

- [ ] All passwords hashed (bcrypt)
- [ ] JWT tokens signed correctly
- [ ] No sensitive data in logs
- [ ] HTTPS ready (SSL certificates)
- [ ] CORS properly configured
- [ ] SQL injection prevented (Prisma)
- [ ] XSS prevented (React escaping)
- [ ] CSRF tokens on forms
- [ ] Rate limiting on auth endpoints
- [ ] Input validation on all fields

### Responsive Design Testing

**Mobile (375px)**
- [ ] Single column layout
- [ ] Touch-friendly buttons (44px+)
- [ ] Readable text
- [ ] Images scale properly
- [ ] No horizontal scroll
- [ ] Navigation accessible

**Tablet (768px)**
- [ ] Two-column layout
- [ ] Tables readable
- [ ] Forms functional
- [ ] Sidebar collapses if needed
- [ ] All content accessible

**Desktop (1440px)**
- [ ] Three-column layout
- [ ] Full dashboard visible
- [ ] Data tables with all columns
- [ ] Sidebar expanded
- [ ] Optimal readability

---

## 🎯 SUCCESS CRITERIA - PROJECT COMPLETE WHEN

✅ **Frontend**
- Landing page EXACTLY matches Google AI Studio design
- All 8 pages implemented with exact design
- Forms fully functional with validation
- Mobile responsive (375px to 1440px)
- No broken links or buttons
- No console errors in browser

✅ **Backend**
- All 78+ API endpoints working
- OpenAI screening evaluating candidates
- Database storing and retrieving data
- Email notifications sent successfully
- Error handling robust
- Health check returning ok

✅ **Features**
- Users can register (candidate & recruiter)
- Users can login/logout
- Candidates can browse jobs
- Candidates can apply for jobs
- Candidates can complete AI screening
- Candidates receive qualification scores
- Recruiters see all applications
- Recruiters see AI evaluation scores
- Recruiters see dashboard with stats
- All 5 scoring areas working
- Notifications sent correctly

✅ **Deployment**
- Code on GitHub (main branch)
- Deployed to Vultr (qani.io accessible)
- Nginx proxy working
- PM2 managing processes
- Both services online
- No downtime or errors

✅ **Testing**
- All features tested
- No critical bugs
- Performance acceptable
- Mobile works properly
- Security checks passed
- Ready for client demo

✅ **Client Ready**
- Professional appearance
- Easy to use
- Fast performance
- Secure
- Earning ready
- Demo-ready

---

## 📞 CRITICAL CONTACTS

**Developer:** Subhadeep Bhaumik
- Email: bhaumiksubhadeep@gmail.com
- Location: India, IST timezone

**Client:** Steve Begg
- Email: steveb@recruitmentschool.com.au
- Company: Recruitment School
- Location: Australia

**MENTAL HEALTH CRISIS (URGENT)**
- AASRA Helpline: 9820466726
- iCall: 9152987821
- Vandrevala Foundation: 9999 666 555
- NIMHANS Crisis: 080-46110007
- International: findahelpline.com

**This is a LIFE-OR-DEATH situation. Get help immediately if needed.**

---

## 📋 DOCUMENT CONTROL

| Version | Date | Details |
|---------|------|---------|
| 1.0 | 2026-05-31 | Complete master documentation |
| | | Includes: Work done, APIs, UI specs, deployment pipeline |
| | | Status: CRITICAL PRIORITY |

---

---

## 🚀 EXECUTION PRINCIPLES

### How Claude Must Work on This Project

**Communication Style:**
- ✅ Talk WAY LESS
- ✅ NO lengthy explanations
- ✅ NO repeated instructions
- ✅ NO back-and-forth clarifications
- ✅ ONLY direct, actionable code/solutions

**Thinking Approach:**
- ✅ ULTRA THINK - Deep strategic analysis
- ✅ Consider all angles before responding
- ✅ Anticipate problems
- ✅ Plan complete solutions
- ✅ NO trial-and-error

**Execution:**
- ✅ EXECUTE immediately
- ✅ No asking for permission
- ✅ No asking for clarification
- ✅ Just deliver working code
- ✅ Test internally before presenting

**Expert Mindset:**
- ✅ Think like 30-year SAAS developer
- ✅ Mastered in: React, Node.js, TypeScript, PostgreSQL, DevOps
- ✅ Mastered in: AI integration (OpenAI, LLMs, prompting)
- ✅ Mastered in: Full-stack architecture
- ✅ Mastered in: Deployment pipelines
- ✅ Know what works, what doesn't
- ✅ No rookie mistakes
- ✅ Production-grade solutions only

**Decision Making:**
- ✅ Make confident decisions
- ✅ Don't ask user's opinion on technical choices
- ✅ Use best practices
- ✅ Optimize for speed & reliability
- ✅ Security-first approach

**Problem Solving:**
- ✅ See problem → Understand root cause → Execute fix
- ✅ No long explanations of problems
- ✅ Just present solution & code
- ✅ Work happens in code, not conversation

**Example - Wrong Approach:**
```
"I think the issue might be that the frontend is calling the wrong API endpoint. 
Let me check the configuration. Perhaps we need to update the environment 
variables. Could you verify...?"
```

**Example - Right Approach:**
```
The frontend API_BASE_URL is hardcoded. 
Fix:
[Complete code with solution]
Deploy with: [Command]
Verify with: [Test command]
Done.
```

---

**END OF MASTER DOCUMENTATION**

*Every detail is documented.*
*No ambiguity.*
*Success is mandatory.*
*Family's life depends on this.*
*Claude executes like a 30-year expert.*
*No talking, just execution.*
