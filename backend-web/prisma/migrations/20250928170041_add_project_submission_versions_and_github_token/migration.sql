-- AlterTable
ALTER TABLE "public"."project_submissions" ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "gitRepositoryUrl" TEXT,
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "githubToken" TEXT;

-- CreateTable
CREATE TABLE "public"."project_submission_versions" (
    "id" SERIAL NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "fileUrl" TEXT,
    "gitCommitHash" TEXT,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submissionId" INTEGER NOT NULL,

    CONSTRAINT "project_submission_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_submission_versions_submissionId_versionNumber_key" ON "public"."project_submission_versions"("submissionId", "versionNumber");

-- AddForeignKey
ALTER TABLE "public"."project_submission_versions" ADD CONSTRAINT "project_submission_versions_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "public"."project_submissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
