-- AlterTable
ALTER TABLE `Sprint` MODIFY `estado` ENUM('pendente', 'finalizada') NOT NULL DEFAULT 'pendente';

-- AlterTable
ALTER TABLE `Tarefa` MODIFY `estado` ENUM('A_FAZER', 'FAZENDO', 'FEITO') NOT NULL DEFAULT 'A_FAZER';
