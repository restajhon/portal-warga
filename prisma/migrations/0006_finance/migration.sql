CREATE TYPE "TransactionType" AS ENUM ('PEMASUKAN', 'PENGELUARAN');
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'TRANSFER');
CREATE TYPE "FinanceReportStatus" AS ENUM ('DRAFT', 'MENUNGGU_APPROVAL', 'DISETUJUI', 'DIPUBLIKASIKAN');

CREATE TABLE "finance_transactions" (
  "id" UUID NOT NULL, "author_id" UUID NOT NULL, "type" "TransactionType" NOT NULL,
  "payment_method" "PaymentMethod" NOT NULL, "category" TEXT NOT NULL, "description" TEXT NOT NULL,
  "amount" DECIMAL(14,2) NOT NULL, "occurred_at" TIMESTAMP(3) NOT NULL, "evidence_url" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "finance_transactions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "finance_transactions_occurred_at_idx" ON "finance_transactions"("occurred_at");
CREATE INDEX "finance_transactions_type_occurred_at_idx" ON "finance_transactions"("type", "occurred_at");
ALTER TABLE "finance_transactions" ADD CONSTRAINT "finance_transactions_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "finance_reports" (
  "id" UUID NOT NULL, "author_id" UUID NOT NULL, "period_start" TIMESTAMP(3) NOT NULL,
  "period_end" TIMESTAMP(3) NOT NULL, "title" TEXT NOT NULL, "summary" TEXT,
  "status" "FinanceReportStatus" NOT NULL DEFAULT 'DRAFT', "approved_at" TIMESTAMP(3), "published_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "finance_reports_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "finance_reports_status_period_start_period_end_idx" ON "finance_reports"("status", "period_start", "period_end");
ALTER TABLE "finance_reports" ADD CONSTRAINT "finance_reports_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
