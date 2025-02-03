/*
  Warnings:

  - A unique constraint covering the columns `[activation_token]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activation_token` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activation_token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_activation_token_key" ON "User"("activation_token");
