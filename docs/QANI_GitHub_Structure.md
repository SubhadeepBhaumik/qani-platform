# QANI GitHub Repository Structure

## Complete Directory Layout

```
qani-platform/
│
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml           # Auto-deploy to Vultr on push to main
│   │   ├── test.yml             # Run tests on every push
│   │   └── lint.yml             # Lint code on push
│   └── PULL_REQUEST_TEMPLATE.md # PR template
│
├── backend/
│   ├── src/
│   │   ├── main.ts              # Express app setup
│   │   ├── config/
│   │   │   ├── database.ts       # PostgreSQL connection
│   │   │   ├── env.ts           # Environment variables
│   │   │   └── cors.ts          # CORS configuration
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── jwt.middleware.ts
│   │   │   │
│   │   │   ├── organisations/
│   │   │   │   ├── org.controller.ts
│   │   │   │   ├── org.service.ts
│   │   │   │   └── org.routes.ts
│   │   │   │
│   │   │   ├── roles/
│   │   │   │   ├── role.controller.ts
│   │   │   │   ├── role.service.ts
│   │   │   │   └── role.routes.ts
│   │   │   │
│   │   │   ├── applications/
│   │   │   │   ├── app.controller.ts
│   │   │   │   ├── app.service.ts
│   │   │   │   └── app.routes.ts
│   │   │   │
│   │   │   ├── screening/
│   │   │   │   ├── screening.controller.ts
│   │   │   │   ├── screening.service.ts
│   │   │   │   ├── screening.routes.ts
│   │   │   │   └── ai.service.ts
│   │   │   │
│   │   │   ├── qualifications/
│   │   │   │   ├── qualification.controller.ts
│   │   │   │   ├── scoring.service.ts
│   │   │   │   ├── routing.service.ts
│   │   │   │   └── qualification.routes.ts
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.controller.ts
│   │   │   │   ├── dashboard.service.ts
│   │   │   │   └── dashboard.routes.ts
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── admin.controller.ts
│   │   │       ├── admin.service.ts
│   │   │       └── admin.routes.ts
│   │   │
│   │   ├── services/
│   │   │   ├── email.service.ts      # SendGrid integration
│   │   │   ├── openai.service.ts     # OpenAI integration
│   │   │   ├── file.service.ts       # File upload/storage
│   │   │   └── audit.service.ts      # Audit logging
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   └── logging.middleware.ts
│   │   │
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── application.model.ts
│   │   │   ├── screening.model.ts
│   │   │   └── scoring.model.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.util.ts
│   │   │   ├── hash.util.ts
│   │   │   ├── validators.ts
│   │   │   └── response.util.ts
│   │   │
│   │   └── types/
│   │       ├── index.ts
│   │       ├── user.types.ts
│   │       └── api.types.ts
│   │
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema definition
│   │   ├── seed.ts              # Seed script for initial data
│   │   └── migrations/          # Auto-generated migrations
│   │       └── 001_init/
│   │           └── migration.sql
│   │
│   ├── tests/
│   │   ├── auth.test.ts
│   │   ├── screening.test.ts
│   │   └── scoring.test.ts
│   │
│   ├── uploads/                 # File storage (local)
│   │   ├── resumes/
│   │   ├── certificates/
│   │   └── job_descriptions/
│   │
│   ├── .env                     # Environment variables (DO NOT COMMIT)
│   ├── .env.example             # Template for .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── jest.config.js           # Test configuration
│   ├── Dockerfile               # Docker image definition
│   └── README.md
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── auth/
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   │
│   │   ├── candidate/
│   │   │   ├── layout.tsx
│   │   │   ├── screening/[id]/page.tsx
│   │   │   ├── status/page.tsx
│   │   │   └── thank-you/page.tsx
│   │   │
│   │   ├── recruiter/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── candidates/page.tsx
│   │   │   ├── candidates/[id]/page.tsx
│   │   │   ├── roles/page.tsx
│   │   │   └── settings/page.tsx
│   │   │
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── dashboard/page.tsx
│   │       ├── organisations/page.tsx
│   │       └── users/page.tsx
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── PasswordReset.tsx
│   │   │
│   │   ├── screening/
│   │   │   ├── ScreeningFlow.tsx
│   │   │   ├── QuestionDisplay.tsx
│   │   │   ├── AnswerInput.tsx
│   │   │   ├── IdentityValidator.tsx
│   │   │   └── ProgressBar.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── CandidateCard.tsx
│   │   │   ├── ApplicationList.tsx
│   │   │   ├── ScoreDisplay.tsx
│   │   │   ├── RoutingBadge.tsx
│   │   │   └── ActionButtons.tsx
│   │   │
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   │
│   │   └── layout/
│   │       ├── MainLayout.tsx
│   │       ├── AuthLayout.tsx
│   │       └── AdminLayout.tsx
│   │
│   ├── styles/
│   │   ├── globals.css          # Global styles
│   │   ├── variables.css        # CSS variables
│   │   └── theme.css            # Theme colors
│   │
│   ├── lib/
│   │   ├── api.ts               # API client setup
│   │   ├── auth.ts              # Auth logic
│   │   ├── store.ts             # Redux store
│   │   └── utils.ts             # Helper functions
│   │
│   ├── hooks/
│   │   ├── useAuth.ts           # Auth hook
│   │   ├── useScreening.ts      # Screening hook
│   │   └── useFetch.ts          # Fetch hook
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── api.types.ts
│   │   └── user.types.ts
│   │
│   ├── public/
│   │   ├── images/
│   │   ├── icons/
│   │   └── favicon.ico
│   │
│   ├── .env.local               # Local env (DO NOT COMMIT)
│   ├── .env.local.example       # Template
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── postcss.config.js        # PostCSS config
│   ├── jest.config.js           # Test config
│   ├── Dockerfile
│   └── README.md
│
├── docs/
│   ├── API.md                   # API documentation
│   ├── DATABASE.md              # Database schema docs
│   ├── ARCHITECTURE.md          # System architecture
│   ├── DEPLOYMENT.md            # Deployment guide
│   └── TROUBLESHOOTING.md       # Common issues
│
├── scripts/
│   ├── setup.sh                 # Initial setup script
│   ├── deploy.sh                # Deployment script
│   ├── backup.sh                # Database backup
│   └── migrate.sh               # Database migration
│
├── docker-compose.yml           # Docker compose for local dev
├── .gitignore                   # Git ignore file
├── .dockerignore                # Docker ignore file
├── .env.example                 # Example env variables
├── README.md                    # Project readme
├── CONTRIBUTING.md              # Contribution guidelines
└── LICENSE                      # License file
```

---

## KEY FILES EXPLAINED

### .gitignore
```
node_modules/
dist/
build/
.env
.env.local
*.log
.DS_Store
uploads/
.next/
out/
.prisma/
```

### package.json (Backend)
```json
{
  "name": "qani-backend",
  "version": "1.0.0",
  "description": "QANI Platform Backend",
  "main": "dist/main.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js",
    "test": "jest",
    "lint": "eslint src",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "express": "^4.18.2",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "openai": "^4.0.0",
    "@sendgrid/mail": "^7.7.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "zod": "^3.22.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.20",
    "@types/node": "^20.0.0",
    "typescript": "^5.2.2",
    "nodemon": "^3.0.1",
    "ts-node": "^10.9.1",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.5"
  }
}
```

### package.json (Frontend)
```json
{
  "name": "qani-frontend",
  "version": "1.0.0",
  "description": "QANI Platform Frontend",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.2.2",
    "tailwindcss": "^3.3.0",
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "react-hook-form": "^7.47.0",
    "axios": "^1.5.0",
    "zustand": "^4.4.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.24",
    "@types/node": "^20.0.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.50.0",
    "prettier": "^3.0.3"
  }
}
```

### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### Dockerfile (Frontend)
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: qani_user
      POSTGRES_PASSWORD: qani_password_dev
      POSTGRES_DB: qani_development
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://qani_user:qani_password_dev@postgres:5432/qani_development
      NODE_ENV: development
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000/api/v1
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

---

## GITHUB WORKFLOW FILES

### .github/workflows/deploy.yml
```yaml
name: Deploy to Vultr

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vultr
        run: |
          ssh -i ${{ secrets.VULTR_SSH_KEY }} \
          user@139.180.181.11 \
          'cd /app/qani && git pull origin main && npm install && npm run build && pm2 restart qani'
```

---

This structure ensures:
✅ Clean separation of frontend/backend
✅ Scalable service organization
✅ Type safety throughout
✅ Easy testing
✅ Docker ready
✅ CI/CD ready
✅ Professional standards

