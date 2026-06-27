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
    return retonarErroPrisma(error, response);
  }
}