/*
  Warnings:

  - You are about to drop the column `descricao` on the `Sprint` table. All the data in the column will be lost.
  - Added the required column `fim` to the `Sprint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inicio` to the `Sprint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Sprint` DROP COLUMN `descricao`,
    ADD COLUMN `fim` DATETIME(3) NOT NULL,
    ADD COLUMN `inicio` DATETIME(3) NOT NULL;
