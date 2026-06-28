import { prisma } from "../lib/prisma.js";
import { retonarErroPrisma } from "../services/errors.js";

export async function criarTarefa(request, response){
    try {
        const usuario = request.usuario
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

        const dadosSprint = await prisma.sprint.findUnique({
            where: {id: Number(sprintId)},
            select: {
                projeto: {select: {id: true, techLeadId: true}}
            }
        })

        if (!dadosSprint) return response.status(404).json({message: "Sprint não encontrada."})


        if (usuario.cargo !== "ADMIN" && dadosSprint.projeto.techLeadId !== usuario.id) return response.status(401).json({
            message: "Acesso negado."
        })

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

export async function obterTarefa(request, response){
    try {
        const usuario = request.usuario
        const tarefaId = Number(request.params.id)

        const tarefa = await prisma.tarefa.findUnique({
            where: {id: tarefaId},
            include: {
                usuarios: {
                    select: {id: true, nome: true}
                },
                sprint: {
                    select: {projeto: {
                        select: {usuarios: {select: {id: true}}}
                    }}
                }
            }
        })

        if (!tarefa) return response.status(404).json({message: "Tarefa não encontrada."})

        const usuarioEstaNoProjeto = tarefa.sprint.projeto.usuarios.some(u => u.id === usuario.id)

        if (usuario.cargo !== "ADMIN" && !usuarioEstaNoProjeto) return response.status(401).json({
            message: "Acesso negado."
        })

        return response.status(200).json({data: tarefa})
    } catch (error) {
        return await retonarErroPrisma(error, response)
        
    }
}

export async function atribuirUsuarioTarefa(request, response){
    try {
        const usuario = request.usuario
        const tarefaId = Number(request.params.id)
        const {usuarioAtribuidoId} = request.body

        if (!usuarioAtribuidoId) return response.status(400).json({message: "Preencha os campos."})


        const tarefa = await prisma.tarefa.findUnique({
            where: {id: tarefaId},
            select: {
                sprint: {
                    select: {projeto: {select: {
                        techLeadId: true,
                        usuarios: {select: {id: true}}
                    }}}
                }
            }
        })

        if (!tarefa) return response.status(404).json({message: "Tarefa não encontrada"})

        
        const {sprint: {projeto}} = tarefa

        if(usuario.cargo !== "ADMIN" && usuario.id !== projeto.techLeadId) return response.status(401).json({
            message: "Acesso negado."
        })

        const atribuidoEstaNoProjeto = projeto.usuarios.some(u => u.id === Number(usuarioAtribuidoId))

        if (!atribuidoEstaNoProjeto) return response.status(400).json({message: "Usuário deve estar no projeto."})
        
        
        const dadosTarefa = await prisma.tarefa.update({
            where: {id: tarefaId},
            data: {
                usuarios: {connect: {id: Number(usuarioAtribuidoId)}}
            },
            select: {
                id: true,
                nome: true,
                usuarios: {
                    select: {id: true, nome: true}
                }
            }
        })


        return response.status(200).json({message: "Usuário atribuido com sucesso.", data: dadosTarefa})
    } catch (error) {
        return await retonarErroPrisma(error, response)
        
    }
}

export async function alterarEstadoTarefa(request, response){
    try {
        const usuario = request.usuario
        const tarefaId = Number(request.params.id)
        const {novoEstado} = request.body

        if (!novoEstado) return response.status(400).json({message: "Preencha os campos."})

        const estadosValidos = ["A_FAZER", "FAZENDO", "FEITO"]

        if(!estadosValidos.includes(novoEstado)) {
            return response.status(400).json({
                message: `Estado ${novoEstado} inválido.`,
                estadosValidos
            }
        )}

        const tarefa = await prisma.tarefa.findUnique({
            where: {id: tarefaId},
            select: {
                id: true,
                nome: true,
                usuarios: {select: {id: true, nome: true}},
                estado: true,
                sprint: {
                    select: {projeto: {select: {
                        techLeadId: true,
                    }}}
                }
            }
        })

        if (!tarefa) return response.status(404).json({message: "Tarefa não encontrada"})

        const usuarioEhResponsavel = tarefa.usuarios.some(u => u.id === usuario.id)

        if(usuario.cargo !== "ADMIN" && usuario.id !== tarefa.sprint.projeto.techLeadId && !usuarioEhResponsavel) return response.status(401).json({
            message: "Acesso negado."
        })


        
        
        const dadosTarefa = await prisma.tarefa.update({
            where: {id: tarefaId},
            data: {
                estado: novoEstado
            },
            select: {
                id: true,
                nome: true,
                estado: true,
                usuarios: {
                    select: {id: true, nome: true}
                }
            }
        })


        return response.status(200).json({message: "Estado alterado com sucesso.", data: dadosTarefa})
    } catch (error) {
        return await retonarErroPrisma(error, response)
        
    }
}