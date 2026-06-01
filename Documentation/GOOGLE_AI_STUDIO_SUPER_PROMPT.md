
You are an expert UI/UX designer and full-stack frontend architect. Your task is to generate **COMPLETE, PRODUCTION-GRADE HTML/REACT** for the QANI platform - a comprehensive AI-powered recruitment screening system.

## PROJECT SCOPE

**Platform:** Recruitment screening + candidate management + recruiter dashboard + admin interface
**Users:** Candidates (job seekers), Recruiters (HR), Admins
**Technology:** React 19, TypeScript, Tailwind CSS, Vite
**Deployment:** Production-ready, no external dependencies
**Pages Required:** 28 complete pages with all features, edge cases, and states

---

## DESIGN SYSTEM (EXTENDED)

### Color Palette (Extended)
- **Primary Blue:** #2563EB (buttons, links, highlights)
- **Dark Blue:** #1E40AF (hover state)
- **Light Blue:** #DBEAFE (backgrounds, accents)
- **Cyan/Teal:** #06B6D4 (secondary accent)
- **Success Green:** #10B981 (qualified, success)
- **Warning Orange:** #F97316 (review, caution)
- **Error Red:** #EF4444 (rejected, errors)
- **Gray 900:** #111827 (headings, text)
- **Gray 800:** #1F2937 (body text)
- **Gray 700:** #374151 (secondary text)
- **Gray 600:** #4B5563 (disabled text)
- **Gray 500:** #6B7280 (muted text)
- **Gray 400:** #9CA3AF (borders)
- **Gray 300:** #D1D5DB (light borders)
- **Gray 200:** #E5E7EB (very light)
- **Gray 100:** #F3F4F6 (backgrounds)
- **Gray 50:** #F9FAFB (page background)
- **White:** #FFFFFF
- **Black:** #000000

### Extended Typography
- **H1:** 56px, Bold (700), Line Height 1.2, Letter Spacing -1px
- **H2:** 40px, Bold (700), Line Height 1.3, Letter Spacing -0.5px
- **H3:** 28px, SemiBold (600), Line Height 1.4
- **H4:** 24px, SemiBold (600), Line Height 1.4
- **H5:** 20px, SemiBold (600), Line Height 1.4
- **Body XL:** 18px, Regular (400), Line Height 1.6
- **Body:** 16px, Regular (400), Line Height 1.6
- **Body SM:** 14px, Regular (400), Line Height 1.5
- **Label:** 14px, Medium (500), Line Height 1.4
- **Caption:** 12px, Regular (400), Line Height 1.4
- **Code:** 13px, Mono (400), Line Height 1.5

### Extended Spacing
- xs: 2px
- sm: 4px
- md: 8px
- lg: 16px
- xl: 24px
- 2xl: 32px
- 3xl: 48px
- 4xl: 64px
- 5xl: 80px

### Components Styling

**Buttons:**
- Primary: Blue bg, white text, 8px radius, 12px x 16px padding
- Secondary: Blue border, blue text, transparent bg
- Danger: Red bg, white text
- Success: Green bg, white text
- Outline: Border only, no bg
- Sizes: Small (8px×12px), Medium (12px×16px), Large (16px×20px)
- Hover: Darker shade, shadow
- Disabled: Gray bg, opacity 0.5
- Loading: Spinner inside

**Forms:**
- Input: 44px height (mobile touch), 8px radius, light gray bg, border on focus
- Label: 14px, medium weight, gray text
- Helper text: 12px, gray text below input
- Error message: 12px, red text, red icon
- Success indicator: Green checkmark, green text
- Placeholder: Gray text, lighter shade
- Focus: Blue border, blue shadow
- Disabled: Gray bg, strikethrough text

**Cards:**
- Background: White
- Padding: 24px
- Border Radius: 12px
- Shadow: Subtle (0 1px 3px rgba(0,0,0,0.05))
- Hover: Lift effect with larger shadow

**Badges/Tags:**
- Padding: 4px 12px
- Border Radius: 16px
- Font: 12px, medium weight
- Colors: Blue bg for default, green for success, orange for warning, red for danger

**Modals:**
- Overlay: Dark (rgba(0,0,0,0.5))
- Card: White, 16px radius
- Padding: 32px
- Close button: X in top right
- Backdrop: Click to close
- Animation: Fade in 200ms

**Tables:**
- Header: Gray bg (#F3F4F6), bold text
- Rows: White bg, border-bottom
- Hover: Light gray bg
- Padding: 16px per cell
- Sortable headers: Pointer, arrow indicator
- Striped: Alternating row colors optional

**Charts/Visualizations:**
- Pie charts: Colors from palette
- Bar charts: Blue bars, gray background
- Line charts: Blue line, light blue fill below
- Legend: Beside or below chart
- Responsive: Shrink on mobile

---

## COMPLETE PAGE LIST (28 Pages)

### TIER 1: Authentication & Onboarding (6 Pages)

#### 1. Homepage (`/`)
**Components:**
- Sticky header with navigation + login button
- Hero section: Large heading, subtext, 2 CTA buttons
- Features section: 3-column grid (AI Screening, Real-Time Analytics, Lightning Fast)
- How it works: 4-step diagram/timeline
- Pricing section (optional): 2-3 tiers (Free, Pro, Enterprise)
- Social proof: Quote, logo cloud, stats
- Footer: Links, copyright
- Mobile: Stack everything, hamburger menu, single-column features

**Content:**
- Hero: "AI-Powered Recruitment at Scale"
- Features with icons
- CTA: "Apply as Candidate", "Start Recruiting"
- Stats: 10K+ Candidates, 95% Accuracy, 8hrs Saved

#### 2. Login (`/auth/login`)
**Layout:** Two-column (hero left, form right) or single-column mobile
**Form Fields:**
- Email (required, email validation)
- Password (required, with show/hide toggle)
- Checkbox: "Remember me"
- Link: "Forgot password?"
**Buttons:**
- "LOGIN" (primary, full width)
- "Sign Up as Candidate" (secondary)
- "Sign Up as Recruiter" (secondary)
**States:**
- Empty: Placeholder text, gray borders
- Focus: Blue border, blue shadow
- Valid: Green checkmark icon
- Invalid: Red border, error message below
- Submitting: Spinner in button, disabled
- Error: Red alert box with message
- Success: Redirect to dashboard

#### 3. Register Candidate - Step 1 (`/auth/register-candidate/step-1`)
**Progress Bar:** 2 steps, Step 1 highlighted
**Form Fields:**
- First Name (required, 2-50 chars)
- Last Name (required, 2-50 chars)
- Email (required, email format)
- Phone (optional, international format)
- Password (required, 8+ chars, strength indicator)
  - Strength meter: Red → Orange → Green
  - Requirements: 8+ chars, 1 uppercase, 1 number, 1 special char
- Confirm Password (required, match validation)
- Checkbox: "I agree to Terms & Conditions" (required)
**Buttons:**
- "NEXT" (primary, full width, disabled if invalid)
- "Already have account? Login" (link)
**Validation:**
- Real-time validation
- Show/hide requirements as user types
- Error messages inline
- Strength meter updates

#### 4. Register Candidate - Step 2 (`/auth/register-candidate/step-2`)
**Progress Bar:** Step 2 highlighted
**Form Fields:**
- Current Job Title (optional, text)
- Years of Experience (optional, number, 0-60)
- Location (optional, autocomplete or dropdown)
- Skills (optional, multi-select tags)
  - Searchable dropdown
  - Pre-populated suggestions
  - Add custom skills
- Resume Upload (optional, .pdf, .doc, .docx, max 5MB)
  - Drag-and-drop area
  - File picker
  - File preview
- LinkedIn URL (optional, URL format)
- Portfolio URL (optional, URL format)
**Buttons:**
- "← BACK" (secondary)
- "CREATE ACCOUNT" (primary, full width)
**Messages:**
- Success: "Account created! Redirecting..."
- Error: "Registration failed. Please try again."
- Validation: Field-level error messages

#### 5. Register Recruiter (`/auth/register-recruiter`)
**Single-step form in card**
**Form Fields:**
- Company Name (required, 2-100 chars)
- Company Email (required, email format, company domain)
- Your Full Name (required, text)
- Your Job Title (required, dropdown: HR Manager, Recruiter, Director, etc.)
- Password (required, strength meter)
- Company Size (required, dropdown: 1-10, 11-50, 51-200, 200+)
- Industry (required, dropdown: Technology, Finance, Healthcare, etc.)
- Checkbox: "I agree to Terms" (required)
**Buttons:**
- "REGISTER" (primary, full width)
- "Already have account? Login" (link)
**Validation:**
- Company email domain validation
- Real-time validation
- Error messages
- Success redirect to email verification

#### 6. Email Verification (`/auth/verify-email`)
**States:**
- **Waiting:** Show email, "Resend link" button, countdown timer
- **Verified:** Checkmark, "Email verified!", redirect to onboarding/dashboard
- **Error:** "Link expired", "Resend" button
**Content:**
- Heading: "Verify Your Email"
- Instructions: "We sent a link to [email]. Click it to verify."
- Link: "Resend verification" with 60-second countdown
- Footer: "Didn't receive email? Check spam folder"

---

### TIER 2: Candidate Experience (8 Pages)

#### 7. Candidate Dashboard (`/candidate/dashboard`)
**Header:**
- Greeting: "Welcome, [First Name]!"
- Search bar (for jobs)
- Notifications bell (with count badge)
- User profile dropdown

**Layout:** Single column, card-based

**Section 1: Quick Stats (4 cards)**
- Total Applications (number, icon: 📋)
- In Progress (number, icon: ⏳)
- Qualified (number, icon: ✓)
- Rejected (number, icon: ✗)
- Each card shows count + trend (↑/↓ + %)

**Section 2: Recent Applications (Table)**
- Columns: Position, Company, Applied, Status, Actions
- Status badges: Applied (gray), Screening (blue), Qualified (green), Review (orange), Rejected (red)
- Sortable headers
- Row click → Application detail
- Actions dropdown: View, Track, Withdraw

**Section 3: Recommended Jobs (3-column grid, mobile: 1 column)**
- Job card: Title, Company, Location, Salary range
- Button: "View Details" or "Apply Now"
- Skeleton loading state while fetching

**Section 4: Progress Timeline**
- Vertical timeline showing recent activities
- "Applied to Senior React Developer"
- "Started screening for XYZ"
- "Qualified for ABC role"
- Timestamps

**Sidebar (Desktop Only):**
- Profile completion percentage
- "Complete profile" CTA
- Quick stats
- Recommended roles

**Mobile:**
- Stack everything vertically
- Hide sidebar
- Bottom navigation

#### 8. Browse Jobs (`/candidate/jobs`)
**Header:**
- Search input (company, title, location)
- Filters (collapsible on mobile):
  - Industry
  - Salary range (slider: $0-200K)
  - Experience level (dropdown)
  - Location (multi-select)
  - Company size
- Sort dropdown: Newest, Most relevant, Salary high-to-low

**Content:**
- Results count: "Showing X of Y jobs"
- Job cards in list view (2-column on desktop, 1 on mobile):
  - Company logo
  - Job title (large, blue)
  - Company name
  - Location
  - Salary range (if provided)
  - Quick description (truncated)
  - Tags: Experience level, employment type
  - "Apply" button (blue)
  - Save button (heart icon)
- Pagination: 20 per page, next/prev buttons

**Empty State:**
- "No jobs match your criteria"
- "Try adjusting your filters"
- "Browse all jobs" link

**Loading State:**
- Skeleton cards (4-5 placeholders)
- Gray placeholder bars

#### 9. Job Detail (`/candidate/jobs/:id`)
**Header:**
- Back button
- Save/Bookmark button (heart icon)
- Share button (dropdown: copy link, email, social)

**Content:**
- Job title (H2)
- Company info: Logo, name, location, company link
- Posted date: "Posted 5 days ago"
- Salary range (if provided)
- Employment type: Full-time, Part-time, Contract

**Tabs:**
- **Overview:** Description, requirements, responsibilities (from backend)
- **Company:** Company description, website, locations, size
- **Requirements:** Bulleted list of must-haves and nice-to-haves
- **About Screening:** "This job uses AI screening with 4 questions"

**Qualification Areas Section:**
- Shows 5 areas evaluated:
  - Location & Travel
  - Salary Alignment
  - Qualifications & Licenses
  - Work Rights & Availability
  - Skills & Experience
- Each with icon + brief explanation

**Action:**
- Large "APPLY NOW" button (blue, full width)
- "Saved" indicator if bookmarked
- Application status if already applied

**Sidebar (Desktop):**
- Similar jobs (3 cards)
- Company jobs (3 cards)

#### 10. Application Detail (`/candidate/applications/:id`)
**Header:**
- Back button
- Breadcrumb: Dashboard > Applications > [Position]
- Status badge (Applied, Screening, Qualified, Review, Rejected)

**Two-column layout (stacked on mobile):**

**Left Column:**
- Job info: Title, company, location, salary
- Application timeline:
  - Applied: [Date]
  - Screening Started: [Date]
  - Screening Completed: [Date]
  - Decision: [Date]
- Status with color coding
- Latest action/note from recruiter

**Right Column:**
- **Screening Results Section** (if screening completed)
  - Decision badge: "QUALIFIED" (green), "REVIEW" (orange), "REJECTED" (red)
  - Overall score: 82/100 (progress bar)
  - Scorecard: 5 qualification areas as bars:
    - Location & Travel: 85/100
    - Salary Alignment: 80/100
    - Qualifications: 78/100
    - Work Rights: 90/100
    - Skills & Experience: 81/100
  - AI Feedback: "Summary of strengths and areas to improve"
  - View Full Transcript: Link to screening conversation

**Actions:**
- If status = "Applied": "Withdraw Application" button
- If status = "Qualified": "View Next Steps" button
- If status = "Review": "Contact Recruiter" button

#### 11. Screening Conversation (`/candidate/screening/transcript/:id`)
**Header:**
- Back button
- Position name
- Date of screening
- Status: "Completed on [Date]"

**Chat Display:**
- Full conversation history (scrollable)
- Messages:
  - AI messages: Light blue bg (#DBEAFE), left-aligned, avatar icon
  - User messages: Dark blue bg (#2563EB), white text, right-aligned
  - Timestamps for each message
  - Question numbers: "Q1", "Q2", etc.

**Sidebar (Desktop) or Below (Mobile):**
- Metadata:
  - Duration: "X minutes"
  - Questions asked: 4
  - Date: "May 29, 2026"
  - Status: Completed
- Scores (5 bars):
  - Location: 85%
  - Salary: 80%
  - Qualifications: 78%
  - Work Rights: 90%
  - Skills: 81%
- AI Summary: Paragraph of analysis

**Bottom:**
- "Close" button or back to application

#### 12. Candidate Profile (`/candidate/profile`)
**Header:**
- "My Profile"
- Edit button (pencil icon, top right)

**Tabs:**
- **Personal Info** (editable)
  - First Name
  - Last Name
  - Email (read-only)
  - Phone
  - Location
  - Job Title
  - Years of Experience
  - About (text area, 500 chars)
  - Profile picture upload

- **Skills** (editable)
  - Multi-select dropdown with popular skills
  - Add custom skills
  - List of skills with ability to remove
  - Validation: 3-20 skills recommended

- **Resume** (editable)
  - Current resume file (if uploaded)
  - Upload new resume button (drag-drop + file picker)
  - File preview: "resume.pdf" with icon
  - Download link
  - Delete button

- **Links** (editable)
  - LinkedIn URL
  - Portfolio URL
  - GitHub URL
  - Website URL
  - Validation: Valid URLs only

- **Privacy** (settings)
  - Make profile public/private (radio)
  - Show/hide phone number
  - Show/hide location
  - Allow contact from recruiters (checkbox)
  - Allow download of resume (checkbox)

**Profile Completion:**
- Progress bar: "X% complete"
- Checklist: Photo, Bio, Skills, Resume, Links
- "Complete profile to match with more jobs" CTA

**Actions:**
- Edit mode: Save/Cancel buttons
- View mode: Edit button
- Delete account link (with confirmation modal)

#### 13. Candidate Settings (`/candidate/settings`)
**Tabs:**
- **Account**
  - Password: "Change password" button → modal with old/new/confirm
  - Email: Show current, "Change email" link
  - Delete account: Red button with confirmation

- **Notifications**
  - Email notifications (toggle):
    - Job recommendations
    - Application updates
    - Screening invitations
    - Messages from recruiters
    - Newsletter
  - Notification frequency: Immediate, Daily digest, Weekly digest

- **Privacy**
  - Profile visibility: Public/Private
  - Show email: Yes/No
  - Show phone: Yes/No
  - Allow contact: Yes/No
  - Analytics: Allow usage tracking: Yes/No

- **Preferences**
  - Preferred job title (text)
  - Preferred location (multi-select)
  - Preferred salary range (slider)
  - Preferred experience level (dropdown)
  - Preferred employment type (multi-select)

**Actions:**
- Save changes: "All changes saved" toast
- Cancel: Discard changes

#### 14. Candidate Notifications (`/candidate/notifications`)
**Header:**
- Notification count
- Mark all as read button
- Clear all button

**Tabs:**
- **All** (default)
- **Unread**
- **Archived**

**Notification List:**
- Notification card:
  - Icon (job, message, screening, etc.)
  - Title: "New job recommendation" or "Screening completed"
  - Description: 1-2 lines
  - Date: "2 hours ago"
  - Status: Unread (blue dot), Read (no dot)
  - Actions: Mark as read, Archive, Dismiss
  - Click → Navigate to relevant page

**Empty State:**
- "No notifications"
- "You're all caught up!"

---

### TIER 3: Recruiter Experience (10 Pages)

#### 15. Recruiter Dashboard (`/recruiter/dashboard`)
**Header:**
- Greeting: "Welcome back, [Name]!"
- Search bar (search candidates/applications)
- Notifications bell (with count badge)
- Organization name
- User dropdown (settings, logout)

**Sidebar Navigation:**
- Dashboard (highlighted)
- Applications
- Candidates
- Jobs
- Screening Queue
- Reports
- Settings
- Help
- Dark mode toggle

**Main Content: Dashboard**

**Section 1: Overview Cards (4 columns, stacked on mobile)**
- Total Applications: 145 (↑ 12% from last week)
- In Progress: 32 (screening currently active)
- Qualified Candidates: 18 (↑ 5)
- Rejected: 95 (rate: 65%)
- Each card: Large number, small label, trend indicator

**Section 2: Pipeline Visualization (Pie Chart)**
- Title: "Application Pipeline"
- Pie chart with 5 segments:
  - Applied (blue): 40%
  - Screening (cyan): 22%
  - Qualified (green): 12%
  - Review (orange): 15%
  - Rejected (red): 11%
- Legend below
- Click segment → Filter applications by status

**Section 3: Screening Progress (Bar Chart)**
- Title: "Screening Activity (Last 7 Days)"
- Bar chart: X-axis = days, Y-axis = count
- Bars for: Screening started, Completed, Qualified, Rejected
- Multiple colors stacked
- Hover: Show exact numbers
- Responsive: Stack bars vertically on mobile

**Section 4: Top Positions (Table)**
- Title: "Open Positions"
- Columns: Position Title, Department, Applications, Active Screenings, Status
- Sortable
- Row click → Job detail
- "View All" link

**Section 5: Recent Activity Feed**
- Timeline of activities:
  - "3 new applications for Senior React Developer"
  - "5 screenings completed today"
  - "2 candidates qualified for Product Manager"
  - "1 new job posted"
- Timestamps
- Click → Related detail page

**Right Sidebar (Desktop Only):**
- Quick actions:
  - Post new job (button)
  - Manage team (button)
  - View reports (button)
- Metrics:
  - Hiring efficiency: 4.2 days avg
  - Screening completion: 87%
  - Qualification rate: 18%

**Mobile:**
- Single column
- Charts smaller
- Cards stack
- Bottom navigation tabs: Dashboard, Queue, Jobs, Settings

#### 16. Applications Management (`/recruiter/applications`)
**Header:**
- Title: "Applications"
- Search input (candidate name, position)
- Filter button (opens filter sidebar)
- Sort dropdown: Newest, Highest score, Status

**Filters (Collapsible on mobile):**
- Status: Applied, Screening, Qualified, Review, Rejected (checkboxes)
- Position (dropdown or multi-select)
- Date range (from/to date pickers)
- Score range (slider: 0-100)
- Recruiter assigned (dropdown, if team)
- Apply/Clear buttons

**Application Table:**
- Columns:
  - Candidate Name (link to candidate detail)
  - Position (link to job)
  - Applied Date (sortable)
  - Status (badge: color-coded)
  - Score (progress bar 0-100, if screening done)
  - Assigned To (recruiter name, if team)
  - Actions (dropdown: view, message, change status, export)
- Sortable headers (arrow indicator)
- Striped rows (alternating colors)
- Row hover: Light bg, cursor pointer
- Click row → Application detail
- Bulk actions: Checkboxes, bulk action bar at top:
  - Change status (dropdown)
  - Export selected (button)
  - Send message (button)
  - Assign to (dropdown, if team)

**Pagination:**
- Results count: "Showing 1-20 of 145"
- Previous/Next buttons
- Page size selector: 10, 20, 50 per page
- Jump to page input

**Empty State:**
- "No applications match your filters"
- "Try adjusting filters or posting a new job"

**Loading State:**
- Skeleton rows (10)
- Gray placeholder bars

#### 17. Application Detail (`/recruiter/applications/:id`)
**Breadcrumb:** Applications > [Candidate Name] - [Position]

**Two-column layout (stacked on mobile):**

**Left Column (Main):**

**Candidate Card:**
- Avatar image (initials if no photo)
- Name (H3)
- Job title (subtitle)
- Location
- Email (mailto link)
- Phone (tel link)
- Links: LinkedIn, Portfolio, GitHub

**Application Timeline:**
- Vertical timeline:
  - Applied: [Date] - "Status: Application received"
  - Screening Invitation: [Date] - "Status: Invitation sent"
  - Screening Started: [Date] - "Status: In progress"
  - Screening Completed: [Date] - "Status: Completed"
  - Decision Made: [Date] - "Status: [Decision]"

**Screening Results** (if screening done):
- Status badge: "QUALIFIED" (green), "REVIEW" (orange), "REJECTED" (red)
- Overall score: 82/100 (progress bar, color-coded)
- Qualification scores (5 bars):
  - Location & Travel: 85/100
  - Salary Alignment: 80/100
  - Qualifications & Licenses: 78/100
  - Work Rights & Availability: 90/100
  - Skills & Experience: 81/100
- AI Summary: "Candidate demonstrated strong technical skills..."
- Recommendation: "Recommended for progress" or "Consider for review"

**Screening Transcript:**
- "View Full Conversation" link → Opens modal or new page
- Shows Q&A pairs in conversation format

**Right Column (Actions & Info):**

**Status Management:**
- Current status badge
- Change status dropdown:
  - Applied
  - Screening
  - Qualified
  - Review
  - Rejected
  - Withdrawn
- Save button
- Confirmation: "Move to [status]? This cannot be undone."

**Notes:**
- Text area: Add notes about candidate (500 chars)
- Saved notes displayed below
- Timestamps on notes
- Edit/delete own notes

**Assigned Recruiter:**
- Dropdown to reassign (if team)
- Save button

**Communication:**
- "Message Candidate" button → Opens compose modal
- Phone icon: Click to reveal phone number
- Email icon: Opens email client

**Actions Dropdown:**
- Schedule interview (opens calendar picker)
- Send offer letter (opens template selector)
- Reject candidate (opens reason modal)
- Archive (hides from main list)
- Download resume (if available)
- Export to CSV
- Move to different job (dropdown)

**Resume Preview:**
- "Resume" heading
- File icon + filename
- Download button
- Preview thumbnail (if PDF)

**Attached Documents:**
- List of any uploaded files
- Download links

#### 18. Screening Queue (`/recruiter/screening-queue`)
**Header:**
- Title: "Screening Queue"
- Count: "15 candidates waiting"
- Sort: Priority, Newest, Score

**Queue Settings (Icon button):**
- Auto-assign: Toggle
- Max per day: Number input
- Default screening length: Dropdown (15, 30, 45 min)
- Start immediately: Toggle

**Queue List:**
- Card-based layout (1 column, stacked)
- Each card:
  - Candidate name (H4)
  - Position (subtitle)
  - Applied date: "5 hours ago"
  - Profile completeness: Progress bar
  - Quick actions:
    - "Start Screening" button (blue)
    - "Skip" button (gray)
    - "Reschedule" button (gray)
  - Card hover: Lift effect
  - Card click: Expand to show more details

**Bulk Actions:**
- Checkbox per card
- Bulk action bar: "Send screening invitations" button

**Empty State:**
- "Queue is empty! All caught up."
- "Post a job to get new applications"

**Filters (Collapsible):**
- Position (dropdown)
- Applied date (relative: today, this week, this month)
- Profile completeness (slider: 0-100%)

#### 19. Jobs Management (`/recruiter/jobs`)
**Header:**
- Title: "Jobs"
- "Create New Job" button (blue, primary)
- Search input (job title, position)
- Filters:
  - Status: Open, Closed, Draft (checkboxes)
  - Department (dropdown)
  - Date posted (relative)

**Job Cards Grid (2 columns, 1 on mobile):**
- Job title (H4, blue link)
- Department (subtitle)
- Status badge: Open (green), Closed (gray), Draft (orange)
- Metrics row:
  - Applications: "12 applications"
  - In screening: "5 screening"
  - Qualified: "3 qualified"
- Posted date: "Posted 5 days ago"
- Actions dropdown:
  - View details
  - Edit job
  - Close job
  - View applications
  - View screening queue for this job
  - Duplicate job
  - Delete (with confirmation)
- Card click → Job detail

**Empty State:**
- "No jobs posted yet"
- "Create your first job" button

**Loading State:**
- Skeleton cards (4)

#### 20. Create/Edit Job (`/recruiter/jobs/new` and `/recruiter/jobs/:id/edit`)
**Header:**
- Back button
- "Create New Job" (H2) or "Edit Job: [Title]"
- Publish/Draft button (top right)

**Form with Tabs:**

**Tab 1: Basic Info**
- Job title (required, text, max 100 chars)
- Department (required, dropdown)
- Job category (required, dropdown: Engineer, Designer, Product, etc.)
- Location (required, multi-select)
- Employment type (required, checkbox: Full-time, Part-time, Contract, Remote)
- Salary range:
  - Min salary (optional, number input with currency selector)
  - Max salary (optional, number input)
  - Hide salary (checkbox)
- Job description (required, rich text editor, 500-5000 chars)
- Benefits (optional, multi-select checkboxes: Health insurance, 401k, Remote work, etc.)

**Tab 2: Requirements**
- Must-have qualifications (optional, text area, 1 per line)
- Nice-to-have qualifications (optional, text area, 1 per line)
- Required experience level (required, dropdown: Entry, Mid, Senior, Lead)
- Years of experience (required, number: min-max)
- Required skills (optional, multi-select dropdown)
- Education (optional, checkbox: High School, Bachelor's, Master's, PhD)

**Tab 3: Screening Setup**
- Screening enabled (toggle, required)
- Screening questions (required if enabled, up to 4 questions):
  - Question 1 (text area, required)
  - Question 2 (text area)
  - Question 3 (text area)
  - Question 4 (text area)
- Each question can have:
  - Type: Open-ended, Multiple choice, Behavioral
  - Difficulty: Easy, Medium, Hard
  - Importance: Nice-to-have, Important, Critical
  - Scoring rubric (optional, text area)

**Tab 4: Qualification Areas**
- 5 toggles for areas to evaluate:
  - ☑ Location & Travel (weights the importance)
  - ☑ Salary Alignment
  - ☑ Qualifications & Licenses
  - ☑ Work Rights & Availability
  - ☑ Skills & Experience
- Weight for each (slider: 0-100%):
  - Used in scoring algorithm
- Help text: "Higher weight = more important in qualification decision"

**Tab 5: Notification Settings**
- Notify when: New application (checkbox), Screening started (checkbox), Screening completed (checkbox)
- Notify: Email, In-app notification (checkboxes)
- Assign to recruiter (dropdown, if team)

**Tab 6: Publish Settings**
- Status: Draft (not visible), Open (visible, accepting applications), Closed (not accepting)
- Publication date (date picker): Set to publish in future
- Expiration date (date picker, optional): Job closes automatically
- Internal: Make internal-only (checkbox)
- Allow referrals (checkbox): Employees can refer candidates

**Form Actions (Sticky Bottom):**
- "Save as Draft" button (secondary)
- "Publish" button (primary, blue)
- "Cancel" button (gray, back to list)

**Validation:**
- Required fields highlighted
- Error messages inline
- Real-time validation
- Prevent publish if missing required fields

#### 21. Reports & Analytics (`/recruiter/reports`)
**Header:**
- Title: "Reports & Analytics"
- Date range selector: Last 7 days, Last 30 days, Last 90 days, Custom range
- Export button (dropdown: CSV, PDF)
- Refresh button (icon, top right)

**Tabs:**
- **Overview** (default)
- **Hiring Funnel**
- **Screening Metrics**
- **Recruiter Performance** (if team)

**Tab 1: Overview**

**Key Metrics Cards (4 columns, stacked on mobile):**
- Total applications: 245 (↑ 15% vs last period)
- Avg time to hire: 18 days (↓ 2 days vs last period)
- Offer acceptance rate: 82% (↑ 5% vs last period)
- Hiring cost per candidate: $450 (↓ $50 vs last period)

**Conversion Funnel (Waterfall Chart):**
- Applied: 245
- In Screening: 180 (73%)
- Qualified: 45 (25%)
- Offered: 22 (9%)
- Accepted: 18 (7%)
- Visualization: Bars decreasing, % shown

**Applications Over Time (Line Chart):**
- X-axis: Days
- Y-axis: Applications
- Blue line: New applications
- Area fill below
- Hover: Show exact numbers
- Legend: New, Completed, Qualified

**Top Performing Positions (Table):**
- Columns: Position, Total Applications, Qualified %, Avg Time to Hire
- Sortable
- Top 5 shown, "View more" link

**Tab 2: Hiring Funnel**

**Detailed Funnel Analysis:**
- Stage 1: Applied (245 candidates)
- Stage 2: Screening (180, drop-off: 65, 27%)
- Stage 3: Qualified (45, drop-off: 135, 75%)
- Stage 4: Offer (22, drop-off: 23, 51%)
- Stage 5: Accepted (18, drop-off: 4, 18%)

**Visualization:** Sankey diagram or waterfall chart
**Metrics per stage:**
- Conversion rate
- Avg time in stage
- Drop-off rate

**Tab 3: Screening Metrics**

**Cards:**
- Total screenings: 180
- Avg screening duration: 24 mins
- Completion rate: 92%
- Avg score: 76/100
- Qualification rate: 25%

**Score Distribution (Histogram):**
- X-axis: Score (0-100)
- Y-axis: Number of candidates
- Color-coded: Red (0-40), Orange (40-60), Green (60-100)

**Qualification Breakdown (Pie Chart):**
- Qualified: 45 (25%)
- Review: 67 (37%)
- Rejected: 68 (38%)

**By Qualification Area (Bar Chart):**
- 5 bars (one per area)
- Average score for each area
- Color gradient

**Tab 4: Recruiter Performance (if team)**

**Team Member Cards (if multiple recruiters):**
- Recruiter name
- Applications handled: 45
- Qualification rate: 28%
- Avg screening duration: 22 mins
- Avg time to hire: 16 days

**Leaderboard Table:**
- Columns: Recruiter, Applications, Qual Rate, Avg Time, Offers, Acceptance Rate
- Sortable
- Performance indicators (↑/↓)

**Export Options:**
- Export as CSV (opens download)
- Export as PDF (opens download)
- Schedule report (modal: email, frequency)

#### 22. Candidate Management (`/recruiter/candidates`)
**Header:**
- Title: "Candidates"
- Search input (name, email, skills)
- Filters:
  - Status: Applied, Qualified, Rejected (checkboxes)
  - Position (dropdown)
  - Score range (slider)
  - Date added (relative)

**Candidate Table:**
- Columns:
  - Candidate name (link to candidate detail)
  - Email (mailto)
  - Phone
  - Position applied for (link to job)
  - Status (badge)
  - Score (if screening done)
  - Last interaction (date)
  - Actions (dropdown)
- Sortable headers
- Striped rows
- Click row → Candidate detail

**Candidate Detail Modal/Sidebar:**
- Avatar + name
- Quick info: email, phone, location, job title
- Quick actions:
  - Message
  - Schedule interview
  - Change status
  - View full profile
  - Download resume

**Bulk Actions:**
- Checkboxes
- Bulk action bar:
  - Change status
  - Send message
  - Export
  - Move to different job
  - Archive

**Empty State:**
- "No candidates found"
- "Try adjusting filters or post a new job"

#### 23. Team Management (`/recruiter/settings/team`)
**Header:**
- Title: "Team Management"
- "Invite team member" button (blue, primary)

**Team Members List:**
- Table with columns:
  - Name (link to member detail)
  - Email
  - Role: Admin, Recruiter, Viewer (dropdown)
  - Joined date
  - Applications assigned (count)
  - Actions (dropdown: Edit, Remove, Send message)

**Invite Team Member Modal:**
- Email input (required)
- Role dropdown: Admin (all access), Recruiter (jobs, applications, screening), Viewer (read-only)
- Send invite button
- Success message: "Invite sent to [email]"
- Pending invites section:
  - Email, role, invited date
  - Resend or revoke buttons

**Member Detail Modal:**
- Name
- Email
- Role (editable dropdown)
- Joined date
- Performance: Applications handled, Qualification rate
- Permissions (role-based):
  - Read
  - Write
  - Delete
  - Admin (all)
- Actions: Change role, Remove member, Send message

#### 24. Recruiter Settings (`/recruiter/settings`)
**Tabs:**
- **Organization**
  - Company name
  - Company size (dropdown)
  - Industry (dropdown)
  - Website
  - Logo upload (drag-drop)
  - Company description (text area)

- **Account**
  - First name
  - Last name
  - Email (read-only)
  - Password: "Change password" button → modal
  - Two-factor authentication (toggle + setup)

- **Notifications**
  - Email notifications (toggle):
    - New applications
    - Screening completed
    - Team member actions
    - System updates
  - Notification frequency: Immediate, Daily digest, Weekly digest

- **Billing** (if applicable)
  - Current plan: "Pro Plan"
  - Renewal date: "June 29, 2026"
  - Upgrade/Downgrade buttons
  - Billing history table

- **Integrations**
  - Connected apps: Slack, email, etc. (with toggles)
  - Add integration button
  - API key (for developers) with copy button

**Save Changes:**
- "Save all changes" button at bottom
- Toast: "All changes saved"

---

### TIER 4: Admin & Shared (4 Pages)

#### 25. Admin Dashboard (`/admin/dashboard`)
**Header:**
- "Admin Dashboard"
- Date range selector
- Refresh button

**Sidebar Navigation:**
- Dashboard
- Users
- Organizations (if multi-tenant)
- Settings
- Logs

**Overview Metrics (6 cards):**
- Total users: 1,245 (↑ 12%)
- Active organizations: 234 (↑ 5%)
- Total applications: 15,678 (↑ 8%)
- System health: 99.9% uptime
- API calls (24h): 1.2M
- Errors (24h): 3 (↓ 1)

**Charts:**
- User growth (line chart): 30-day trend
- Applications over time (area chart)
- Top organizations (table): org name, users, applications, status

**System Health:**
- Server status: Green (All systems operational)
- Database: Green
- API: Green
- CDN: Green
- Each with status indicator + uptime %

**Recent Activity Feed:**
- Log of system events (last 20)
- User signups, job posts, screening completions
- Timestamps
- Clickable entries for details

#### 26. Admin Users Management (`/admin/users`)
**Header:**
- Title: "Users Management"
- Search input (name, email, organization)
- Filters:
  - Role: Candidate, Recruiter, Admin (checkboxes)
  - Status: Active, Inactive, Suspended (checkboxes)
  - Organization (dropdown, if multi-tenant)

**Users Table:**
- Columns:
  - Name
  - Email
  - Role
  - Organization (if multi-tenant)
  - Status: Active (green), Inactive (gray), Suspended (red)
  - Joined date
  - Last active
  - Actions (dropdown: View, Edit, Suspend, Delete)
- Sortable headers
- Click row → User detail modal

**User Detail Modal:**
- Avatar + name
- Email, role, organization
- Status (edit): Active, Inactive, Suspended
- Created date
- Last login date
- Applications (if candidate): count
- Jobs managed (if recruiter): count
- Actions:
  - Reset password (send reset email)
  - Suspend account
  - Delete account (with confirmation)
  - Send message

**Bulk Actions:**
- Checkboxes
- Bulk action bar:
  - Change status
  - Send message
  - Export
  - Delete (with confirmation)

#### 27. Help & FAQ (`/help`)
**Header:**
- Title: "Help & Support"
- Search input (search FAQs)
- Contact support button

**Sections (Accordion):**
- **Getting Started**
  - How to create account
  - How to post job (recruiter)
  - How to apply for job (candidate)
  - How to start screening

- **Features**
  - AI screening explained
  - Qualification areas
  - Scoring system
  - Dashboard explained
  - Reports explained

- **Account**
  - How to change password
  - How to update profile
  - How to delete account
  - Privacy settings

- **Troubleshooting**
  - Screening not starting
  - Can't upload resume
  - Email not received
  - Forgot password

- **Pricing & Plans** (if applicable)
  - Plan comparison
  - How to upgrade
  - Billing questions

**Each Accordion Item:**
- Title + icon (help circle)
- Content: Paragraph + images/screenshots + links
- External link to full docs (if needed)
- "Was this helpful?" buttons (👍👎)
- Related articles links

**Contact Support:**
- Modal form:
  - Subject (dropdown)
  - Description (text area)
  - Attachment (file upload)
  - Priority (radio: Low, Medium, High)
  - Submit button
- Success: "Ticket #123 created. We'll respond within 24 hours."

#### 28. Error Pages (3 variants)

**404 Not Found (`/404`)**
- Large "404" text
- Heading: "Page not found"
- Description: "The page you're looking for doesn't exist."
- Icon: 🔍
- "Go home" button (blue)
- Illustration (optional)

**500 Server Error (`/500`)**
- Large "500" text
- Heading: "Server error"
- Description: "Something went wrong. Please try again later."
- Icon: ⚠️
- "Go home" button (blue)
- "Contact support" link

**403 Forbidden (`/403`)**
- Large "403" text
- Heading: "Access denied"
- Description: "You don't have permission to access this page."
- Icon: 🔒
- "Go back" button
- "Request access" link (if applicable)

---

## ADDITIONAL COMPONENTS & PATTERNS

### Navigation Components

**Header Navigation:**
- Logo + brand name on left (click to home)
- Nav links: Features, Pricing, Help (on homepage/landing)
- Right side:
  - Search input (on authenticated pages)
  - Notifications bell (with badge count)
  - User profile dropdown
  - Logout button

**Sidebar Navigation:**
- Logo at top
- Nav items (with icons, text, highlight indicator)
- Nested items (expandable)
- Collapse/expand toggle
- User card at bottom (profile, settings, logout)
- Dark mode toggle

**Bottom Tab Navigation (Mobile):**
- 5-6 main tabs (icons + labels)
- Active tab: Blue highlight, blue icon
- Inactive: Gray icon
- No text labels on small screens (icon only)

**Breadcrumbs:**
- Home > Section > Page
- Separator: "/"
- Last item: Not a link
- Click previous → Navigate

### Form Components

**Input Field:**
- Label (14px, medium, gray)
- Input (44px height for mobile touch)
- Placeholder text (gray)
- Focus state: Blue border, blue shadow
- Error state: Red border, red text
- Success state: Green checkmark
- Helper text (12px, gray, below input)
- Required indicator: Red asterisk (*)
- Disabled state: Gray bg, strikethrough text

**Dropdown/Select:**
- Label (14px)
- Dropdown trigger: Light gray bg, chevron icon
- Open dropdown: List of options, scrollable if >10
- Selected: Checkmark + blue highlight
- Hover: Light gray bg
- Search: If >5 options, searchable input

**Multi-Select:**
- Multiple selections
- Each selection as tag/chip: Blue bg, white text, X to remove
- Dropdown below showing remaining options
- Tag list wraps to next line

**Checkbox:**
- Custom styled: Blue border, white bg
- Checked: Blue bg, white checkmark
- Label next to checkbox
- Disabled: Gray bg
- Indeterminate state: Minus sign (for "select all")

**Radio Button:**
- Custom styled: Blue border
- Selected: Blue bg, white dot
- Label next to radio
- Disabled: Gray

**Toggle/Switch:**
- Rounded rectangle
- Off: Gray bg, left position
- On: Blue bg, right position
- Animated slide
- Label: Text or icon
- Disabled: Gray opacity

**Text Area:**
- Multi-line input
- Resize handle (bottom right)
- Character counter (optional): "250/500"
- Placeholder text
- Same focus/error states as input

**Date Picker:**
- Click input → Calendar popup
- Month/year navigation
- Selected date: Blue highlight
- Range selection: Blue fill between start/end
- Quick options: Today, Tomorrow, This week, This month

**File Upload:**
- Drag-and-drop zone (dashed border, light bg)
- "Click to upload" text
- File picker button
- File preview: Icon + filename
- File size validation (below upload area)
- Progress bar during upload
- Success: Checkmark + filename
- Error: Red error message

**Search Input:**
- Icon: Magnifying glass (left)
- Clear button: X (right, appears when has text)
- Placeholder: "Search..."
- Autocomplete suggestions (dropdown)
- Debounced search (after 300ms typing)

### Feedback Components

**Alert/Banner:**
- Variants: Info (blue), Success (green), Warning (orange), Error (red)
- Icon + message
- Close button (X)
- Background color + text color match variant
- Padding: 16px

**Toast/Notification:**
- Bottom-right corner (desktop), bottom (mobile)
- Auto-dismiss after 4 seconds
- Manual close (X button)
- Variants: Success (green), Error (red), Info (blue), Warning (orange)
- Icon + message + optional action button
- Stack multiple toasts (slide up)

**Modal Dialog:**
- Overlay: Dark (rgba(0,0,0,0.5))
- Card: White, 16px radius, centered
- Padding: 32px
- Close button: X (top right)
- Title: H3
- Content: Body text + form fields
- Footer: Primary + secondary buttons
- Keyboard: Esc to close, Tab to navigate, Enter to submit
- Animation: Fade in 200ms

**Tooltip:**
- Text on hover/focus
- Arrow pointing to trigger
- Dark bg (#333), white text
- 12px font size
- Padding: 8px 12px
- Max width: 200px
- Position: Top/bottom/left/right (auto)

**Loading State:**
- Spinner: Blue rotating circle (32px)
- Loading text: "Loading..." or specific text
- Skeleton screens: Gray placeholder bars (match content height)
- Progress bar: Blue bar (indeterminate or determinate)

**Empty State:**
- Large icon (64px, gray)
- Heading: "No [items]"
- Description: Helpful text
- CTA button (if applicable)
- Illustration (optional)

### Data Display

**Tables:**
- Header: Gray bg (#F3F4F6), bold text, border-bottom
- Rows: White bg, border-bottom
- Hover: Light gray bg
- Alternating: Optional striped rows
- Padding: 16px per cell
- Sortable headers: Arrow indicator (↑ or ↓)
- Sticky header: Stays at top when scrolling

**Cards:**
- White bg, 12px radius
- Padding: 24px
- Border: 1px light gray
- Hover: Shadow effect, lift
- Clickable cards: Cursor pointer
- Image: Fills top (no padding)
- Title: H4, 20px
- Description: Body text
- Footer: Actions or tags

**Lists:**
- Item: 16px padding, border-bottom
- Hover: Light gray bg
- Clickable: Cursor pointer
- Icon + text + action (trailing)

**Pagination:**
- Previous/Next buttons (disabled if at start/end)
- Page numbers: "1 2 3 ... 10"
- Current page: Bold or highlighted
- Jump to page: Input field
- Results count: "Showing 1-20 of 100"

### Badges & Tags

**Badge:**
- Background color (varies by type)
- White text
- Padding: 4px 12px
- Border radius: 16px
- Types: Default (gray), Primary (blue), Success (green), Warning (orange), Error (red)
- Variants: Solid (fill) or Outline (border only)

**Tag/Chip:**
- Similar to badge
- Removable: X button on right
- Editable: Click to edit inline

---

## MOBILE RESPONSIVENESS

### Breakpoints
- Mobile: 0-640px
- Tablet: 641-1024px
- Desktop: 1025px+

### Mobile Patterns
- Single column layout (no sidebars)
- Hamburger menu (collapsible sidebar)
- Bottom tab navigation (for main sections)
- Full-width cards, buttons, inputs
- Touch targets: 44px minimum
- Thumb-friendly: Important buttons in thumb zone (bottom center)
- Large font: 16px+ for inputs (prevents zoom on iOS)
- Swipe gestures: Swipe back/forward (optional)

### Tablet
- 2-column layout (sidebar + content)
- Medium cards, smaller padding
- Optimized touch targets

### Desktop
- Full multi-column layout
- Sidebars, modals, dropdowns
- Fine-grained controls
- Hover states

---

## ACCESSIBILITY (WCAG 2.1 AA)

### Semantic HTML
- Proper heading hierarchy (h1, h2, h3, etc.)
- Form labels with `for` attributes
- Buttons vs links (click vs navigate)
- Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`
- Alt text for all images
- Aria labels for icons

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close modals
- Arrow keys in dropdowns, sliders
- Focus indicator: Visible (2px blue outline)

### Color & Contrast
- Text contrast: 4.5:1 minimum (normal text)
- UI contrast: 3:1 minimum (borders, icons)
- Color not only indicator (use text, icons, patterns too)
- Don't rely on color alone for status

### Focus Management
- Focus visible on all interactive elements
- Logical tab order (left-to-right, top-to-bottom)
- Skip links (skip to main content)
- Focus trap in modals (tab stays inside)

### ARIA Labels
- Buttons with icons only: `aria-label="Close"`
- Dropdowns: `aria-expanded`, `aria-haspopup`
- Modals: `role="dialog"`, `aria-labelledby`, `aria-modal="true"`
- Live regions: `aria-live="polite"` for status updates
- Images: `alt=""` for decorative, `alt="description"` for content

---

## STATES & INTERACTIONS

### Button States
- Default: Blue bg, white text, 8px shadow
- Hover: Dark blue bg, larger shadow
- Active/Pressed: Darker blue, no shadow
- Disabled: Gray bg, opacity 0.5, cursor not-allowed
- Loading: Spinner inside, disabled
- Focus: Blue outline (2px)

### Input States
- Default: Light gray bg, gray border
- Focus: Blue border, blue shadow
- Hover: Slightly darker border
- Valid: Green checkmark, no error message
- Invalid: Red border, red text below
- Disabled: Gray bg, strikethrough text
- Loading: Spinner inside (on search)

### Link States
- Default: Blue text, no underline
- Hover: Darker blue, underline
- Active/Visited: Purple text (optional)
- Focus: Blue outline
- Disabled: Gray text, cursor not-allowed

### Transitions & Animations
- Button hover: 150ms ease-in-out
- Modal open: 200ms fade-in
- Sidebar slide: 300ms ease-in-out
- Dropdown open: 150ms scale + fade
- Loading spinner: Continuous rotation (1s per rotation)
- Toast slide-in: 300ms ease-out

---

## ERROR HANDLING & VALIDATION

### Form Validation
- Real-time validation (as user types)
- On-blur validation (when leaving field)
- On-submit validation (prevent invalid submission)
- Field-level errors: Red border + error message
- Form-level errors: Alert box at top
- Required fields: Red asterisk + required indicator

### Error Messages
- Clear, user-friendly language
- Specific (not "Invalid input", but "Email must be valid format")
- Constructive (suggest fix)
- Position: Below field, left-aligned, red text
- Icon: Small error icon (red !)

### HTTP Error Handling
- 400: "Bad request - Please check your input"
- 401: "Unauthorized - Please log in again"
- 403: "Forbidden - You don't have access"
- 404: "Not found - Page doesn't exist" (navigate to 404 page)
- 500: "Server error - Please try again later" (navigate to 500 page)
- Network error: "Network error - Check your connection"
- Timeout: "Request timeout - Please try again"

### Loading States
- Skeleton screens: Show content layout with gray placeholders
- Spinners: While loading
- Progress bars: Indeterminate during upload/long operation
- Disabled interactions: Don't allow clicks while loading

---

## BACKEND API INTEGRATION

### All Pages Must Connect To:

**Authentication:**
- POST /api/v1/auth/login
- POST /api/v1/candidates/register
- POST /api/v1/auth/register (recruiter)
- POST /api/v1/auth/forgot-password
- POST /api/v1/auth/reset-password
- POST /api/v1/auth/verify-email

**Jobs:**
- GET /api/v1/jobs
- GET /api/v1/jobs/:id
- POST /api/v1/jobs (recruiter)
- PUT /api/v1/jobs/:id (recruiter)
- DELETE /api/v1/jobs/:id (recruiter)

**Applications:**
- GET /api/v1/applications
- GET /api/v1/applications/:id
- POST /api/v1/applications (candidate)
- PUT /api/v1/applications/:id/status

**Screening:**
- POST /api/v1/screening/start
- POST /api/v1/screening/message
- POST /api/v1/screening/end
- GET /api/v1/screening/:id

**Scoring:**
- POST /api/v1/scoring/calculate
- GET /api/v1/scoring/decision/:applicationId

**Dashboard:**
- GET /api/v1/dashboard/stats
- GET /api/v1/dashboard/applications
- GET /api/v1/dashboard/pipeline
- GET /api/v1/dashboard/screening-progress

**Candidates:**
- GET /api/v1/candidates/:id
- PUT /api/v1/candidates/:id

**Profile & Settings:**
- GET /api/v1/profile
- PUT /api/v1/profile
- POST /api/v1/notifications
- GET /api/v1/notifications

**Team (Recruiter):**
- GET /api/v1/organizations/:id/team
- POST /api/v1/organizations/:id/team/invite
- PUT /api/v1/organizations/:id/team/:userId

---

## PERFORMANCE & OPTIMIZATION

- Lazy load images (load on viewport entry)
- Code splitting: Separate chunks per page
- Minify CSS/JS
- Gzip compression
- Debounce search input (300ms)
- Throttle scroll events
- Cache static assets
- Optimize bundle size (<100KB gzipped per page)

---

## OUTPUT REQUIREMENTS

**Deliver:**
1. Complete React/TypeScript application
2. All 28 pages as separate components
3. Tailwind CSS (or inline styles if preferred)
4. Vite + React 19 setup
5. File structure:
   ```
   src/
   ├── components/
   │   ├── layout/
   │   │   ├── Header.tsx
   │   │   ├── Footer.tsx
   │   │   ├── Sidebar.tsx
   │   │   └── BottomNav.tsx
   │   ├── auth/
   │   │   ├── LoginPage.tsx
   │   │   ├── RegisterCandidate.tsx
   │   │   ├── RegisterRecruiter.tsx
   │   │   ├── ForgotPassword.tsx
   │   │   └── ResetPassword.tsx
   │   ├── candidate/
   │   │   ├── Dashboard.tsx
   │   │   ├── BrowseJobs.tsx
   │   │   ├── JobDetail.tsx
   │   │   ├── ApplicationDetail.tsx
   │   │   ├── ScreeningTranscript.tsx
   │   │   ├── Profile.tsx
   │   │   ├── Settings.tsx
   │   │   └── Notifications.tsx
   │   ├── recruiter/
   │   │   ├── Dashboard.tsx
   │   │   ├── Applications.tsx
   │   │   ├── ApplicationDetail.tsx
   │   │   ├── ScreeningQueue.tsx
   │   │   ├── Jobs.tsx
   │   │   ├── CreateJob.tsx
   │   │   ├── Reports.tsx
   │   │   ├── Candidates.tsx
   │   │   ├── TeamManagement.tsx
   │   │   └── Settings.tsx
   │   ├── admin/
   │   │   ├── Dashboard.tsx
   │   │   ├── UsersManagement.tsx
   │   │   └── Settings.tsx
   │   ├── shared/
   │   │   ├── HomePage.tsx
   │   │   ├── Help.tsx
   │   │   ├── Error404.tsx
   │   │   ├── Error500.tsx
   │   │   └── Error403.tsx
   │   └── ui/
   │       ├── Button.tsx
   │       ├── Input.tsx
   │       ├── Modal.tsx
   │       ├── Toast.tsx
   │       ├── Card.tsx
   │       ├── Table.tsx
   │       └── ... (other UI components)
   ├── hooks/
   │   ├── useAuth.ts
   │   ├── useFetch.ts
   │   └── useNotification.ts
   ├── lib/
   │   ├── api.ts
   │   ├── validation.ts
   │   ├── auth.ts
   │   └── constants.ts
   ├── types/
   │   └── index.ts
   ├── App.tsx
   ├── main.tsx
   └── index.css
   ```
6. All files standalone + importable
7. No external API calls hardcoded (use env variables)
8. Error boundaries for each major section
9. Loading states on all async operations
10. Toast notifications for user feedback
11. Form validation on all inputs
12. Keyboard navigation support
13. Mobile-responsive all pages
14. Accessibility (WCAG 2.1 AA)

---

## CRITICAL REQUIREMENTS

### MANDATORY
✅ All 28 pages built
✅ Professional design (not basic)
✅ Responsive (mobile-first)
✅ Complete form validation
✅ Error handling & loading states
✅ Empty states for all lists
✅ Charts & visualizations (dashboard)
✅ Modal dialogs for confirmations
✅ Toast notifications
✅ ARIA labels & semantic HTML
✅ Color-coded status badges
✅ Progress bars & indicators
✅ Pagination on large lists
✅ Bulk actions on tables
✅ Search & filtering
✅ Sorting on tables
✅ Keyboard navigation
✅ Focus indicators
✅ Performance optimized
✅ No hardcoded API URLs
✅ Environment variables for config

### DO NOT
❌ Skip any pages
❌ Use placeholder designs
❌ Ignore mobile optimization
❌ Hardcode API endpoints
❌ Miss accessibility features
❌ Skip error handling
❌ Ignore loading states
❌ Use basic boring styling
❌ Miss responsive design
❌ Skip form validation

---

## FINAL CHECKLIST

Before delivery, verify:

- [ ] All 28 pages generated and complete
- [ ] Consistent branding (logo, colors, typography)
- [ ] All forms have validation
- [ ] All async operations show loading states
- [ ] All lists have empty states
- [ ] All errors handled gracefully
- [ ] Charts & visualizations on dashboards
- [ ] Modals for confirmations
- [ ] Toast notifications for feedback
- [ ] Mobile responsive (375px, 768px, 1440px)
- [ ] Touch-friendly buttons (44px minimum)
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast passes WCAG AA
- [ ] ARIA labels on all icons
- [ ] Semantic HTML structure
- [ ] No console errors
- [ ] No broken links
- [ ] Professional appearance
- [ ] Code is clean and commented
- [ ] Ready for React integration

---

## BEGIN GENERATION

Generate **ALL 28 COMPLETE PAGES** now.

For each page:
1. Complete, production-grade component
2. All form fields with validation
3. All buttons interactive
4. All states (loading, error, empty, success)
5. Mobile responsive
6. Accessibility features
7. Professional styling
8. Ready to integrate with backend APIs

Provide as:
- React/TypeScript components (preferred) OR
- Complete HTML files (can convert to React)

**START NOW**

