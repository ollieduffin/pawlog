import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";


export default async function Page({ params }: PageProps<'/pets/[petId]'>) {
    const { petId } = await params; 
    const session = await auth();

    if(!session){
        //This check is only to be sure that session.user.id is valid, the redirect occurs in the layout inherently
        redirect('/login');
    }
     
    const pet = await prisma.pet.findFirst({ where: { id: petId, ownerId: session.user.id } })

    if(!pet || !pet.ownerId){
        notFound();
    }
    if(pet.ownerId !== session.user.id){
        notFound();
    }

    return(
        <div>
            <h1>{pet.name}</h1>
            <p>{pet.species}</p>
            {pet.breed && <p>{pet.breed}</p>}
            {pet.dateOfBirth && <p>{pet.dateOfBirth.toLocaleString().split(',')[0]}</p>}
        </div>
    )

}