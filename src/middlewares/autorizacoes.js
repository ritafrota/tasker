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
                id: true
            }
        })

        if (!usuario) {
            return response.status(401).json({
                message: "Usuário não autorizado."
            })
        }

        return next()
    } catch (error) {
        return await retonarErroPrisma(error, response)
    }
}

export async function ehAdminMiddleware(request, response, next){
    try {
        const autorizacao = request.headers.authorization
        const [_, token] = autorizacao.split(" ")
        const decodificado = Buffer.from(token, 'base64').toString('utf-8')
        const [email] = decodificado.split(':') 

        const {cargo} = await prisma.usuario.findUnique({
            where: {
                email
            },
            select: {
                cargo: true
            }
        })

        if (cargo !== 'ADMIN'){
            return response.status(401).json({
                message: "Esta rota é permitida apenas para ADMINS"
            })
        }
        
        return next()
    } catch (error) {
        
    }    
}