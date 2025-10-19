/*
  Warnings:

  - Added the required column `dueDate` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "TaskStatus" ADD VALUE 'BLOCKED';

-- DropIndex
DROP INDEX "Project_workspaceId_key";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Project_workspaceId_idx" ON "Project"("workspaceId");
