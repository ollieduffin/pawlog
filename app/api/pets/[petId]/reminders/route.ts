import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { reminderSchema } from "@/lib/validation";

export async function POST( request: Request, { params }: RouteContext<'/api/pets/[petId]/reminders'> ){
    const session = await auth();
    const {petId} = await params;

    if(!session){
        return NextResponse.json(
            {error: "Access denied"},
            {status: 401}
        )
    }
    
    if(!petId){
        return NextResponse.json(
            {error: "Pet not found"},
            {status: 404}
        )
    }

    if(typeof petId !== "string"){
        return NextResponse.json(
            {error: "Pet not found"},
            {status: 404}
        )
    }

    const body = await request.json()

    const result = reminderSchema.safeParse(body);

    if(!result.success){
        return NextResponse.json(
                {error: "Reminder entry not valid"},
                {status: 400}
            )
    }
    
    const dueDate = new Date(result.data.dueDate);

    try{
        const pet = await prisma.pet.findUnique({
            where: {
                id: petId,
                ownerId: session.user.id
            }
        })
        if(!pet){
            return NextResponse.json(
                {error: "Pet not valid"},
                {status: 400}
            )
        }

        const reminder = await prisma.reminder.create({
            data: {
                ...result.data,
                dueDate: dueDate,
                pet: { connect: {id: pet.id}}
            }
        })

        return NextResponse.json(
            {reminder: reminder},
            {status: 200}
        )
       
    }catch(e){
        return NextResponse.json(
            {error: "Server error"},
            {status: 500}
        )
    }
}


export async function GET( request: Request, { params }: RouteContext<'/api/pets/[petId]/reminders'> ){
    const session = await auth();
    const {petId} = await params;

    if(!session){
        return NextResponse.json(
            {error: "Access denied"},
            {status: 401}
        )
    }
    
    if(!petId){
        return NextResponse.json(
            {error: "Pet not found"},
            {status: 404}
        )
    }

    if(typeof petId !== "string"){
        return NextResponse.json(
            {error: "Pet not found"},
            {status: 404}
        )
    }

    try{
        const pet = await prisma.pet.findUnique({
            where: {
                id: petId,
                ownerId: session.user.id
            },
            include: {
                reminders: true
            }
        })
        if(!pet){
            return NextResponse.json(
                {error: "Pet not valid"},
                {status: 400}
            )
        }

        return NextResponse.json(
            {pet: pet},
            {status: 200}
        )
       
    }catch(e){
        return NextResponse.json(
            {error: "Server error"},
            {status: 500}
        )
    }
}
