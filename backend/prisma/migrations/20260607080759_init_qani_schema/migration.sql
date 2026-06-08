/*
  Warnings:

  - You are about to drop the column `atsReferenceId` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `currentStep` on the `screening_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `expiredAt` on the `screening_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `sessionToken` on the `screening_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `screening_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `screening_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `candidate_answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `candidate_scores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `candidates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `communication_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organisations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `question_bank` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_requirements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `routing_decisions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scoring_rules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_organisationId_fkey";

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_roleId_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_organisationId_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "candidate_answers" DROP CONSTRAINT "candidate_answers_screeningSessionId_fkey";

-- DropForeignKey
ALTER TABLE "candidate_scores" DROP CONSTRAINT "candidate_scores_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "candidate_scores" DROP CONSTRAINT "candidate_scores_requirementId_fkey";

-- DropForeignKey
ALTER TABLE "candidates" DROP CONSTRAINT "candidates_organisationId_fkey";

-- DropForeignKey
ALTER TABLE "communication_logs" DROP CONSTRAINT "communication_logs_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "role_requirements" DROP CONSTRAINT "role_requirements_roleId_fkey";

-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_organisationId_fkey";

-- DropForeignKey
ALTER TABLE "routing_decisions" DROP CONSTRAINT "routing_decisions_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "scoring_rules" DROP CONSTRAINT "scoring_rules_requirementId_fkey";

-- DropForeignKey
ALTER TABLE "scoring_rules" DROP CONSTRAINT "scoring_rules_roleId_fkey";

-- DropForeignKey
ALTER TABLE "screening_sessions" DROP CONSTRAINT "screening_sessions_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_organisationId_fkey";

-- DropIndex
DROP INDEX "applications_candidateId_idx";

-- DropIndex
DROP INDEX "applications_organisationId_idx";

-- DropIndex
DROP INDEX "applications_roleId_idx";

-- DropIndex
DROP INDEX "applications_status_idx";

-- DropIndex
DROP INDEX "screening_sessions_applicationId_idx";

-- DropIndex
DROP INDEX "screening_sessions_applicationId_key";

-- DropIndex
DROP INDEX "screening_sessions_sessionToken_key";

-- DropIndex
DROP INDEX "users_organisationId_idx";

-- AlterTable
ALTER TABLE "applications" DROP COLUMN "atsReferenceId",
DROP COLUMN "createdAt",
DROP COLUMN "organisationId",
DROP COLUMN "roleId",
DROP COLUMN "source",
ADD COLUMN     "aiFeedback" TEXT,
ADD COLUMN     "aiScore" INTEGER,
ADD COLUMN     "appliedDate" TIMESTAMP(3),
ADD COLUMN     "candidateEmail" TEXT,
ADD COLUMN     "candidateName" TEXT,
ADD COLUMN     "company" TEXT,
ADD COLUMN     "cvUrl" TEXT,
ADD COLUMN     "interviewDateTime" TIMESTAMP(3),
ADD COLUMN     "jobId" TEXT,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "notes" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "recruiterNotes" TEXT,
ADD COLUMN     "scoreBreakdown" JSONB,
ADD COLUMN     "scorecard" JSONB,
ADD COLUMN     "screeningCompletedAt" TIMESTAMP(3),
ADD COLUMN     "screeningSessionId" TEXT,
ADD COLUMN     "screeningStartedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "screening_sessions" DROP COLUMN "currentStep",
DROP COLUMN "expiredAt",
DROP COLUMN "sessionToken",
DROP COLUMN "startedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "currentQuestionIdx" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "decision" TEXT,
ADD COLUMN     "jobData" JSONB,
ADD COLUMN     "mandatoryCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "messages" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "score" INTEGER,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "totalQuestions" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "organisationId",
DROP COLUMN "status",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "suspended" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "audit_logs";

-- DropTable
DROP TABLE "candidate_answers";

-- DropTable
DROP TABLE "candidate_scores";

-- DropTable
DROP TABLE "candidates";

-- DropTable
DROP TABLE "communication_logs";

-- DropTable
DROP TABLE "organisations";

-- DropTable
DROP TABLE "question_bank";

-- DropTable
DROP TABLE "role_requirements";

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "routing_decisions";

-- DropTable
DROP TABLE "scoring_rules";

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "recruiterId" TEXT,
    "company" TEXT,
    "title" TEXT NOT NULL,
    "department" TEXT,
    "category" TEXT,
    "location" TEXT NOT NULL,
    "employmentType" TEXT[],
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "description" TEXT,
    "requirementsMust" TEXT[],
    "requirementsNice" TEXT[],
    "skillsRequired" TEXT[],
    "experienceLevel" TEXT,
    "experienceYearsMin" INTEGER,
    "experienceYearsMax" INTEGER,
    "screeningQuestions" TEXT[],
    "mandatoryQuestions" JSONB NOT NULL DEFAULT '{}',
    "qualificationWeights" JSONB,
    "status" TEXT NOT NULL DEFAULT 'open',
    "expiresAt" TIMESTAMP(3),
    "postedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT,
    "recipientEmail" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "relatedJobId" TEXT,
    "relatedApplicationId" TEXT,
    "interviewDateTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "skills" TEXT[],
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "cvUrl" TEXT,
    "cvFilename" TEXT,
    "workRights" TEXT,
    "salaryExpectation" INTEGER,
    "availableFrom" TIMESTAMP(3),
    "phone" TEXT,
    "location" TEXT,
    "profilePhotoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidate_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "invitedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidate_profiles_userId_key" ON "candidate_profiles"("userId");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screening_sessions" ADD CONSTRAINT "screening_sessions_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
