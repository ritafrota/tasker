/*
  Warnings:

  - Added the required column `dataEstimada` to the `Projeto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duracao` to the `Tarefa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Projeto` ADD COLUMN `dataEstimada` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Tarefa` ADD COLUMN `duracao` INTEGER NOT NULL;
