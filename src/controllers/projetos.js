import { prisma } from "../lib/prisma.js";
import { retonarErroPrisma } from "../services/errors.js";

export async function criarProjeto(request, response) {
  try {
    const {
      nome,
      descricao,
      dataEstimada,
      techLeadId,
      usuariosIds = [],
    } = request.body;

    console.log(request.body)

    if (!nome || !descricao || !dataEstimada || !techLeadId) {
      return response.status(400).json({
        message: "Preencha todos os campos.",
      });
    }

    const novaData = new Date(dataEstimada);

    if (isNaN(novaData.getTime())) {
      return response.status(400).json({
        message: "Data inválida.",
      });
    }

    if (!Array.isArray(usuariosIds)) {
      return response.status(400).json({
        message: "usuariosIds deve ser uma lista de ids.",
      });
    }

    const projeto = await prisma.projeto.create({
      data: {
        nome,
        descricao,
        dataEstimada: novaData,

        techlead: {
          connect: {
            id: Number(techLeadId),
          },
        },

        usuarios: {
          connect: usuariosIds.map((id) => ({
            id: Number(id),
          })),
        },
      },
      include: {
        techlead: true,
        usuarios: true,
      },
    });

    return response.status(201).json({
      message: "Projeto criado com sucesso.",
      data: projeto,
    });
  } catch (error) {
    return await retonarErroPrisma(error, response);
  }
}

export async function obterProjetos(request, response) {
  try {
      const usuario = request.usuario
      
      if (usuario.cargo === 'ADMIN'){
        const projetos = await prisma.projeto.findMany()
        
        return response.status(200).json({
          data: projetos
        })
      }

      const projetos = await prisma.projeto.findMany({
        where: {
          usuarios: {some: {id: usuario.id}}
        }
      })
    
      return response.status(200).json({data: projetos})
  } catch (error) {
    return await retonarErroPrisma(error, response)
  }
}

export async function obterDetalhesProjeto(request, response){
  try {
    const usuario = request.usuario
    const projetoId = Number(request.params.id)
    const projeto = await prisma.projeto.findFirst({
      where: {
        id: projetoId,
        ...(usuario.cargo !== 'ADMIN' && {
          usuarios: {some: {id: usuario.id}}
        })

      },
      include: {
        techlead: {
          select: {
            id: true,
            nome: true,
            email: true,
            cargo: true
          }
        },
        usuarios: {
          select: {
            id: true,
            nome: true,
            email: true,
            cargo: true
          }
        },
        sprints: {
          select: {
            id: true,
            nome: true,
            estado: true,
            fim: true,
            inicio: true,
            
          }
        },
      }
    })
    
    if (!projeto) {
      return response.status(404).json({message: "Projeto não encontrado."})
    }

    return response.status(200).json({data: projeto})
  } catch (error) {
    return await retonarErroPrisma(error, response)
  }
}

export async function adicionarUsuarioProjeto(request, response){
  try {
    const projetoId = Number(request.params.id)
    const {usuarioId} = request.body
    
    const projeto = await prisma.projeto.update({
      where: {
        id: Number(projetoId)
      },
      data: {
        usuarios: {connect: {id: Number(usuarioId)}}
      },
      select: {
        id: true,
        nome: true,
        usuarios: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    })


    return response.status(200).json({
      message: 'Usuário adicionado com sucesso.',
      data: projeto
    })

  } catch (error) {
    return await retonarErroPrisma(error, response)
    
  }
}

export async function removerUsuarioProjeto(request, response){
  try {
    const projetoId = Number(request.params.id)
    const {usuarioId} = request.body
    
    const projeto = await prisma.projeto.findUnique({
      where: {
        id: Number(projetoId)
      },
      select: {
        techLeadId: true
      }
    })

    if (!projeto) return response.status(404).json({message: "Projeto não encontrado."})

    if (projeto.techLeadId === Number(usuarioId)) return response.status(400).json({
      message: "O techlead não pode ser removido do projeto."
    })
    

    const dadosProjeto = await prisma.projeto.update({
      where: {
        id: Number(projetoId)
      },
      data: {
        usuarios: {disconnect: {id: Number(usuarioId)}}
      },
      select: {
        id: true,
        nome: true,
        usuarios: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    })


    return response.status(200).json({
      message: 'Usuário removido com sucesso.',
      data: dadosProjeto
    })

  } catch (error) {
    return await retonarErroPrisma(error, response)
    
  }
}