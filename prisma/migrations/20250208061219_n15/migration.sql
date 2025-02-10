/*
  Warnings:

  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roleId",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user_role';

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_fkey" FOREIGN KEY ("role") REFERENCES "Role"("role") ON DELETE RESTRICT ON UPDATE CASCADE;
