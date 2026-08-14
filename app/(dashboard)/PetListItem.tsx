import { Pet } from "@/app/generated/prisma/client";

interface PetListItemProps {
    pet: Pet
}

export default function PetListItem({pet}: PetListItemProps){
    return(
        <li>
            <span>{pet.name}</span>
            <span>{pet.species}</span>
            <span>{pet.breed}</span>
            <span>{pet.dateOfBirth?.toLocaleString()}</span>
        </li>
    )
}