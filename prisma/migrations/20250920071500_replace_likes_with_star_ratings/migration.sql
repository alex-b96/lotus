/*
  Warnings:

  - You are about to drop the column `category` on the `poems` table. All the data in the column will be lost.
  - You are about to drop the `likes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_poem_id_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_user_id_fkey";

-- AlterTable
ALTER TABLE "poems" DROP COLUMN "category",
ADD COLUMN     "average_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "rating_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "reset_token" VARCHAR(255),
ADD COLUMN     "reset_token_expiry" TIMESTAMPTZ(6);

-- DropTable
DROP TABLE "likes";

-- CreateTable
CREATE TABLE "star_ratings" (
    "user_id" TEXT NOT NULL,
    "poem_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "star_ratings_pkey" PRIMARY KEY ("user_id","poem_id")
);

-- AddForeignKey
ALTER TABLE "star_ratings" ADD CONSTRAINT "star_ratings_poem_id_fkey" FOREIGN KEY ("poem_id") REFERENCES "poems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "star_ratings" ADD CONSTRAINT "star_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;