import { prisma } from "../lib/prisma.js";
import { retonarErroPrisma } from "../services/errors.js";

export async function criarSprint(request, response) {
    try {
        const usuario = request.usuario
        const {nome, inicio, fim, projetoId} = request.body

        if (!nome || !projetoId) {
            return response.status(400).json({message: 'Preencha os campos.'})
        }

        const dataInicio = new Date(inicio)
        const dataFim = new Date(fim)

        if(isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())){
            return response.status(400).json({message: 'Datas inválidas.'})
        }

        const dadosProjeto = await prisma.projeto.findUnique({
            where: {id: Number(projetoId)},
            select: {
                id: true, techLeadId: true
            }
        })

        if (!dadosProjeto) return response.status(404).json({message: "Projeto não encontrado."})


        if (usuario.cargo !== "ADMIN" && dadosProjeto.techLeadId !== usuario.id) return response.status(401).json({
            message: "Acesso negado."
        })

        const sprint = await prisma.sprint.create({
            data: {
                nome,
                inicio: dataInicio,
                fim: dataFim,
                projeto: {
                    connect: {id: Number(projetoId)}
                }
            },
            include: {
                projeto: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            }
        })
        
        return response.status(200).json({message: 'Sprint criada com sucesso.', data: sprint})
    } catch (error) {
        return await retonarErroPrisma(error, response)
    }
}

export async function concluirSprint(request, response){
    try {
        const usuario = request.usuario
        const sprintId = Number(request.params.id)

        const sprint = await prisma.sprint.findUnique({
            where: {id: sprintId},
            select: {
                id: true,
                nome: true,
                projeto: {
                    select: {id: true, nome: true, techLeadId: true}
                },
                tarefas: {select: {id: true, estado: true}}
            }
        })

        if (!sprint) return response.status(404).json({message: "Sprint não encontrada."})


        if (usuario.id !== sprint.projeto.techLeadId && usuario.cargo !== "ADMIN") return response.status(400).json({
            message: "Acesso negado."
        })

        const nemTodasTarefasConcluidas = sprint.tarefas.some(tarefa => tarefa.estado !== 'FEITO')

        if (nemTodasTarefasConcluidas) return response.status(400).json({
            message: "Todas as tarefas devem estar feitas para concluir a sprint."
        })

        const dadosSprint = await prisma.sprint.update({
            where: {id: sprintId},
            data: {
                estado: 'finalizada'
            },

        })


        return response.status(200).json({
            message: `Sprint ${dadosSprint.nome} concluída com sucesso.`,
            data: dadosSprint
        })
    } catch (error) {
        return await retonarErroPrisma(error, response)
        
    }
}

export async function obterSprint(request, response) {
    try {
        const usuario = request.usuario
        const sprintId = Number(request.params.id)

        const sprint = await prisma.sprint.findUnique({
            where: {id: sprintId},
            include: {
                tarefas: {
                    select: {id: true, nome: true, estado: true, duracao: true, criadoEm: true}
                },
                projeto: {
                    select: {
                        id: true, 
                        nome: true,
                        usuarios: {select: {id: true, nome: true}}
                    },
                }
            }
        })

        if (!sprint) return response.status(404).json({message: "Sprint não encontrada."})


        const usuarioEstaNoProjeto = sprint.projeto.usuarios.some(u => u.id === usuario.id)

        if(usuario.cargo !== "ADMIN" && !usuarioEstaNoProjeto) return response.status(404).json({
            message: "Sprint não encontrada."
        })


        return response.status(200).json({data: sprint})
    } catch (error) {
        return await retonarErroPrisma(error, response)
        
    }
}
