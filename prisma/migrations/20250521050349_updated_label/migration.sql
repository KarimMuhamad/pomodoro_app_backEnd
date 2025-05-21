/*
  Warnings:

  - Added the required column `updated_at` to the `user_preferences` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pomodoro_session" DROP CONSTRAINT "pomodoro_session_label_id_fkey";

-- AlterTable
ALTER TABLE "user_preferences" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "pomodoro_session" ADD CONSTRAINT "pomodoro_session_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "label"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;
