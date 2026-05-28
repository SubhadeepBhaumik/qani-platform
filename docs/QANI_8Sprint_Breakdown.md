# QANI 8-SPRINT DEVELOPMENT BREAKDOWN

## SPRINT 1: Foundation (Week 1-2)
**Goal:** Database, auth, basic API structure

### Tasks:
- [ ] Setup PostgreSQL database with Prisma schema
- [ ] Create organisations table & service
- [ ] Create users table & authentication service
- [ ] Implement JWT auth (login, register, refresh)
- [ ] Setup Express server & routing
- [ ] Create API health check endpoint
- [ ] Setup CORS & middleware
- [ ] Create error handling middleware
- [ ] Setup environment variables
- [ ] Write tests for auth endpoints

**Deliverables:**
- Working database
- User registration & login
- JWT authentication
- Basic API structure
- All tests passing

---

## SPRINT 2: Role Management (Week 3-4)
**Goal:** Job role creation and JD upload with AI extraction

### Tasks:
- [ ] Create roles table & service
- [ ] Create role requirements table & service
- [ ] Build role creation API endpoint
- [ ] Build role update/delete endpoints
- [ ] Implement JD file upload (PDF/DOCX)
- [ ] Integrate OpenAI for JD analysis
- [ ] Extract location, salary, qualifications from JD
- [ ] Suggest screening requirements via AI
- [ ] Create role publish endpoint
- [ ] Build role listing endpoints with filters

**Deliverables:**
- Role CRUD operations
- JD upload & analysis
- AI-powered requirement extraction
- Role publication workflow

---

## SPRINT 3: Candidate Intake (Week 5-6)
**Goal:** Candidate registration and application tracking

### Tasks:
- [ ] Create candidates table & service
- [ ] Create applications table & service
- [ ] Build candidate creation endpoint
- [ ] Build application creation endpoint
- [ ] Create screening_sessions table
- [ ] Generate unique screening tokens
- [ ] Build screening invite email template
- [ ] Integrate SendGrid for email sending
- [ ] Create screening link generation
- [ ] Setup session tracking & expiration
- [ ] Create reminder email workflow
- [ ] Build application status update endpoint

**Deliverables:**
- Candidate record creation
- Application tracking
- Screening session generation
- Email invitation system
- Session management

---

## SPRINT 4: Screening UI & Logic (Week 7-8)
**Goal:** Conversational screening interface

### Tasks:
- [ ] Create question_bank table & service
- [ ] Build question retrieval logic
- [ ] Create candidate_answers table
- [ ] Build screening question display API
- [ ] Implement identity validation logic
- [ ] Create identity validation endpoint
- [ ] Integrate OpenAI for answer interpretation
- [ ] Build answer submission endpoint
- [ ] Create session persistence (pause/resume)
- [ ] Build screening progress tracking
- [ ] Create screening completion endpoint
- [ ] Build frontend screening UI component
- [ ] Implement conversational flow logic
- [ ] Create answer validation

**Deliverables:**
- Full screening UI
- Conversational question flow
- Answer capture & storage
- Identity validation
- Session persistence

---

## SPRINT 5: Scoring & Routing Engine (Week 9-10)
**Goal:** Qualification scoring and outcome routing

### Tasks:
- [ ] Create scoring_rules table & service
- [ ] Create candidate_scores table
- [ ] Create routing_decisions table
- [ ] Build scoring rules engine
- [ ] Implement mandatory pass/fail logic
- [ ] Implement weighted scoring logic
- [ ] Calculate overall scores
- [ ] Build threshold comparison logic
- [ ] Create routing decision logic (Progress/Review/Reject)
- [ ] Generate decision reason codes
- [ ] Build qualification calculation endpoint
- [ ] Create score retrieval endpoints
- [ ] Build override capability endpoint
- [ ] Create decision audit logging

**Deliverables:**
- Complete scoring engine
- Routing decision logic
- Manual override capability
- Audit logging

---

## SPRINT 6: Recruiter Dashboard (Week 11-12)
**Goal:** Recruiter-facing dashboard with results

### Tasks:
- [ ] Design dashboard data model
- [ ] Create dashboard metrics endpoint
- [ ] Build candidates list endpoint with filtering
- [ ] Build applications list endpoint
- [ ] Create candidate detail page endpoint
- [ ] Build screening results display component
- [ ] Create candidate score visualization
- [ ] Build status filtering UI
- [ ] Implement search functionality
- [ ] Create export to CSV feature
- [ ] Build manual status override UI
- [ ] Create candidate action buttons (contact, move, etc)
- [ ] Build analytics/funnel view
- [ ] Create role-based dashboard views

**Deliverables:**
- Full recruiter dashboard
- Candidate filtering & search
- Score visualization
- Results export
- Analytics view

---

## SPRINT 7: Communications & Notifications (Week 13-14)
**Goal:** Complete email & notification system

### Tasks:
- [ ] Create communication_logs table
- [ ] Create email template service
- [ ] Build screening invite email template
- [ ] Build first reminder email template
- [ ] Build final reminder email template
- [ ] Build progress notification email
- [ ] Build rejection notification email
- [ ] Build recruiter notification email
- [ ] Create email scheduling logic
- [ ] Build email tracking (open, click)
- [ ] Create notification preferences endpoint
- [ ] Build email resend capability
- [ ] Setup email bounce handling
- [ ] Create communication logs endpoint

**Deliverables:**
- Complete email system
- All email templates
- Scheduling & tracking
- Bounce handling

---

## SPRINT 8: Polish, Testing & Launch (Week 15-16)
**Goal:** Bug fixes, optimization, documentation, go-live

### Tasks:
- [ ] Fix all identified bugs
- [ ] Performance optimization (database queries)
- [ ] Load testing
- [ ] Security audit
- [ ] Setup logging system
- [ ] Create admin dashboard
- [ ] Create system health check
- [ ] Setup monitoring & alerts
- [ ] Create backup procedures
- [ ] Write API documentation
- [ ] Create user guides
- [ ] Setup staging environment
- [ ] Run full UAT testing
- [ ] Deploy to production (Vultr)
- [ ] Configure domain & SSL
- [ ] Setup continuous deployment

**Deliverables:**
- Fully tested application
- Production deployment
- Complete documentation
- Monitoring & alerts
- Backup procedures

---

## DEVELOPMENT PRIORITIES

### Must Have (MVP):
- User authentication
- Role & requirement setup
- Screening workflow
- Scoring & routing
- Recruiter dashboard
- Email notifications

### Should Have:
- Analytics & reporting
- Audit logging
- Admin dashboard
- Advanced filtering

### Nice to Have:
- SMS notifications
- ATS integrations
- Advanced analytics
- Machine learning insights

---

## TESTING STRATEGY

### Unit Tests:
- Auth functions
- Scoring logic
- Email template rendering
- Validation functions

### Integration Tests:
- API endpoints
- Database queries
- Email sending
- File uploads

### E2E Tests:
- Complete screening flow
- Dashboard workflows
- Admin operations

### Performance Tests:
- 1000 concurrent users
- Database response times
- API response times

---

## DEPLOYMENT CHECKLIST

- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Domain pointing to server
- [ ] GitHub Actions configured
- [ ] Monitoring active
- [ ] Backups scheduled
- [ ] Admin accounts created
- [ ] Client training complete
- [ ] Go-live approval obtained
