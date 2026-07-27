-- AlterTable
ALTER TABLE "candidate_profiles" ADD COLUMN     "hiddenFromCompanies" TEXT[] DEFAULT ARRAY[]::TEXT[];
