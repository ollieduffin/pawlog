import { credentialsSchema } from "../../../lib/validation";
import { Prisma } from "../../generated/prisma";
import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import prisma from "../../../lib/prisma";

export async function POST(request: Request){
    const body = await request.json();

    const result = credentialsSchema.safeParse(body)

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
                password: hash
            }
        })
            
        return NextResponse.json(
            {id: user.id, email: user.email},
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