-- AlterTable
ALTER TABLE "users" ADD COLUMN     "passwordHistory" TEXT[] DEFAULT ARRAY[]::TEXT[];
