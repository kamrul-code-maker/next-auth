import { prisma } from "@/lib/prisma"

export const getUseByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } })
        return user;
    } catch {
        return null
    }
}

export const getUseById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } })
        return user;
    } catch {
        return null
    }
}