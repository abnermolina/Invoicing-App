/*
  Warnings:

  - Added the required column `companyId` to the `Buildings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyLogo` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Buildings" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "companyLogo" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Buildings" ADD CONSTRAINT "Buildings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
