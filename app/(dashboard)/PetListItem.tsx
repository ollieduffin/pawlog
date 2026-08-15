"use client";
import { ClientPet } from "@/lib/types";
import DeletePetControl from "./DeletePetControl";
import EditPetControl from "./EditPetControl";
import Link from 'next/link'

interface PetListItemProps {
    pet: ClientPet
}

export default function PetListItem({pet}: PetListItemProps){
    return(
        <li>
            <span>{pet.name}</span>
            <span>{pet.species}</span>
            <span>{pet.breed}</span>
            <span>{pet.dateOfBirth?.toLocaleString()}</span>
            <EditPetControl pet={pet}/>
            <DeletePetControl petId={pet.id}/>
            <Link href={`/pets/${pet.id}`}>Details</Link>
        </li>
    )
}