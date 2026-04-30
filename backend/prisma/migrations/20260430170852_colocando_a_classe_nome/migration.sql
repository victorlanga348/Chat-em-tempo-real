/*
  Warnings:

  - You are about to drop the `GroupChat` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "name" TEXT;

-- DropTable
DROP TABLE "GroupChat";
