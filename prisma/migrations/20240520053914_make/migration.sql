/*
  Warnings:

  - A unique constraint covering the columns `[buildingName]` on the table `Buildings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Buildings_buildingName_key" ON "Buildings"("buildingName");
