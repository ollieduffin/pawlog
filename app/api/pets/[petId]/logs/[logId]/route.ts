import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logEntryPatchSchema } from "@/lib/validation";

export async function PATCH( request: Request, { params }: RouteContext<'/api/pets/[petId]/logs/[logId]'> ){
    const session = await auth();
    const {petId, logId} = await params;

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

    if(typeof logId !== "string"){
        return NextResponse.json(
            {error: "LogId not valid"},
            {status: 400}
        )
    }

    const body = await request.json();

    const result = logEntryPatchSchema.safeParse(body);

    if(!result.success){
        return NextResponse.json(
            {error: "Invalid log data"},
            {status: 400}
        )
    }

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

        const updateLog = await prisma.logEntry.update({
            where: {
                id: logId,
                petId: petId
            },
            data: {
                ...result.data
            }
        })

        //no error handling, delete throws on its own

        console.log(updateLog)
        return NextResponse.json(
            {log: updateLog},
            {status: 200}
        )
       
    }catch(e){
        return NextResponse.json(
            {error: "Server error"},
            {status: 500}
        )
    }
}

export async function DELETE( request: Request, { params }: RouteContext<'/api/pets/[petId]/logs/[logId]'> ){
    const session = await auth();
    const {petId, logId} = await params;

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

    if(typeof logId !== "string"){
        return NextResponse.json(
            {error: "LogId not valid"},
            {status: 400}
        )
    }

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

        const deleteLog = await prisma.logEntry.delete({
            where: {
                id: logId,
                petId: petId
            }
        })

        //no error handling, delete throws on its own

        return NextResponse.json(
            {log: deleteLog},
            {status: 200}
        )
       
    }catch(e){
        return NextResponse.json(
            {error: "Server error"},
            {status: 500}
        )
    }
}