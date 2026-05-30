-- CreateTable
CREATE TABLE "organisations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "industry" TEXT,
    "subscriptionPlan" TEXT NOT NULL DEFAULT 'basic',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organisations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "salaryMin" DECIMAL(10,2),
    "salaryMax" DECIMAL(10,2),
    "employmentType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "jdFileUrl" TEXT,
    "jdFileContent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_requirements" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "requirementName" TEXT NOT NULL,
    "requirementType" TEXT NOT NULL,
    "mandatory" BOOLEAN NOT NULL DEFAULT false,
    "weight" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "minValue" TEXT,
    "maxValue" TEXT,
    "acceptableValues" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidates" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "suburb" TEXT,
    "postcode" TEXT,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'applied',
    "atsReferenceId" TEXT,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screening_sessions" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "sessionToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "screening_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_answers" (
    "id" TEXT NOT NULL,
    "screeningSessionId" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "questionText" TEXT,
    "rawAnswer" TEXT,
    "structuredAnswer" JSONB,
    "confidenceScore" DECIMAL(3,2),
    "qualificationArea" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidate_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scoring_rules" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "requirementId" TEXT,
    "ruleType" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" TEXT,
    "scoreValue" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "failAction" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scoring_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_scores" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "requirementId" TEXT,
    "qualificationArea" TEXT,
    "rawScore" DECIMAL(5,2) NOT NULL,
    "weightedScore" DECIMAL(5,2) NOT NULL,
    "weight" DECIMAL(3,2) NOT NULL,
    "status" TEXT NOT NULL,
    "evaluationLogic" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidate_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routing_decisions" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "overallScore" DECIMAL(5,2) NOT NULL,
    "reasonSummary" TEXT,
    "decisionData" JSONB,
    "recruiterOverride" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routing_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communication_logs" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "templateId" TEXT,
    "sentTo" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT,
    "status" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "communication_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "userId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "actionType" TEXT NOT NULL,
    "oldData" JSONB,
    "newData" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_bank" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT,
    "questionKey" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "qualificationArea" TEXT,
    "category" TEXT,
    "options" JSONB,
    "helpText" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_bank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_organisationId_idx" ON "users"("organisationId");

-- CreateIndex
CREATE INDEX "roles_organisationId_idx" ON "roles"("organisationId");

-- CreateIndex
CREATE INDEX "roles_status_idx" ON "roles"("status");

-- CreateIndex
CREATE INDEX "role_requirements_roleId_idx" ON "role_requirements"("roleId");

-- CreateIndex
CREATE INDEX "candidates_organisationId_idx" ON "candidates"("organisationId");

-- CreateIndex
CREATE INDEX "candidates_email_idx" ON "candidates"("email");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_organisationId_email_key" ON "candidates"("organisationId", "email");

-- CreateIndex
CREATE INDEX "applications_organisationId_idx" ON "applications"("organisationId");

-- CreateIndex
CREATE INDEX "applications_candidateId_idx" ON "applications"("candidateId");

-- CreateIndex
CREATE INDEX "applications_roleId_idx" ON "applications"("roleId");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "screening_sessions_applicationId_key" ON "screening_sessions"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "screening_sessions_sessionToken_key" ON "screening_sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "screening_sessions_applicationId_idx" ON "screening_sessions"("applicationId");

-- CreateIndex
CREATE INDEX "candidate_answers_screeningSessionId_idx" ON "candidate_answers"("screeningSessionId");

-- CreateIndex
CREATE INDEX "scoring_rules_roleId_idx" ON "scoring_rules"("roleId");

-- CreateIndex
CREATE INDEX "candidate_scores_applicationId_idx" ON "candidate_scores"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "routing_decisions_applicationId_key" ON "routing_decisions"("applicationId");

-- CreateIndex
CREATE INDEX "routing_decisions_applicationId_idx" ON "routing_decisions"("applicationId");

-- CreateIndex
CREATE INDEX "communication_logs_applicationId_idx" ON "communication_logs"("applicationId");

-- CreateIndex
CREATE INDEX "audit_logs_organisationId_idx" ON "audit_logs"("organisationId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "question_bank_questionKey_key" ON "question_bank"("questionKey");

-- CreateIndex
CREATE INDEX "question_bank_questionKey_idx" ON "question_bank"("questionKey");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_requirements" ADD CONSTRAINT "role_requirements_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screening_sessions" ADD CONSTRAINT "screening_sessions_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_answers" ADD CONSTRAINT "candidate_answers_screeningSessionId_fkey" FOREIGN KEY ("screeningSessionId") REFERENCES "screening_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scoring_rules" ADD CONSTRAINT "scoring_rules_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scoring_rules" ADD CONSTRAINT "scoring_rules_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "role_requirements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_scores" ADD CONSTRAINT "candidate_scores_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_scores" ADD CONSTRAINT "candidate_scores_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "role_requirements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routing_decisions" ADD CONSTRAINT "routing_decisions_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communication_logs" ADD CONSTRAINT "communication_logs_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
