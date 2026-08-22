import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { reminderPatchSchema } from "@/lib/validation";
import { z } from "zod";

export async function PATCH( request: Request, { params }: RouteContext<'/api/pets/[petId]/reminders/[reminderId]'> ){
    const session = await auth();
    const {petId, reminderId} = await params;

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

    if(typeof reminderId !== "string"){
        return NextResponse.json(
            {error: "reminderId not valid"},
            {status: 400}
        )
    }

    const body = await request.json();

    const result = reminderPatchSchema.safeParse(body);

    if(!result.success){
        return NextResponse.json(
            {error: "Invalid reminder data"},
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

        const { dueDate: rawDueDate, ...rest } = result.data;


        // same shape as reminderPatchSchema's validated output, but dueDate is Date (not string) since Prisma needs a real Date object
        const data: Omit<z.infer<typeof reminderPatchSchema>, "dueDate"> & {dueDate?: Date} = {...rest};
        
        if(rawDueDate){
            data.dueDate = new Date(rawDueDate);
        }
        

        const updateReminder = await prisma.reminder.update({
            where: {
                id: reminderId,
                petId: petId
            },
            data: data
        })

        //no error handling, update throws on its own

        return NextResponse.json(
            {reminder: updateReminder},
            {status: 200}
        )
       
    }catch(e){
        return NextResponse.json(
            {error: "Server error"},
            {status: 500}
        )
    }
}

export async function DELETE( request: Request, { params }: RouteContext<'/api/pets/[petId]/reminders/[reminderId]'> ){
    const session = await auth();
    const {petId, reminderId} = await params;

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

    if(typeof reminderId !== "string"){
        return NextResponse.json(
            {error: "reminderId not valid"},
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

        const deleteReminder = await prisma.reminder.delete({
            where: {
                id: reminderId,
                petId: petId
            }
        })

        //no error handling, delete throws on its own

        return NextResponse.json(
            {reminder: deleteReminder},
            {status: 200}
        )
       
    }catch(e){
        return NextResponse.json(
            {error: "Server error"},
            {status: 500}
        )
    }
}