-- DropForeignKey
ALTER TABLE "pomodoro_session" DROP CONSTRAINT "pomodoro_session_label_id_fkey";

-- AddForeignKey
ALTER TABLE "pomodoro_session" ADD CONSTRAINT "pomodoro_session_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "label"("id") ON DELETE CASCADE ON UPDATE CASCADE;
