/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `Tarefa` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Tarefa` DROP FOREIGN KEY `Tarefa_usuarioId_fkey`;

-- DropIndex
DROP INDEX `Tarefa_usuarioId_fkey` ON `Tarefa`;

-- AlterTable
ALTER TABLE `Tarefa` DROP COLUMN `usuarioId`;

-- CreateTable
CREATE TABLE `_TarefaToUsuario` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TarefaToUsuario_AB_unique`(`A`, `B`),
    INDEX `_TarefaToUsuario_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_TarefaToUsuario` ADD CONSTRAINT `_TarefaToUsuario_A_fkey` FOREIGN KEY (`A`) REFERENCES `Tarefa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TarefaToUsuario` ADD CONSTRAINT `_TarefaToUsuario_B_fkey` FOREIGN KEY (`B`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
