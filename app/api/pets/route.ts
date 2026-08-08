import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { petSchema } from "@/lib/validation";


export async function GET(){
    const session = await auth();

    if(!session){
        return NextResponse.json(
            {error: "Access denied"},
            {status: 401}
        )
    }

    const pets = await prisma.pet.findMany({where: {ownerId: session.user.id}});

    return NextResponse.json(
        {pets: pets}
    )
}

export async function POST(request: Request) {
    const session = await auth();

    if(!session){
        return NextResponse.json(
            {error: "Access denied"},
            {status: 401}
        )
    }

    const body = await request.json();

    const result = petSchema.safeParse(body);

    if(!result.success){
       return NextResponse.json(
            {error: "Invalid pet data"},
            {status: 400}
        )
    }
    try{
        const pet = await prisma.pet.create({
            data: { 
                ...result.data, 
                ownerId: session.user.id 
            },
        })

        return NextResponse.json(
            {id: pet.id, name: pet.name, species: pet.species, breed: pet.breed, dateOfBirth: pet.dateOfBirth},
            {status: 201}
        )
    } catch (e) {
        return NextResponse.json(
            {error: "Pet registration error"},
            {status: 500}
        )
    }
    

}