/*
  Warnings:

  - You are about to alter the column `quantity` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `reviews` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `quantity` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "reviews" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(10,2);
