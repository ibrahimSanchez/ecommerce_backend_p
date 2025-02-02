/*
  Warnings:

  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - Added the required column `discountedPrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviews` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "description",
ADD COLUMN     "discountedPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "reviews" INTEGER NOT NULL;
