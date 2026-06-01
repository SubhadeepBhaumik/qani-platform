# QANI PLATFORM - SUPPORTING DOCUMENTATION

## USER FLOW DIAGRAMS

### Candidate User Flow

```
┌─────────────┐
│  Homepage   │ (View features, info)
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Click "Apply as     │
│ Candidate" Button   │
└──────┬──────────────┘
       │
       ▼
┌──────────────────────────┐
│ Register Candidate Page  │
│ Step 1: Basic Info       │
│ Step 2: Profile Setup    │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Email Verification       │
│ (Verify email link)      │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Candidate Dashboard      │
│ (View open positions)    │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Apply for Job            │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Screening Page           │
│ (Conversational AI)      │
│ - Answer questions       │
│ - Real-time evaluation   │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Screening Results        │
│ Status: Qualified/Review │
│         /Rejected        │
└──────────────────────────┘
```

### Recruiter User Flow

```
┌─────────────┐
│  Homepage   │ (View features)
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│ Click "Start Recruiting" │
│ Button                   │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Register Recruiter Page  │
│ (Company details)        │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Email Verification       │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Recruiter Dashboard      │
│ - View stats             │
│ - See applications       │
│ - Monitor screening      │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Create Job Opening       │
│ - Title, description     │
│ - Requirements           │
│ - Screening questions    │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Share Job Post           │
│ - Candidates apply       │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Monitor Screening        │
│ - View progress          │
│ - See qualified          │
│ - Export results         │
└──────────────────────────┘
```

---

## BACKEND API SPECIFICATIONS

### Authentication APIs

#### 1. Register Candidate
```
POST /api/v1/candidates/register

Request:
{
  "firstName": "string",
  "lastName": "string",
  "email": "string (email format)",
  "password": "string (min 8 chars)",
  "phone": "string (optional)",
  "location": "string (optional)"
}

Response (201):
{
  "id": "candidate-123",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "jwt_token_here",
  "message": "Registration successful. Check email for verification."
}

Error (400):
{
  "errors": [
    {
      "field": "email",
      "message": "Email already in use"
    }
  ]
}
```

#### 2. Register Recruiter
```
POST /api/v1/auth/register

Request:
{
  "companyName": "string",
  "companyEmail": "string",
  "firstName": "string",
  "lastName": "string",
  "password": "string",
  "role": "recruiter"
}

Response (201):
{
  "id": "recruiter-456",
  "organizationId": "org-123",
  "token": "jwt_token_here"
}
```

#### 3. Login
```
POST /api/v1/auth/login

Request:
{
  "email": "string",
  "password": "string",
  "rememberMe": "boolean (optional)"
}

Response (200):
{
  "id": "user-123",
  "email": "user@example.com",
  "role": "candidate|recruiter",
  "token": "jwt_token_here",
  "expiresIn": 86400
}

Error (401):
{
  "error": "Invalid email or password"
}
```

#### 4. Forgot Password
```
POST /api/v1/auth/forgot-password

Request:
{
  "email": "string"
}

Response (200):
{
  "message": "Password reset link sent to your email",
  "expiresIn": 3600
}
```

#### 5. Reset Password
```
POST /api/v1/auth/reset-password

Request:
{
  "token": "string (from email link)",
  "password": "string",
  "confirmPassword": "string"
}

Response (200):
{
  "message": "Password reset successful"
}
```

#### 6. Verify Email
```
POST /api/v1/auth/verify-email

Request:
{
  "token": "string (from email link)",
  "email": "string"
}

Response (200):
{
  "message": "Email verified successfully",
  "emailVerified": true
}
```

### Application & Screening APIs

#### 7. Apply for Job
```
POST /api/v1/applications

Request:
{
  "candidateId": "string",
  "roleId": "string"
}

Response (201):
{
  "id": "app-123",
  "candidateId": "candidate-123",
  "roleId": "role-456",
  "status": "applied",
  "appliedAt": "2026-05-29T12:00:00Z"
}
```

#### 8. Start Screening
```
POST /api/v1/screening/start

Request:
{
  "applicationId": "string",
  "candidateName": "string"
}

Response (201):
{
  "id": "session-789",
  "applicationId": "app-123",
  "status": "active",
  "messages": [
    {
      "role": "assistant",
      "content": "Hello! Welcome to screening..."
    }
  ]
}
```

#### 9. Send Screening Message
```
POST /api/v1/screening/message

Request:
{
  "sessionId": "string",
  "message": "string"
}

Response (200):
{
  "sessionId": "session-789",
  "message": "Great! Next question...",
  "messageCount": 5
}
```

#### 10. End Screening
```
POST /api/v1/screening/end

Request:
{
  "sessionId": "string",
  "decision": "progress|review|reject"
}

Response (200):
{
  "id": "session-789",
  "status": "completed",
  "score": 82,
  "decision": "progress"
}
```

### Dashboard APIs

#### 11. Get Dashboard Stats
```
GET /api/v1/dashboard/stats?organisationId=org-123

Response (200):
{
  "totalApplications": 25,
  "screened": 15,
  "progress": 8,
  "review": 4,
  "rejected": 3,
  "conversionRate": 32
}
```

#### 12. Get Applications List
```
GET /api/v1/dashboard/applications?organisationId=org-123&status=screened

Response (200):
[
  {
    "applicationId": "app-123",
    "candidateName": "John Doe",
    "roleName": "Senior Developer",
    "status": "completed",
    "score": 85,
    "decision": "progress",
    "appliedAt": "2026-05-28T12:00:00Z"
  },
  ...
]
```

#### 13. Get Screening Progress
```
GET /api/v1/dashboard/screening-progress?organisationId=org-123

Response (200):
{
  "totalSessions": 15,
  "completed": 12,
  "inProgress": 3,
  "avgTimePerSession": 18,
  "avgScorePerSession": 76
}
```

---

## FORM VALIDATION RULES

### Email Validation
- Pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Must be valid email format

### Password Validation
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (@$!%*?&)

### Name Validation
- First/Last Name: 2-50 characters
- Only letters, spaces, hyphens allowed

### Company Name Validation
- 2-100 characters
- Required for recruiters

---

## ERROR HANDLING

### Common Errors & Messages

```
1. Invalid Email
   Status: 400
   Message: "Please enter a valid email address"

2. Email Already In Use
   Status: 409
   Message: "Email already registered. Please login or use different email."

3. Weak Password
   Status: 400
   Message: "Password must contain uppercase, number, and special character"

4. Invalid Credentials
   Status: 401
   Message: "Invalid email or password"

5. Too Many Login Attempts
   Status: 429
   Message: "Too many login attempts. Try again in 5 minutes."

6. Network Error
   Status: 0
   Message: "Network error. Please check your connection and try again."

7. Server Error
   Status: 500
   Message: "Server error. Please try again later."

8. Expired Token
   Status: 401
   Message: "Session expired. Please login again."

9. Invalid Token
   Status: 400
   Message: "Invalid or expired link. Please request new password reset."

10. Missing Required Field
    Status: 400
    Message: "[Field name] is required"
```

---

## LOCAL STORAGE DATA

Store these in browser localStorage for persistence:

```javascript
{
  "token": "jwt_token_here",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "candidate|recruiter"
  },
  "expiresAt": 1682620800
}
```

Clear localStorage on logout.

---

## IMPLEMENTATION CHECKLIST

When converting HTML from Google AI Studio to React:

### Mandatory Steps

- [ ] Extract HTML structure from Google AI Studio output
- [ ] Convert to React components (one per page)
- [ ] Replace inline styles with TailwindCSS classes
- [ ] Extract JavaScript to event handlers
- [ ] Add form validation logic
- [ ] Add API integration (fetch calls)
- [ ] Add error handling (try-catch)
- [ ] Add loading states (isLoading boolean)
- [ ] Add success/error messages (toast notifications)
- [ ] Add localStorage integration (save token, user)
- [ ] Add routing (next/router for navigation)
- [ ] Test on mobile + desktop
- [ ] Fix accessibility issues

### File Structure

```
frontend/app/
├── page.tsx (Homepage)
├── auth/
│   ├── login/page.tsx
│   ├── register-candidate/page.tsx
│   ├── register-recruiter/page.tsx
│   ├── forgot-password/page.tsx
│   └── reset-password/page.tsx
├── candidate/
│   ├── dashboard/page.tsx
│   └── screening/page.tsx
├── recruiter/
│   └── dashboard/page.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Navigation.tsx
│   ├── forms/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ScreeningForm.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── Alert.tsx
└── lib/
    ├── api.ts (API client)
    ├── validation.ts (Form validation)
    └── auth.ts (Auth helpers)
```

---

## NEXT STEPS

1. **Copy the super prompt** above
2. **Go to Google AI Studio:** https://aistudio.google.com
3. **Paste the entire prompt**
4. **Click "Generate"** or submit
5. **Wait for HTML output** (8 files)
6. **Copy each HTML file** when provided
7. **Send to me** (I'll convert to React)

---

## QUALITY ASSURANCE

After Google AI Studio generates HTML:

**Check Each File:**
- [ ] Has proper HTML5 structure
- [ ] Responsive design (test at 375px, 1024px, 1440px)
- [ ] All forms functional
- [ ] Buttons clickable
- [ ] Links work
- [ ] Logo visible
- [ ] Colors match design system
- [ ] Typography correct
- [ ] No console errors
- [ ] Mobile touch-friendly (44px buttons)

If anything missing → Ask Google AI Studio to regenerate specific file.

---

## SUCCESS CRITERIA

✅ All 8 HTML pages generated
✅ Consistent branding & design
✅ Responsive (mobile + desktop)
✅ Forms with validation
✅ Professional look & feel
✅ Zero external dependencies
✅ Production-ready code
✅ Ready for React conversion

