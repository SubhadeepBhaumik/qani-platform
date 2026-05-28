# QANI LOCAL DEVELOPMENT SETUP GUIDE

## Complete Instructions for Developer
**Version 1.0 | Date: May 27, 2026**

---

## PREREQUISITES

Before starting, ensure you have:

1. **Node.js 18 LTS** - Download from https://nodejs.org/
   ```bash
   node --version  # Should show v18.x.x
   npm --version   # Should show 9.x.x or higher
   ```

2. **PostgreSQL 15** - Download from https://www.postgresql.org/download/
   ```bash
   psql --version  # Should show psql 15.x
   ```

3. **Git** - Download from https://git-scm.com/
   ```bash
   git --version   # Should show git 2.x.x
   ```

4. **Docker** (Optional but recommended)
   ```bash
   docker --version  # Should show 20.x.x or higher
   ```

5. **Code Editor: VS Code** with Cursor installed
   - https://code.visualstudio.com/
   - Install Cursor extension

---

## STEP 1: CREATE PROJECT DIRECTORY

```bash
mkdir ~/projects
cd ~/projects
mkdir qani-platform
cd qani-platform
```

---

## STEP 2: CLONE GITHUB REPOSITORY

```bash
git clone [GITHUB_REPO_URL] .
cd qani-platform
```

---

## STEP 3: INSTALL NODE DEPENDENCIES

### Backend Dependencies

```bash
cd backend
npm install
```

**Packages installed:**
- express
- typescript
- prisma
- @prisma/client
- dotenv
- bcryptjs
- jsonwebtoken
- openai
- @sendgrid/mail
- cors
- helmet
- morgan
- zod
- axios

### Frontend Dependencies

```bash
cd ../frontend
npm install
```

**Packages installed:**
- next
- react
- typescript
- tailwindcss
- redux
- react-hook-form
- axios
- zustand

---

## STEP 4: SETUP POSTGRESQL DATABASE

### Option A: Using PostgreSQL Locally

```bash
# Create database
createdb qani_development

# Create user
createuser qani_user
psql -U postgres -c "ALTER USER qani_user WITH PASSWORD 'qani_password_dev';"

# Grant privileges
psql -U postgres -d qani_development -c "GRANT ALL PRIVILEGES ON DATABASE qani_development TO qani_user;"
```

### Option B: Using Docker (Recommended)

```bash
# Run PostgreSQL in Docker
docker run --name qani-postgres \
  -e POSTGRES_USER=qani_user \
  -e POSTGRES_PASSWORD=qani_password_dev \
  -e POSTGRES_DB=qani_development \
  -p 5432:5432 \
  -d postgres:15

# Verify running
docker ps | grep qani-postgres
```

---

## STEP 5: SETUP ENVIRONMENT FILES

### Backend .env file

Create file: `backend/.env`

```
# Database
DATABASE_URL=postgresql://qani_user:qani_password_dev@localhost:5432/qani_development

# API
API_PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxx-REPLAC-REPLACE-WITH-KEY

# SendGrid
SENDGRID_API_KEY=SG.xxxxx-REPLAC-REPLACE-WITH-KEY
SENDGRID_FROM_EMAIL=noreply@qani.io

# File Storage
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Logging
LOG_LEVEL=debug

# CORS
CORS_ORIGINS=http://localhost:3000

# Twilio/SendGrid (for SMS - optional)
TWILIO_AC-REPLACE-WITH-KEY
```

### Frontend .env.local file

Create file: `frontend/.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=QANI
NEXT_PUBLIC_APP_VERSION=1.0.0
```

---

## STEP 6: INITIALIZE PRISMA & MIGRATE DATABASE

### Generate Prisma Client

```bash
cd backend
npx prisma generate
```

### Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will:
- Create all 14 tables
- Setup relationships
- Create indexes
- Seed initial data (if defined)

### View Database (Optional)

```bash
# Open Prisma Studio
npx prisma studio

# Browser opens: http://localhost:5555
# View and manage data visually
```

---

## STEP 7: START BAC-REPLACE-WITH-KEY

```bash
cd backend
npm run dev
```

**Expected output:**
```
[Nest] 12345  - 05/27/2026, 9:00:00 AM   LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 05/27/2026, 9:00:01 AM   LOG [InstanceLoader] TypeOrmModule dependencies initialized +100ms
[Nest] 12345  - 05/27/2026, 9:00:02 AM   LOG [RouterModule] Routes registered +50ms
Server running on http://localhost:5000
```

**Verify:**
```bash
curl http://localhost:5000/api/v1/health
# Should return: {"status":"ok"}
```

---

## STEP 8: START FRONTEND SERVER

**In a NEW terminal:**

```bash
cd frontend
npm run dev
```

**Expected output:**
```
> qani@1.0.0 dev
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
✓ Compiled /pages/index in 850ms
```

---

## STEP 9: VERIFY BOTH SERVERS RUNNING

**Terminal 1 (Backend):**
```
✓ API running on http://localhost:5000
✓ Database connected
```

**Terminal 2 (Frontend):**
```
✓ Frontend running on http://localhost:3000
```

**Test URLs:**
- Backend Health: http://localhost:5000/api/v1/health
- Frontend: http://localhost:3000
- Prisma Studio: http://localhost:5555 (if running)

---

## STEP 10: OPEN IN CURSOR

1. Open Cursor editor
2. File → Open Folder → Select `qani-platform` folder
3. Terminal in Cursor → `cd backend` and `npm run dev`
4. New Terminal → `cd frontend` and `npm run dev`
5. Start developing!

---

## DEVELOPMENT WORKFLOW

### Making Changes

```bash
# Backend changes
1. Edit files in backend/src
2. Backend auto-reloads (via nodemon)
3. Test via http://localhost:5000/api/v1/...

# Frontend changes
1. Edit files in frontend/app or frontend/components
2. Next.js auto-reloads
3. View at http://localhost:3000
```

### Database Changes

```bash
# If you change schema in backend/prisma/schema.prisma:
cd backend
npx prisma migrate dev --name describe_change
# Creates new migration file
# Applies to database
```

### Testing API

```bash
# Use REST Client in Cursor
# Or use Postman: https://www.postman.com/

# Example: Create user
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "email": "test@qani.io",
  "password": "Test123!",
  "firstName": "Test",
  "lastName": "User"
}
```

---

## COMMON ISSUES & SOLUTIONS

### Issue: "Port 5000 already in use"
```bash
# Kill process using port 5000
lsof -i :5000
kill -9 <PID>

# Or use different port
API_PORT=5001 npm run dev
```

### Issue: "Cannot connect to PostgreSQL"
```bash
# Check if PostgreSQL running
psql -U postgres

# Check connection string in .env
# Format: postgresql://user:password@host:port/database
```

### Issue: "Prisma migrate fails"
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or manually recreate
dropdb qani_development
createdb qani_development
npx prisma migrate dev
```

### Issue: "npm install fails"
```bash
# Clear cache and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: "Port 3000 already in use"
```bash
# Kill process using port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

---

## USEFUL COMMANDS

### Backend

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Prisma commands
npx prisma generate        # Generate Prisma client
npx prisma migrate dev     # Create and apply migration
npx prisma studio         # Open visual database editor
npx prisma db seed        # Seed initial data
```

### Frontend

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

### Git

```bash
# Clone repository
git clone [URL]

# Check status
git status

# Add changes
git add .

# Commit
git commit -m "descriptive message"

# Push to GitHub
git push origin main

# Pull latest
git pull origin main

# Create branch
git checkout -b feature/feature-name

# Switch branch
git checkout main
```

---

## DIRECTORY STRUCTURE

```
qani-platform/
├── backend/
│   ├── src/
│   │   ├── api/           # API routes
│   │   ├── services/      # Business logic
│   │   ├── models/        # Data models
│   │   ├── middleware/    # Express middleware
│   │   └── main.ts        # Entry point
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── migrations/    # Database migrations
│   ├── .env               # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/               # Next.js pages
│   ├── components/        # React components
│   ├── pages/             # Legacy pages (if any)
│   ├── styles/            # CSS files
│   ├── .env.local         # Environment variables
│   ├── package.json
│   └── next.config.js
│
├── .gitignore
├── README.md
└── docker-compose.yml     # Optional Docker setup
```

---

## NEXT STEPS

1. ✅ Complete all 10 steps above
2. ✅ Verify both servers running
3. ✅ Open in Cursor
4. ✅ Make a test change and verify reload
5. ✅ Start developing features
6. ✅ Push changes to GitHub
7. ✅ (Later) Deploy to Vultr

---

## SUPPORT

If stuck:
1. Check .env file variables
2. Check terminal for error messages
3. Clear node_modules and reinstall
4. Reset database if schema issues
5. Check GitHub Issues

---

**Happy Coding!** 🚀
