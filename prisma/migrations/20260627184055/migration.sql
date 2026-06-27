/*
  Warnings:

  - Added the required column `projetoId` to the `Sprint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Sprint` ADD COLUMN `projetoId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Sprint` ADD CONSTRAINT `Sprint_projetoId_fkey` FOREIGN KEY (`projetoId`) REFERENCES `Projeto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
