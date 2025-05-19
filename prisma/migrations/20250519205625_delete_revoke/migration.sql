/*
  Warnings:

  - You are about to drop the column `revoked` on the `refresh_token` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "refresh_token" DROP COLUMN "revoked";
