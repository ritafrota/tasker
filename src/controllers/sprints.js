import { prisma } from "../lib/prisma.js";
import { retonarErroPrisma } from "../services/errors.js";

export async function criarSprint(request, response) {
    try {
        const {nome, inicio, fim, prioridade, projetoId} = request.body

        if (!nome || !prioridade || !projetoId) {
            return response.status(400).json({message: 'Preencha os campos.'})
        }

        const dataInicio = new Date(inicio)
        const dataFim = new Date(fim)

        if(isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())){
            return response.status(400).json({message: 'Datas inválidas.'})
        }

        const sprint = await prisma.sprint.create({
            data: {
                nome,
                prioridade,
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
        return retonarErroPrisma(error, response)
    }
}