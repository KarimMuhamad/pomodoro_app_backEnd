/*
  Warnings:

  - You are about to drop the column `isDefault` on the `label` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "label" DROP COLUMN "isDefault",
ADD COLUMN     "id_default" BOOLEAN NOT NULL DEFAULT false;
