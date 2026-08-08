import { z } from "zod";

export const signupSchema = z.object({
    email: z.email(),
    name: z.string().min(1),
    password: z.string().min(1)
})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1)
})

export const petSchema = z.object({
    name: z.string().min(1),
    species: z.string().min(1),
    breed: z.string().min(1).optional(),
    dateOfBirth: z.iso.datetime().optional(),
})
