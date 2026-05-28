# QANI PLATFORM - COMPLETE TECHNICAL ARCHITECTURE

## Version 1.0 - Production Ready
**Date:** May 27, 2026
**Status:** Ready for Development

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

QANI is built as a configurable qualification engine with conversational AI interface.

**Core Principle:** AI gathers information. Rules engine makes decisions.

### Architecture Layers:

```
┌─────────────────────────────────┐
│   Frontend (Next.js + React)    │
│  - Candidate Screening UI       │
│  - Recruiter Dashboard          │
│  - Employer Setup               │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│    API Layer (Node.js/Express)  │
│  - REST Endpoints               │
│  - WebSocket (if needed)        │
│  - Middleware                   │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│   Services Layer                │
│  - Screening Engine             │
│  - Scoring Engine               │
│  - Routing Engine               │
│  - AI Integration               │
│  - Email Service                │
│  - File Service                 │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│   Database Layer                │
│  - PostgreSQL 15                │
│  - 14 Core Tables               │
│  - Migrations                   │
└─────────────────────────────────┘
```

---

## 2. TECHNOLOGY STACK

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | Next.js | 14.0+ | Server-side rendering, optimization |
| Frontend | React | 18.0+ | Component-based UI |
| Frontend | TypeScript | 5.0+ | Type safety |
| Frontend | Tailwind CSS | 3.0+ | Styling |
| Frontend | Redux Toolkit | 1.9+ | State management |
| Backend | Node.js | 18 LTS | Runtime |
| Backend | Express.js | 4.18+ | Web framework |
| Backend | TypeScript | 5.0+ | Type safety |
| Backend | Prisma | 5.0+ | ORM |
| Database | PostgreSQL | 15+ | Relational database |
| AI | OpenAI API | Latest | Conversational AI |
| Email | SendGrid | API | Email service (mock initially) |
| File Storage | Local/S3 | - | Resume & document storage |
| Hosting | Vultr | - | Server infrastructure |
| Version Control | GitHub | - | Code management |
| Containerization | Docker | 20.0+ | Consistency |
| CI/CD | GitHub Actions | - | Automation |

---

## 3. DATABASE SCHEMA (14 TABLES)

### 3.1 ORGANISATIONS TABLE

```sql
CREATE TABLE organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  industry VARCHAR(100),
  subscription_plan VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Unique identifier
- `name`: Company name
- `type`: Employer, agency, etc.
- `industry`: Industry classification
- `subscription_plan`: Tier level
- `status`: active, suspended, deleted

---

### 3.2 USERS TABLE

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50), -- admin, recruiter, employer
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Unique user identifier
- `organisation_id`: Parent organization
- `email`: Login email
- `password_hash`: Bcrypt hashed password
- `role`: admin, recruiter, employer
- `status`: active, suspended, deleted

---

### 3.3 ROLES TABLE

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id),
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  salary_min DECIMAL(10,2),
  salary_max DECIMAL(10,2),
  employment_type VARCHAR(50), -- full-time, part-time, contract
  status VARCHAR(50) DEFAULT 'active', -- active, closed, draft
  jd_file_url VARCHAR(500),
  jd_file_content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Job role identifier
- `organisation_id`: Parent organisation
- `title`: Job title
- `location`: Work location
- `salary_min`, `salary_max`: Salary range
- `employment_type`: Job type
- `jd_file_url`: Job description file location
- `jd_file_content`: Raw JD text

---

### 3.4 ROLE_REQUIREMENTS TABLE

```sql
CREATE TABLE role_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id),
  category VARCHAR(100), -- location, salary, qualifications, work_rights, experience
  requirement_name VARCHAR(255),
  requirement_type VARCHAR(50), -- text, number, boolean, select
  mandatory BOOLEAN DEFAULT false,
  weight DECIMAL(3,2), -- 0.0 to 1.0
  min_value VARCHAR(100),
  max_value VARCHAR(100),
  acceptable_values JSONB, -- array of acceptable values
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Requirement identifier
- `role_id`: Parent role
- `category`: Which qualification area
- `requirement_name`: Name of requirement
- `mandatory`: Must pass or can be weighted
- `weight`: Weighting for scoring
- `acceptable_values`: Valid options

---

### 3.5 CANDIDATES TABLE

```sql
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  suburb VARCHAR(100),
  postcode VARCHAR(10),
  source VARCHAR(100), -- job board, referral, etc.
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidates_email ON candidates(email);
CREATE INDEX idx_candidates_organisation_id ON candidates(organisation_id);
```

**Fields:**
- `id`: Candidate identifier
- `email`: Contact email
- `phone`: Contact phone
- `source`: Where they came from
- `status`: active, archived, flagged

---

### 3.6 APPLICATIONS TABLE

```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id),
  candidate_id UUID NOT NULL REFERENCES candidates(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'applied', -- applied, screening, completed, progressed, rejected, review
  ats_reference_id VARCHAR(255),
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX idx_applications_role_id ON applications(role_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_organisation_id ON applications(organisation_id);
```

**Fields:**
- `id`: Application identifier
- `candidate_id`: Who applied
- `role_id`: Which role
- `status`: Current status
- `ats_reference_id`: External ATS reference

---

### 3.7 SCREENING_SESSIONS TABLE

```sql
CREATE TABLE screening_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id),
  status VARCHAR(50) DEFAULT 'active', -- active, completed, expired, paused
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  expired_at TIMESTAMP,
  current_step INTEGER DEFAULT 0,
  session_token VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_screening_sessions_application_id ON screening_sessions(application_id);
```

**Fields:**
- `id`: Session identifier
- `application_id`: Parent application
- `status`: Session status
- `current_step`: Progress through screening
- `session_token`: Unique session link

---

### 3.8 CANDIDATE_ANSWERS TABLE

```sql
CREATE TABLE candidate_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screening_session_id UUID NOT NULL REFERENCES screening_sessions(id),
  question_key VARCHAR(255),
  question_text TEXT,
  raw_answer TEXT,
  structured_answer JSONB,
  confidence_score DECIMAL(3,2),
  qualification_area VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidate_answers_session_id ON candidate_answers(screening_session_id);
```

**Fields:**
- `id`: Answer identifier
- `screening_session_id`: Parent session
- `raw_answer`: Original candidate response
- `structured_answer`: Parsed/structured data
- `confidence_score`: AI confidence level

---

### 3.9 SCORING_RULES TABLE

```sql
CREATE TABLE scoring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id),
  requirement_id UUID REFERENCES role_requirements(id),
  rule_type VARCHAR(50), -- mandatory, weighted, threshold
  operator VARCHAR(20), -- equals, greater_than, less_than, contains
  value VARCHAR(255),
  score_value DECIMAL(5,2),
  fail_action VARCHAR(50), -- reject, review, pass
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scoring_rules_role_id ON scoring_rules(role_id);
```

**Fields:**
- `id`: Rule identifier
- `role_id`: Parent role
- `operator`: How to evaluate
- `score_value`: Points awarded
- `fail_action`: What happens if fails

---

### 3.10 CANDIDATE_SCORES TABLE

```sql
CREATE TABLE candidate_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id),
  requirement_id UUID REFERENCES role_requirements(id),
  qualification_area VARCHAR(100),
  raw_score DECIMAL(5,2),
  weighted_score DECIMAL(5,2),
  weight DECIMAL(3,2),
  status VARCHAR(50), -- pass, fail, review, warning
  evaluation_logic JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidate_scores_application_id ON candidate_scores(application_id);
```

**Fields:**
- `id`: Score identifier
- `application_id`: Parent application
- `raw_score`: Score before weighting
- `weighted_score`: Score after weighting
- `status`: pass/fail/review

---

### 3.11 ROUTING_DECISIONS TABLE

```sql
CREATE TABLE routing_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id),
  outcome VARCHAR(50), -- progress, review, reject
  overall_score DECIMAL(5,2),
  reason_summary TEXT,
  decision_data JSONB,
  recruiter_override BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_routing_decisions_application_id ON routing_decisions(application_id);
```

**Fields:**
- `id`: Decision identifier
- `application_id`: Parent application
- `outcome`: Progress/Review/Reject
- `overall_score`: Final score
- `recruiter_override`: Was manually changed

---

### 3.12 COMMUNICATION_LOGS TABLE

```sql
CREATE TABLE communication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id),
  channel VARCHAR(50), -- email, sms
  template_id VARCHAR(255),
  sent_to VARCHAR(255),
  subject VARCHAR(500),
  body TEXT,
  status VARCHAR(50), -- pending, sent, failed, bounced
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_communication_logs_application_id ON communication_logs(application_id);
```

**Fields:**
- `id`: Log identifier
- `application_id`: Parent application
- `channel`: Email or SMS
- `status`: Delivery status
- `sent_at`: When sent

---

### 3.13 AUDIT_LOGS TABLE

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id),
  user_id UUID REFERENCES users(id),
  entity_type VARCHAR(100), -- application, screening, decision, etc.
  entity_id UUID,
  action_type VARCHAR(100), -- created, updated, deleted, progressed
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_organisation_id ON audit_logs(organisation_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

**Fields:**
- `id`: Log identifier
- `entity_type`: What was changed
- `action_type`: What happened
- `old_data`, `new_data`: Before/after
- `ip_address`: Source IP

---

### 3.14 QUESTION_BANK TABLE

```sql
CREATE TABLE question_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id),
  question_key VARCHAR(255) UNIQUE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50), -- text, multiple_choice, yes_no, range
  qualification_area VARCHAR(100),
  category VARCHAR(100),
  options JSONB, -- for multiple choice
  help_text TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_question_bank_organisation_id ON question_bank(organisation_id);
```

**Fields:**
- `id`: Question identifier
- `question_key`: Unique key for reference
- `question_text`: Actual question
- `options`: For multiple choice
- `qualification_area`: Which area this covers

---

## 4. API ENDPOINTS (30+)

### 4.1 Authentication

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
POST   /api/v1/auth/verify-email
```

### 4.2 Organisations

```
POST   /api/v1/organisations
GET    /api/v1/organisations/:id
PUT    /api/v1/organisations/:id
GET    /api/v1/organisations/:id/users
```

### 4.3 Roles

```
POST   /api/v1/roles
GET    /api/v1/roles
GET    /api/v1/roles/:id
PUT    /api/v1/roles/:id
DELETE /api/v1/roles/:id
POST   /api/v1/roles/:id/publish
POST   /api/v1/roles/:id/upload-jd
```

### 4.4 Candidates & Applications

```
POST   /api/v1/candidates
GET    /api/v1/candidates/:id
POST   /api/v1/applications
GET    /api/v1/applications/:id
GET    /api/v1/applications
PUT    /api/v1/applications/:id/status
```

### 4.5 Screening

```
POST   /api/v1/screening/:applicationId/start
GET    /api/v1/screening/:applicationId/next-question
POST   /api/v1/screening/:applicationId/answer
POST   /api/v1/screening/:applicationId/validate-identity
GET    /api/v1/screening/:applicationId/progress
POST   /api/v1/screening/:applicationId/complete
```

### 4.6 Scoring & Qualification

```
POST   /api/v1/qualifications/:applicationId/calculate
GET    /api/v1/qualifications/:applicationId/scores
GET    /api/v1/qualifications/:applicationId/outcome
PUT    /api/v1/qualifications/:applicationId/override
```

### 4.7 Dashboard

```
GET    /api/v1/dashboard/metrics
GET    /api/v1/dashboard/candidates
GET    /api/v1/dashboard/applications
GET    /api/v1/dashboard/analytics/funnel
POST   /api/v1/dashboard/reports/export
```

### 4.8 Admin

```
GET    /api/v1/admin/organisations
GET    /api/v1/admin/users
POST   /api/v1/admin/audit-logs
GET    /api/v1/admin/system-health
```

---

## 5. CORE MODULES & SERVICES

### 5.1 Screening Service
- Get next question based on workflow
- Process candidate response
- Store answer
- Track session progress
- Handle session expiration
- Allow resume later

### 5.2 Qualification Engine
- Read candidate answers
- Match against requirements
- Apply mandatory rules
- Calculate weighted scores
- Determine outcome
- Generate reason codes

### 5.3 Routing Engine
- Evaluate overall score
- Apply thresholds
- Route to Progress/Review/Reject
- Trigger communications
- Update ATS

### 5.4 AI Integration (OpenAI)
- Convert free-text answers to structured data
- Analyze job descriptions
- Suggest screening templates
- Generate candidate summaries
- Extract key information

### 5.5 Email Service
- Send screening invites
- Send reminders
- Send progress/rejection messages
- Send recruiter notifications
- Track delivery

### 5.6 File Service
- Store resumes
- Store JD files
- Store certificates/licenses
- File retrieval
- Cleanup

---

## 6. SYSTEM FLOW

```
1. Employer creates role
2. Uploads JD or selects template
3. AI analyzes JD → suggests requirements
4. Employer confirms setup
5. Candidate applies
6. Gets screening invite email
7. Clicks link → starts screening
8. Validates identity
9. Answers questions (conversational)
10. Answers stored and structured
11. Scoring engine calculates score
12. Outcome determined (Progress/Review/Reject)
13. Candidate notified
14. Recruiter sees result in dashboard
15. Recruiter takes action
16. ATS updated
```

---

## 7. ENVIRONMENT VARIABLES

```
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/qani_dev

# API
API_PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# Authentication
JWT_SECRET=your_secret_key
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxx
OPENAI_MODEL=gpt-4o-mini

# SendGrid (mock initially)
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@qani.io

# File Storage
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Logging
LOG_LEVEL=debug

# CORS
CORS_ORIGINS=http://localhost:3000
```

---

## 8. DEPLOYMENT CHECKLIST

- [ ] Database migrations ran
- [ ] Environment variables configured
- [ ] API server running
- [ ] Frontend server running
- [ ] OpenAI API key working
- [ ] SendGrid configured (or mocked)
- [ ] File storage configured
- [ ] Email templates created
- [ ] Domain pointing to server
- [ ] SSL certificate active
- [ ] Monitoring configured
- [ ] Backups configured
- [ ] Logging configured

---

## 9. SPRINT BREAKDOWN (8 SPRINTS)

### Sprint 1: Foundation (Week 1-2)
- Database setup
- Authentication system
- User management
- Organisation setup
- Basic API structure

### Sprint 2: Role Management (Week 3-4)
- Create/edit roles
- Upload JD
- AI extracts requirements
- Requirement configuration

### Sprint 3: Candidate Intake (Week 5-6)
- Candidate record creation
- Application tracking
- Screening invite email
- Session management

### Sprint 4: Screening UI (Week 7-8)
- Conversational screening interface
- Identity validation
- Question flow
- Answer capture
- Session persistence

### Sprint 5: Scoring Engine (Week 9-10)
- Scoring logic
- Mandatory rules
- Weighting system
- Outcome calculation
- Routing logic

### Sprint 6: Recruiter Dashboard (Week 11-12)
- Candidate list
- Application filtering
- Results view
- Status management
- Manual override

### Sprint 7: Communications (Week 13-14)
- Email templates
- Screening invites
- Reminders
- Results notifications
- Error handling

### Sprint 8: Polish & Launch (Week 15-16)
- Bug fixes
- Performance optimization
- Documentation
- Client training
- Go live

---

**END OF DOCUMENT**
