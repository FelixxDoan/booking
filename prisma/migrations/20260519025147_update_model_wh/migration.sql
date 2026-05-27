/*
  Warnings:

  - A unique constraint covering the columns `[weekday]` on the table `WorkingHours` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "WorkingHours_weekday_isActive_idx";

-- DropIndex
DROP INDEX "WorkingHours_weekday_startTime_endTime_key";

-- CreateIndex
CREATE UNIQUE INDEX "WorkingHours_weekday_key" ON "WorkingHours"("weekday");
