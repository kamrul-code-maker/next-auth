import { z } from "zod";



export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password too short"),
    code: z.optional(z.string()),
});


export type  LoginSchema = z.infer<typeof loginSchema>