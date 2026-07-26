-- AlterTable
ALTER TABLE "candidate_profiles" ADD COLUMN     "notifyJobs" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyScreening" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "profileVisible" BOOLEAN NOT NULL DEFAULT true;
