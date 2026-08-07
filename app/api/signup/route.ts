import { signupSchema } from "../../../lib/validation";
import { Prisma } from "../../generated/prisma/client";
import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import prisma from "../../../lib/prisma";

export async function POST(request: Request){
    const body = await request.json();

    const result = signupSchema.safeParse(body)

    if(!result.success){
        return NextResponse.json(
            {error: "Invalid credentials"},
            {status: 400}
        )
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(result.data.password, salt);

    try {
        const user = await prisma.user.create({
            data: {
                email: result.data.email,
                name: result.data.name,
                password: hash
            }
        })
            
        return NextResponse.json(
            {id: user.id, name: user.name, email: user.email},
            {status: 201}
        )
    } catch (e) {
        if( e instanceof Prisma.PrismaClientKnownRequestError ){
            if(e.code === "P2002") {
                return NextResponse.json(
                    {error: "Email already registered"},
                    {status: 409}
                )
            }
        }
        return NextResponse.json(
            {error: "Registration error"},
            {status: 500}
        )
    }

}