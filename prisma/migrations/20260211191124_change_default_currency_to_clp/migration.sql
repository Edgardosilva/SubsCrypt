-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "currency" SET DEFAULT 'CLP';

-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "currency" SET DEFAULT 'CLP';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "currency" SET DEFAULT 'CLP';
