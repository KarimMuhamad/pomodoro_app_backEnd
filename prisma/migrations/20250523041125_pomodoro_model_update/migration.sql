-- DropForeignKey
ALTER TABLE "pomodoro_session" DROP CONSTRAINT "pomodoro_session_label_id_fkey";

-- AlterTable
ALTER TABLE "pomodoro_session" ALTER COLUMN "start_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "end_time" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "pomodoro_session" ADD CONSTRAINT "pomodoro_session_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "label"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
