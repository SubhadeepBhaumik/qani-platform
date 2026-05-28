# QANI API ENDPOINTS - COMPLETE REFERENCE

## API Base URL
```
Development: http://localhost:5000/api/v1
Production: https://qani.io/api/v1
```

---

## 1. AUTHENTICATION ENDPOINTS

### 1.1 Register New User
```
POST /auth/register
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "recruiter"
}

Response: 201 Created
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "recruiter",
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "createdAt": "2026-05-27T10:00:00Z"
}
```

### 1.2 Login
```
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response: 200 OK
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "role": "recruiter",
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here"
}
```

### 1.3 Refresh Token
```
POST /auth/refresh
Content-Type: application/json

Request:
{
  "refreshToken": "refresh_token_here"
}

Response: 200 OK
{
  "token": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

### 1.4 Logout
```
POST /auth/logout
Authorization: Bearer jwt_token_here

Response: 200 OK
{
  "message": "Logged out successfully"
}
```

### 1.5 Verify Email
```
POST /auth/verify-email
Content-Type: application/json

Request:
{
  "token": "email_verification_token"
}

Response: 200 OK
{
  "message": "Email verified successfully",
  "verified": true
}
```

---

## 2. ORGANISATION ENDPOINTS

### 2.1 Create Organisation
```
POST /organisations
Authorization: Bearer jwt_token_here
Content-Type: application/json

Request:
{
  "name": "Tech Recruitment Inc",
  "type": "agency",
  "industry": "technology",
  "subscriptionPlan": "professional"
}

Response: 201 Created
{
  "id": "uuid",
  "name": "Tech Recruitment Inc",
  "type": "agency",
  "industry": "technology",
  "subscriptionPlan": "professional",
  "status": "active",
  "createdAt": "2026-05-27T10:00:00Z"
}
```

### 2.2 Get Organisation
```
GET /organisations/:id
Authorization: Bearer jwt_token_here

Response: 200 OK
{
  "id": "uuid",
  "name": "Tech Recruitment Inc",
  "type": "agency",
  "industry": "technology",
  "subscriptionPlan": "professional",
  "status": "active",
  "userCount": 5,
  "roleCount": 12,
  "createdAt": "2026-05-27T10:00:00Z"
}
```

### 2.3 Update Organisation
```
PUT /organisations/:id
Authorization: Bearer jwt_token_here
Content-Type: application/json

Request:
{
  "name": "Tech Recruitment Inc - Updated",
  "subscriptionPlan": "enterprise"
}

Response: 200 OK
{
  "id": "uuid",
  "name": "Tech Recruitment Inc - Updated",
  "subscriptionPlan": "enterprise",
  ...
}
```

### 2.4 List Organisation Users
```
GET /organisations/:id/users
Authorization: Bearer jwt_token_here

Query Parameters:
- limit=10 (default)
- offset=0 (default)
- role=recruiter (optional)

Response: 200 OK
{
  "total": 5,
  "limit": 10,
  "offset": 0,
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "recruiter",
      "status": "active"
    }
  ]
}
```

---

## 3. ROLE ENDPOINTS

### 3.1 Create Role
```
POST /roles
Authorization: Bearer jwt_token_here
Content-Type: application/json

Request:
{
  "organisationId": "org_uuid",
  "title": "Senior Software Engineer",
  "location": "Sydney, Australia",
  "salaryMin": 120000,
  "salaryMax": 160000,
  "employmentType": "full-time"
}

Response: 201 Created
{
  "id": "uuid",
  "title": "Senior Software Engineer",
  "location": "Sydney, Australia",
  "salaryMin": 120000,
  "salaryMax": 160000,
  "employmentType": "full-time",
  "status": "draft",
  "createdAt": "2026-05-27T10:00:00Z"
}
```

### 3.2 Get All Roles
```
GET /roles
Authorization: Bearer jwt_token_here

Query Parameters:
- organisationId=org_uuid (required)
- status=active (optional: active, closed, draft)
- limit=10 (default)
- offset=0 (default)

Response: 200 OK
{
  "total": 25,
  "limit": 10,
  "offset": 0,
  "roles": [...]
}
```

### 3.3 Get Single Role
```
GET /roles/:id
Authorization: Bearer jwt_token_here

Response: 200 OK
{
  "id": "uuid",
  "title": "Senior Software Engineer",
  "location": "Sydney, Australia",
  "salaryMin": 120000,
  "salaryMax": 160000,
  "employmentType": "full-time",
  "status": "active",
  "requirements": [...],
  "applicationCount": 15,
  "createdAt": "2026-05-27T10:00:00Z"
}
```

### 3.4 Update Role
```
PUT /roles/:id
Authorization: Bearer jwt_token_here
Content-Type: application/json

Request:
{
  "title": "Senior Software Engineer - Updated",
  "salaryMax": 180000
}

Response: 200 OK
{...}
```

### 3.5 Delete Role
```
DELETE /roles/:id
Authorization: Bearer jwt_token_here

Response: 204 No Content
```

### 3.6 Publish Role
```
POST /roles/:id/publish
Authorization: Bearer jwt_token_here

Response: 200 OK
{
  "id": "uuid",
  "status": "active",
  "publishedAt": "2026-05-27T10:00:00Z"
}
```

### 3.7 Upload Job Description
```
POST /roles/:id/upload-jd
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data

Form Data:
- file: [PDF/DOCX file]

Response: 200 OK
{
  "id": "uuid",
  "jdFileUrl": "/uploads/job_descriptions/uuid.pdf",
  "extractedText": "...",
  "suggestedRequirements": [...]
}
```

---

## 4. CANDIDATE & APPLICATION ENDPOINTS

### 4.1 Create Candidate
```
POST /candidates
Authorization: Bearer jwt_token_here
Content-Type: application/json

Request:
{
  "organisationId": "org_uuid",
  "email": "candidate@example.com",
  "phone": "+61412345678",
  "firstName": "Jane",
  "lastName": "Smith",
  "suburb": "Bondi",
  "postcode": "2026",
  "source": "linkedin"
}

Response: 201 Created
{
  "id": "uuid",
  "email": "candidate@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "source": "linkedin",
  "createdAt": "2026-05-27T10:00:00Z"
}
```

### 4.2 Create Application
```
POST /applications
Authorization: Bearer jwt_token_here
Content-Type: application/json

Request:
{
  "organisationId": "org_uuid",
  "candidateId": "candidate_uuid",
  "roleId": "role_uuid",
  "source": "linkedin"
}

Response: 201 Created
{
  "id": "uuid",
  "candidateId": "candidate_uuid",
  "roleId": "role_uuid",
  "status": "applied",
  "createdAt": "2026-05-27T10:00:00Z"
}
```

### 4.3 Get All Applications
```
GET /applications
Authorization: Bearer jwt_token_here

Query Parameters:
- organisationId=org_uuid (required)
- roleId=role_uuid (optional)
- status=screening (optional)
- limit=20 (default)
- offset=0 (default)

Response: 200 OK
{
  "total": 150,
  "limit": 20,
  "offset": 0,
  "applications": [...]
}
```

### 4.4 Get Single Application
```
GET /applications/:id
Authorization: Bearer jwt_token_here

Response: 200 OK
{
  "id": "uuid",
  "candidate": {
    "id": "uuid",
    "email": "candidate@example.com",
    "firstName": "Jane"
  },
  "role": {
    "id": "uuid",
    "title": "Senior Engineer"
  },
  "status": "screening",
  "screeningSession": {...},
  "scores": {...},
  "routingDecision": {...},
  "createdAt": "2026-05-27T10:00:00Z"
}
```

### 4.5 Update Application Status
```
PUT /applications/:id/status
Authorization: Bearer jwt_token_here
Content-Type: application/json

Request:
{
  "status": "progressed"
}

Response: 200 OK
{
  "id": "uuid",
  "status": "progressed",
  "updatedAt": "2026-05-27T10:05:00Z"
}
```

---

## 5. SCREENING ENDPOINTS

### 5.1 Start Screening Session
```
POST /screening/:applicationId/start
Content-Type: application/json

Request:
{
  "candidateEmail": "candidate@example.com"
}

Response: 201 Created
{
  "sessionId": "uuid",
  "sessionToken": "unique_token",
  "screeningLink": "https://qani.io/screening/unique_token",
  "expiresAt": "2026-06-03T10:00:00Z",
  "status": "active"
}
```

### 5.2 Get Next Question
```
GET /screening/:applicationId/next-question
Content-Type: application/json

Request Headers:
- X-Session-Token: session_token_or_applicationId

Response: 200 OK
{
  "questionId": "uuid",
  "questionKey": "location_willing",
  "questionText": "Are you willing to relocate to Sydney?",
  "questionType": "yes_no",
  "qualificationArea": "location_and_travel",
  "helpText": "This role is based in Sydney CBD",
  "stepNumber": 3,
  "totalSteps": 8
}
```

### 5.3 Submit Answer
```
POST /screening/:applicationId/answer
Content-Type: application/json

Request Headers:
- X-Session-Token: session_token

Request:
{
  "questionId": "uuid",
  "questionKey": "location_willing",
  "rawAnswer": "Yes, I am willing to relocate",
  "answerType": "text"
}

Response: 200 OK
{
  "answerId": "uuid",
  "questionId": "uuid",
  "rawAnswer": "Yes, I am willing to relocate",
  "structuredAnswer": {
    "willing_to_relocate": true
  },
  "confidenceScore": 0.98,
  "nextQuestion": {...}
}
```

### 5.4 Validate Identity
```
POST /screening/:applicationId/validate-identity
Content-Type: application/json

Request Headers:
- X-Session-Token: session_token

Request:
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "candidate@example.com",
  "phone": "+61412345678"
}

Response: 200 OK
{
  "validated": true,
  "matches": {
    "firstName": true,
    "lastName": true,
    "email": true,
    "phone": true
  },
  "flags": [],
  "canProceed": true
}
```

### 5.5 Get Screening Progress
```
GET /screening/:applicationId/progress
Authorization: Bearer jwt_token or X-Session-Token

Response: 200 OK
{
  "sessionId": "uuid",
  "status": "active",
  "currentStep": 5,
  "totalSteps": 8,
  "progressPercent": 62.5,
  "answeredQuestions": 5,
  "remainingQuestions": 3,
  "startedAt": "2026-05-27T10:00:00Z",
  "estimatedTimeRemaining": "3 minutes"
}
```

### 5.6 Complete Screening
```
POST /screening/:applicationId/complete
Content-Type: application/json

Request Headers:
- X-Session-Token: session_token

Response: 200 OK
{
  "sessionId": "uuid",
  "status": "completed",
  "completedAt": "2026-05-27T10:15:00Z",
  "totalDuration": "15 minutes",
  "answersCount": 8,
  "nextStep": "Screening will be reviewed by our team"
}
```

---

## 6. QUALIFICATION & SCORING ENDPOINTS

### 6.1 Calculate Qualifications
```
POST /qualifications/:applicationId/calculate
Authorization: Bearer jwt_token_here

Response: 200 OK
{
  "applicationId": "uuid",
  "totalScore": 78.5,
  "mandatoryPassed": true,
  "outcome": "progress",
  "qualificationAreas": {
    "location_and_travel": {
      "rawScore": 100,
      "weightedScore": 20,
      "weight": 0.2,
      "status": "pass"
    },
    "salary_alignment": {
      "rawScore": 75,
      "weightedScore": 15,
      "weight": 0.2,
      "status": "pass"
    }
  },
  "calculatedAt": "2026-05-27T10:20:00Z"
}
```

### 6.2 Get Candidate Scores
```
GET /qualifications/:applicationId/scores
Authorization: Bearer jwt_token_here

Response: 200 OK
{
  "applicationId": "uuid",
  "scores": [
    {
      "qualificationArea": "location_and_travel",
      "rawScore": 100,
      "weightedScore": 20,
      "weight": 0.2,
      "status": "pass",
      "evaluationLogic": "Candidate willing to relocate"
    }
  ]
}
```

### 6.3 Get Routing Outcome
```
GET /qualifications/:applicationId/outcome
Authorization: Bearer jwt_token_here

Response: 200 OK
{
  "applicationId": "uuid",
  "outcome": "progress",
  "overallScore": 78.5,
  "reasonSummary": "Candidate meets all mandatory criteria and scores 78.5/100. Recommend progression to interview stage.",
  "decisionData": {
    "mandatoryRulesPassed": true,
    "flagsRaised": 0,
    "recommendedNextStep": "phone_screen"
  },
  "createdAt": "2026-05-27T10:20:00Z"
}
```

### 6.4 Override Decision
```
PUT /qualifications/:applicationId/override
Authorization: Bearer jwt_token_here
Content-Type: application/json

Request:
{
  "newOutcome": "review",
  "reasonForOverride": "Candidate has relevant experience but needs assessment by hiring manager"
}

Response: 200 OK
{
  "applicationId": "uuid",
  "outcome": "review",
  "overrideReason": "Candidate has relevant experience but needs assessment by hiring manager",
  "overriddenBy": "user_uuid",
  "overriddenAt": "2026-05-27T10:25:00Z"
}
```

---

## 7. DASHBOARD ENDPOINTS

### 7.1 Get Dashboard Metrics
```
GET /dashboard/metrics
Authorization: Bearer jwt_token_here

Query Parameters:
- organisationId=org_uuid (required)
- roleId=role_uuid (optional)
- dateFrom=2026-05-01 (optional)
- dateTo=2026-05-27 (optional)

Response: 200 OK
{
  "totalApplications": 250,
  "applicationsThisWeek": 45,
  "screeningCompleted": 120,
  "progressedCandidates": 45,
  "rejectedCandidates": 50,
  "underReview": 25,
  "conversionRate": 0.18,
  "averageScreeningTime": 14
}
```

### 7.2 Get Candidates List
```
GET /dashboard/candidates
Authorization: Bearer jwt_token_here

Query Parameters:
- organisationId=org_uuid (required)
- status=progressed (optional)
- roleId=role_uuid (optional)
- searchTerm=jane (optional)
- limit=20 (default)
- offset=0 (default)
- sortBy=createdAt (optional)

Response: 200 OK
{
  "total": 45,
  "limit": 20,
  "offset": 0,
  "candidates": [
    {
      "candidateId": "uuid",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "appliedRoles": ["Senior Engineer"],
      "latestStatus": "progressed",
      "screeningScore": 78.5,
      "appliedDate": "2026-05-20T10:00:00Z"
    }
  ]
}
```

### 7.3 Get Applications List
```
GET /dashboard/applications
Authorization: Bearer jwt_token_here

Query Parameters:
- organisationId=org_uuid (required)
- roleId=role_uuid (optional)
- status=all (optional: all, applied, screening, completed)
- limit=20 (default)
- offset=0 (default)

Response: 200 OK
{
  "total": 250,
  "applications": [...]
}
```

### 7.4 Get Funnel Analytics
```
GET /dashboard/analytics/funnel
Authorization: Bearer jwt_token_here

Query Parameters:
- organisationId=org_uuid (required)
- roleId=role_uuid (optional)
- dateRange=30days (optional: 7days, 30days, 90days)

Response: 200 OK
{
  "funnel": [
    {
      "stage": "Applied",
      "count": 250,
      "percentage": 100
    },
    {
      "stage": "Screening Completed",
      "count": 150,
      "percentage": 60
    },
    {
      "stage": "Progressed",
      "count": 45,
      "percentage": 18
    },
    {
      "stage": "Interview",
      "count": 12,
      "percentage": 4.8
    }
  ]
}
```

### 7.5 Export Report
```
POST /dashboard/reports/export
Authorization: Bearer jwt_token_here
Content-Type: application/json

Request:
{
  "organisationId": "org_uuid",
  "reportType": "candidates",
  "format": "csv",
  "dateFrom": "2026-05-01",
  "dateTo": "2026-05-27"
}

Response: 200 OK
{
  "reportId": "uuid",
  "status": "processing",
  "downloadUrl": "https://qani.io/api/v1/dashboard/reports/uuid/download",
  "expiresAt": "2026-05-28T10:00:00Z"
}
```

---

## 8. ADMIN ENDPOINTS

### 8.1 Get All Organisations (Admin)
```
GET /admin/organisations
Authorization: Bearer admin_jwt_token

Query Parameters:
- limit=20 (default)
- offset=0 (default)
- status=active (optional)

Response: 200 OK
{
  "total": 45,
  "organisations": [...]
}
```

### 8.2 Get All Users (Admin)
```
GET /admin/users
Authorization: Bearer admin_jwt_token

Query Parameters:
- organisationId=org_uuid (optional)
- role=recruiter (optional)
- limit=20 (default)

Response: 200 OK
{
  "total": 250,
  "users": [...]
}
```

### 8.3 Get Audit Logs (Admin)
```
GET /admin/audit-logs
Authorization: Bearer admin_jwt_token

Query Parameters:
- organisationId=org_uuid (optional)
- entityType=application (optional)
- actionType=created (optional)
- limit=50 (default)
- offset=0 (default)
- dateFrom=2026-05-01 (optional)
- dateTo=2026-05-27 (optional)

Response: 200 OK
{
  "total": 1250,
  "logs": [
    {
      "id": "uuid",
      "entityType": "application",
      "actionType": "created",
      "entityId": "uuid",
      "userId": "uuid",
      "oldData": null,
      "newData": {...},
      "createdAt": "2026-05-27T10:00:00Z"
    }
  ]
}
```

### 8.4 Get System Health (Admin)
```
GET /admin/system-health
Authorization: Bearer admin_jwt_token

Response: 200 OK
{
  "status": "healthy",
  "database": {
    "status": "connected",
    "responseTime": 12,
    "lastCheck": "2026-05-27T10:30:00Z"
  },
  "api": {
    "status": "running",
    "uptime": "99.98%",
    "requestsPerMinute": 450
  },
  "openai": {
    "status": "connected",
    "lastUsed": "2026-05-27T10:28:00Z"
  },
  "sendgrid": {
    "status": "connected",
    "lastUsed": "2026-05-27T10:15:00Z"
  }
}
```

---

## ERROR RESPONSE FORMAT

All error responses follow this format:

```
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "statusCode": 400,
    "timestamp": "2026-05-27T10:00:00Z",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes:
- `VALIDATION_ERROR` (400)
- `AUTHENTICATION_REQUIRED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `CONFLICT` (409)
- `INTERNAL_SERVER_ERROR` (500)
- `SERVICE_UNAVAILABLE` (503)

---

## AUTHENTICATION

All authenticated endpoints require:

```
Authorization: Bearer <JWT_TOKEN>
```

JWT Token includes:
- User ID
- Email
- Role
- Organisation ID
- Token expiry (15 minutes)

Refresh token is valid for 7 days.

---

**Total Endpoints: 32**
**All documented with request/response examples**

