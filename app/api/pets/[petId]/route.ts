import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { petPatchSchema } from "@/lib/validation";

export async function GET( request: Request, { params }: RouteContext<'/api/pets/[petId]'>) {
    const { petId } = await params;
    const session = await auth();

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
        const pet = await prisma.pet.findUnique({where: {id: petId}})
        if(!pet || !pet.ownerId){
            return NextResponse.json(
                {error: "Pet not valid"},
                {status: 400}
            )
        }
        if(pet.ownerId !== session.user.id){
            return NextResponse.json(
                {error: "User not authorised"},
                {status: 403}
            ) 
        }
        return NextResponse.json(
            {pet: pet},
            {status: 200}
        ) 
    } catch (e){
        return NextResponse.json(
            {error: "Server error"},
            {status: 500}
        )
    }

}

export async function DELETE( request: Request, { params }: RouteContext<'/api/pets/[petId]'>) {
    const { petId } = await params;
    const session = await auth();

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
        const pet = await prisma.pet.findUnique({where: {id: petId}})
        if(!pet || !pet.ownerId){
            return NextResponse.json(
                {error: "Pet not valid"},
                {status: 400}
            )
        }
        if(pet.ownerId !== session.user.id){
            return NextResponse.json(
                {error: "User not authorised"},
                {status: 403}
            ) 
        }
        await prisma.pet.delete({where: {id: petId}})
        
        return new NextResponse(
            null,
            {status: 204}
        ) 
    } catch (e){
        return NextResponse.json(
            {error: "Server error"},
            {status: 500}
        )
    }
}

export async function PATCH(request: Request, { params }: RouteContext<'/api/pets/[petId]'>) {
    const { petId } = await params;
    const session = await auth();

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

    
    const body = await request.json();

    const result = petPatchSchema.safeParse(body);

    if(!result.success){
        return NextResponse.json(
            {error: "Invalid pet data"},
            {status: 400}
        )
    }

    let dateOfBirth = null;
    if(result.data.dateOfBirth){
        dateOfBirth = new Date(result.data.dateOfBirth);
    }

    try{
        const pet = await prisma.pet.findUnique({where: {id: petId}})
        if(!pet || !pet.ownerId){
            return NextResponse.json(
                {error: "Pet not valid"},
                {status: 400}
            )
        }
        if(pet.ownerId !== session.user.id){
            return NextResponse.json(
                {error: "User not authorised"},
                {status: 403}
            ) 
        }

        const updatePet = await prisma.pet.update({
            where: {id: petId},
            data: {...result.data,
                dateOfBirth: dateOfBirth}
        })

        return NextResponse.json(
            {updatePet: updatePet},
            {status: 200}
        )

    } catch (e){
        return NextResponse.json(
            {error: "Server error"},
            {status: 500}
        )
    }


}