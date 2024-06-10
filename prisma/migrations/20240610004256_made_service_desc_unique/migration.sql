/*
  Warnings:

  - You are about to drop the column `buildingLetterId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `companyAddressInvoice` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `companyNameInvoice` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `customerAddress` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `Invoice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serviceDescription]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "buildingLetterId",
DROP COLUMN "companyAddressInvoice",
DROP COLUMN "companyNameInvoice",
DROP COLUMN "customerAddress",
DROP COLUMN "customerName";

-- CreateIndex
CREATE UNIQUE INDEX "Service_serviceDescription_key" ON "Service"("serviceDescription");
