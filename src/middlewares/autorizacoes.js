import { prisma } from "../lib/prisma.js";
import { retonarErroPrisma } from "../services/errors.js";

export async function autenticacaoMiddleware(request, response, next){
    try {
        const autorizacao = request.headers.authorization

        if (!autorizacao) {
            return response.status(401).json({
                message: "Não está logado."
            })
        }


        const [tipo, token] = autorizacao.split(" ")

        if (tipo !== 'Basic' || !token) {
            return response.status(401).json({
                message: "Tipo de autorização inválida."
            })
        }

        const decodificado = Buffer.from(token, 'base64').toString('utf-8')
        const [email, senha] = decodificado.split(':') 

        const usuario = await prisma.usuario.findUnique({
            where: {
                email,
                senha
            },
            select: {
                id: true,
                nome: true,
                email: true,
                cargo: true,

            }
        })

        if (!usuario) {
            return response.status(401).json({
                message: "Usuário não autorizado."
            })
        }

        request.usuario = usuario

        return next()
    } catch (error) {
        return await retonarErroPrisma(error, response)
    }
}

export async function ehAdminMiddleware(request, response, next){
    try {
        const {cargo} = request.usuario
        
        if (cargo !== 'ADMIN'){
            return response.status(401).json({
                message: "Acesso negado."
            })
        }
        
        return next()
    } catch (error) {
        return await retonarErroPrisma(error, response)
    }    
}
