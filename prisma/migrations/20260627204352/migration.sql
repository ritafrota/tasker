/*
  Warnings:

  - You are about to drop the column `prioridade` on the `Sprint` table. All the data in the column will be lost.
  - You are about to alter the column `prioridade` on the `Tarefa` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `Sprint` DROP COLUMN `prioridade`;

-- AlterTable
ALTER TABLE `Tarefa` MODIFY `prioridade` ENUM('BAIXA', 'MEDIA', 'ALTA', 'URGENTE') NOT NULL;
