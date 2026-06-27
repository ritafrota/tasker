import { prisma } from "../lib/prisma.js";

export async function obterUsuarios(request, response){
    try {
        const usuarios = await prisma.usuario.findMany({omit: {
            senha: true
        }})
    
        return response.status(200).json(usuarios)
        
    } catch {
        return response.status(500).json({message: 'Erro de servidor.'})
    }
}

export async function obterColaboradores(request, response){
    try{
        const usuarios = await prisma.usuario.findMany(
        {
        omit: {
            senha: true
            },

            where: {
                cargo: 'COLABORADOR'
            }
        }
        )

        return response.status(200).json(usuarios)
    } catch {
        return response.status(500).json({message: 'Erro de servidor.'})
    }
}

export async function obterAdmins(request, response){
    try{
        const usuarios = await prisma.usuario.findMany(
        {
        omit: {
            senha: true
            },

            where: {
                cargo: 'ADMIN'
            }
        }
        )

        return response.status(200).json(usuarios)
    }catch {
        return response.status(500).json({message: 'Erro de servidor.'})
    }
}