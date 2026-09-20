-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'OPERASIONAL');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('WARGA', 'PENGURUS');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('MENUNGGU_VERIFIKASI', 'AKTIF', 'NONAKTIF');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password_hash" TEXT,
    "role" "UserRole",
    "account_type" "AccountType" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'MENUNGGU_VERIFIKASI',
    "address" TEXT,
    "phone_verified_at" TIMESTAMP(3),
    "email_verified_at" TIMESTAMP(3),
    "password_set_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_account_type_idx" ON "users"("account_type");

