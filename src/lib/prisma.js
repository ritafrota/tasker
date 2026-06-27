import "dotenv/config"
import pkg from "@prisma/client"

const { PrismaClient, Prisma } = pkg
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL não definida no .env")
}

const adapter = new PrismaMariaDb(databaseUrl)

export const prisma = new PrismaClient({ adapter })
export { Prisma }