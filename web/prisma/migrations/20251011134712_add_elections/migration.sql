/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `choice` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Vote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[voterId,electionId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdBy` to the `Election` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Election` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `candidateId` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voterId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Vote_electionId_userId_key";

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "createdAt",
DROP COLUMN "description",
ADD COLUMN     "party" TEXT;

-- AlterTable
ALTER TABLE "Election" ADD COLUMN     "createdBy" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "choice",
DROP COLUMN "userId",
ADD COLUMN     "candidateId" TEXT NOT NULL,
ADD COLUMN     "voterId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_CandidateToVote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CandidateToVote_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CandidateToVote_B_index" ON "_CandidateToVote"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_voterId_electionId_key" ON "Vote"("voterId", "electionId");

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateToVote" ADD CONSTRAINT "_CandidateToVote_A_fkey" FOREIGN KEY ("A") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateToVote" ADD CONSTRAINT "_CandidateToVote_B_fkey" FOREIGN KEY ("B") REFERENCES "Vote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
