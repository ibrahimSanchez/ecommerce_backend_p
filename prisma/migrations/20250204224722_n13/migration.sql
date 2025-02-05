/*
  Warnings:

  - A unique constraint covering the columns `[reset_password_token]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `activation_token` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "reset_password_token" UUID,
DROP COLUMN "activation_token",
ADD COLUMN     "activation_token" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_activation_token_key" ON "User"("activation_token");

-- CreateIndex
CREATE UNIQUE INDEX "User_reset_password_token_key" ON "User"("reset_password_token");
