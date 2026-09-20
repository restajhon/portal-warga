-- Add optional image references for resident-facing community content.
ALTER TABLE "contents" ADD COLUMN "image_url" TEXT;
ALTER TABLE "agendas" ADD COLUMN "image_url" TEXT;
ALTER TABLE "program_updates" ADD COLUMN "image_url" TEXT;
