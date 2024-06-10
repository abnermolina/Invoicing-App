/*
  Warnings:

  - You are about to drop the column `serviceDescription` on the `Service` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serviceName]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serviceName` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Service_serviceDescription_key";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "serviceDescription" TEXT;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "serviceDescription",
ADD COLUMN     "serviceName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Service_serviceName_key" ON "Service"("serviceName");
