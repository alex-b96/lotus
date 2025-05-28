-- AlterTable
ALTER TABLE "poems" ALTER COLUMN "published_at" DROP NOT NULL,
ALTER COLUMN "published_at" DROP DEFAULT,
ALTER COLUMN "status" SET DEFAULT 'review';
