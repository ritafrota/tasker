import { prisma, Prisma } from "../lib/prisma.js";
import { retonarErroPrisma } from "../services/errors.js";

export async function login (request, response){
    const {email, senha} = request.body;

    if (!email || !senha) {
        return response.status(400).json({
            message: "Preencha os campos."
        })
    }


    const usuario = await prisma.usuario.findUnique({
        where: {
            email,
            senha,
            ativo: true
        },
        select: {
            id: true,
            nome: true,
            cargo: true,
        }
    })

    if (!usuario) {
        return response.status(401).json({message: "Credenciais inválidas."})
    } 

    return response.status(200).json({
        message: `${usuario.nome} logado(a) com sucesso.`,
        data: usuario
    })
}

export async function cadastro(request, response){
   
    try {     
        const {nome, email, senha, confirmacaoSenha, cargo} = request.body
        
        if (!nome || !email || !senha || !confirmacaoSenha || !cargo) {
            return response.status(400).json({
            message: 'Preencha todos os campos.'
        })
    }

        if (senha !== confirmacaoSenha) {
            return response.status(400).json({
                message: 'Senhas não conferem.'
            })
        }

        if (!['COLABORADOR', 'ADMIN'].includes(cargo)){
            return response.status(400).json({
                message: `Cargo ${cargo} inexistente.`,
                cargos: ['ADMIN', 'COLABORADOR']
            })
        }

        if (!email.endsWith('@tasker.com.br')){
            return response.status(400).json({
                message: "E-mail inválido, e-mails devem ser do domínio @tasker.com.br"
            })
        }

        const novoUsuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha,
                cargo
            },
            omit: {
                senha
            }
        })

        return response.status(201).json({
            message: 'Usuário cadastrado com sucesso.',
            data: novoUsuario
        })
    
    } catch (error) {
    return await retonarErroPrisma(error, response)
}


}