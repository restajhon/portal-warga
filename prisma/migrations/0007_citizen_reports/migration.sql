CREATE TYPE "CitizenReportType" AS ENUM ('LAPORAN', 'KELUHAN', 'ASPIRASI', 'BANTUAN');
CREATE TYPE "CitizenReportStatus" AS ENUM ('TERKIRIM', 'DITINJAU', 'DIPROSES', 'SELESAI', 'TIDAK_DAPAT_DIPROSES');

CREATE TABLE "citizen_reports" (
  "id" UUID NOT NULL, "reporter_id" UUID NOT NULL, "type" "CitizenReportType" NOT NULL,
  "title" TEXT NOT NULL, "body" TEXT NOT NULL, "status" "CitizenReportStatus" NOT NULL DEFAULT 'TERKIRIM',
  "resolved_at" TIMESTAMP(3), "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "citizen_reports_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "citizen_reports_status_created_at_idx" ON "citizen_reports"("status", "created_at");
CREATE INDEX "citizen_reports_reporter_id_created_at_idx" ON "citizen_reports"("reporter_id", "created_at");
CREATE INDEX "citizen_reports_type_status_idx" ON "citizen_reports"("type", "status");
ALTER TABLE "citizen_reports" ADD CONSTRAINT "citizen_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "citizen_report_responses" (
  "id" UUID NOT NULL, "report_id" UUID NOT NULL, "responder_id" UUID NOT NULL,
  "body" TEXT NOT NULL, "status_after" "CitizenReportStatus",
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "citizen_report_responses_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "citizen_report_responses_report_id_created_at_idx" ON "citizen_report_responses"("report_id", "created_at");
CREATE INDEX "citizen_report_responses_responder_id_idx" ON "citizen_report_responses"("responder_id");
ALTER TABLE "citizen_report_responses" ADD CONSTRAINT "citizen_report_responses_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "citizen_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "citizen_report_responses" ADD CONSTRAINT "citizen_report_responses_responder_id_fkey" FOREIGN KEY ("responder_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
