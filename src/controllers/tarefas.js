import { prisma } from "../lib/prisma.js";
import { retonarErroPrisma } from "../services/errors.js";

export async function criarTarefa(request, response){
    try {
        const {nome, descricao, duracao, prioridade, sprintId} = request.body

        if (!nome || !descricao || !duracao || !prioridade || !sprintId) {
            return response.status(400).json({message: "Preencha todos os campos."})
        }

        const prioridades = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']
        if (!prioridades.includes(prioridade)){
            return response.status(400).json({
                message: 'Prioridade inválida',
                prioridadesValidas: prioridades
            })
        }

        const tarefa = await prisma.tarefa.create({
            data: {
                nome,
                descricao,
                duracao: Number(duracao),
                prioridade,
                sprint: {
                    connect: {
                        id: Number(sprintId)
                    }
                },
            },
            include: {
                sprint: {
                    select: {
                        id: true, 
                        nome: true, 
                        projeto: {
                            select: {
                                id: true,
                                nome: true
                            }
                        }
                    }
                },
            }
        })

        return response.status(200).json({
            message: 'Tarefa criada com sucesso!',
            data: tarefa
        })

    } catch (error) {
        return await retonarErroPrisma(error, response)
    }
}