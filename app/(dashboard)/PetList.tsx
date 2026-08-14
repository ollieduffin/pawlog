"use client";
import { useQuery } from "@tanstack/react-query";
import { Pet } from "@/app/generated/prisma/client";
import PetListItem from "./PetListItem";
export default function PetList({}){
    const {data, isError, isPending, error} = useQuery({
        queryKey: ['pets'],
        queryFn: async () => {
            const result = await fetch('/api/pets');
            if(!result.ok){
                throw new Error("Failed to fetch pets")
            }
            return result.json();
        }
    })
    if(isPending){
        return <span>Loading...</span>
    }
    if(isError){
        return <span>Error: {error.message}</span>
    }
    console.log(data);
    return (
        <ul>
            {data.pets.map((pet:Pet) => <PetListItem key={pet.id} pet={pet} />)}
        </ul>
    )
}