import { Prisma } from "../lib/prisma.js"

export async function retonarErroPrisma(error, response){
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = error.meta?.target

      if (Array.isArray(target) && target.includes("email")) {
        return response.status(409).json({
          message: "Este email já está cadastrado.",
        })
      }

      return response.status(409).json({
        message: "Já existe um registro com esses dados.",
      })
    }
  }
  
  return response.status(500).json({
    message: `Erro interno do servidor: ${error}`,
  })
}