-- EPIC-005: Sickness reports with separated sensitive data (DECISIONS-BASELINE §5).

CREATE TYPE "SicknessReportStatus" AS ENUM ('TERKIRIM', 'DITINJAU', 'DIBANTU', 'SELESAI', 'TIDAK_DAPAT_DIPROSES');
CREATE TYPE "SicknessSeverity" AS ENUM ('RINGAN', 'SEDANG', 'BERAT');

ALTER TABLE "users" ADD COLUMN "verified_by" UUID;
ALTER TABLE "users" ADD CONSTRAINT "users_verified_by_fkey"
  FOREIGN KEY ("verified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "sickness_reports" (
  "id" UUID NOT NULL,
  "reporter_id" UUID NOT NULL,
  "patient_name" TEXT NOT NULL,
  "patient_address" TEXT,
  "patient_rt" TEXT,
  "assistance_need" TEXT NOT NULL,
  "severity" "SicknessSeverity" NOT NULL DEFAULT 'RINGAN',
  "status" "SicknessReportStatus" NOT NULL DEFAULT 'TERKIRIM',
  "resolved_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "sickness_reports_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "sickness_reports_status_created_at_idx" ON "sickness_reports"("status", "created_at");
CREATE INDEX "sickness_reports_reporter_id_created_at_idx" ON "sickness_reports"("reporter_id", "created_at");
CREATE INDEX "sickness_reports_severity_status_idx" ON "sickness_reports"("severity", "status");
ALTER TABLE "sickness_reports"
  ADD CONSTRAINT "sickness_reports_reporter_id_fkey"
  FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "sickness_report_details" (
  "id" UUID NOT NULL,
  "report_id" UUID NOT NULL,
  "symptoms" TEXT NOT NULL,
  "medical_notes" TEXT,
  "contact_phone" TEXT,
  "helper_id" UUID,
  CONSTRAINT "sickness_report_details_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "sickness_report_details_report_id_key" UNIQUE ("report_id")
);
CREATE INDEX "sickness_report_details_report_id_idx" ON "sickness_report_details"("report_id");
ALTER TABLE "sickness_report_details"
  ADD CONSTRAINT "sickness_report_details_report_id_fkey"
  FOREIGN KEY ("report_id") REFERENCES "sickness_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sickness_report_details"
  ADD CONSTRAINT "sickness_report_details_helper_id_fkey"
  FOREIGN KEY ("helper_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "sickness_report_responses" (
  "id" UUID NOT NULL,
  "report_id" UUID NOT NULL,
  "responder_id" UUID NOT NULL,
  "body" TEXT NOT NULL,
  "status_after" "SicknessReportStatus",
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sickness_report_responses_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "sickness_report_responses_report_id_created_at_idx" ON "sickness_report_responses"("report_id", "created_at");
CREATE INDEX "sickness_report_responses_responder_id_idx" ON "sickness_report_responses"("responder_id");
ALTER TABLE "sickness_report_responses"
  ADD CONSTRAINT "sickness_report_responses_report_id_fkey"
  FOREIGN KEY ("report_id") REFERENCES "sickness_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "sickness_report_responses"
  ADD CONSTRAINT "sickness_report_responses_responder_id_fkey"
  FOREIGN KEY ("responder_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
