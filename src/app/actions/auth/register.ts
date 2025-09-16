"use server";

import bcrypt from "bcrypt"

import { registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import { prisma } from "@/lib/prisma";
import { getUseByEmail } from "../user/user";



export const register = async (values: RegisterSchema) => {
    const validatedFields = registerSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Invalid fields " }
    }

    const { email, password, name } = validatedFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUseByEmail(email)

    if (existingUser) {
        return { error: "Email  already in use!" }
    }

    await prisma.user.create({
        data: {
            name, email, password: hashedPassword
        }
    })


    // TODO: Send verification email 

    return { success: "User Created " }
}