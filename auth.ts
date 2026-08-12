import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import prisma from "./lib/prisma";

import { loginSchema } from "./lib/validation"; 

import bcrypt from "bcryptjs";



export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {}
            },
            authorize: async (credentials) => {

                const result = loginSchema.safeParse(credentials)

                if(!result.success){
                    throw new Error("Invalid credentials")
                }

                let user = null

                

                user = await prisma.user.findUnique({
                    where: {email: result.data.email}
                });

                if(!user){
                    throw new Error("Invalid credentials")
                }

                if(!user.password){
                    throw new Error("Invalid password")
                }

                const validPass = await bcrypt.compare(
                    result.data.password,
                    user.password
                )

                if(!validPass){
                    throw new Error("Invalid password")
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id as string;
            return session;
        },
    }
})