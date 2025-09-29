-- CreateEnum
CREATE TYPE "public"."ReviewStatus" AS ENUM ('PENDING', 'REVIEWED');

-- AlterTable
ALTER TABLE "public"."project_submissions" ADD COLUMN     "reviewStatus" "public"."ReviewStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "public"."submission_comments" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "submission_comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."submission_comments" ADD CONSTRAINT "submission_comments_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "public"."project_submissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."submission_comments" ADD CONSTRAINT "submission_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."submission_comments" ADD CONSTRAINT "submission_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."submission_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
