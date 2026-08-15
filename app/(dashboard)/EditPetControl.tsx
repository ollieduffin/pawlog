"use client";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ClientPet } from "@/lib/types";
import FormInput from "../components/FormInput";

interface EditPetControlProps {
    pet: ClientPet
}

export default function EditPetControl({pet}: EditPetControlProps){
    
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [name, setName] = useState(pet.name);
    const [species, setSpecies] = useState(pet.species);
    const [breed, setBreed] = useState(pet.breed ?? "");
    const [dateOfBirth, setDateOfBirth] = useState(pet.dateOfBirth?.split('T')[0] ?? "");
    const [errorMessage, setErrorMessage] = useState("");
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (updatePet: object) => {
            const response = await fetch(`/api/pets/${pet.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatePet)
            })
            if(!response.ok){
                console.log(response);
                throw new Error('Pet update error')
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pets"] })
        },
        onError: (error) => {
            setErrorMessage(error.message);
        }
    })

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        mutation.mutate({id: pet.id, name: name, species: species, breed: breed || undefined, dateOfBirth: dateOfBirth || undefined});
    }

    return(
        <div>
            <button onClick={()=>{dialogRef.current?.showModal()}}>Edit</button>
            <dialog ref={dialogRef} closedby="any">
                <form onSubmit={(e) => {handleSubmit(e)}}>
                    <FormInput label={"Pet name"} type={"text"} value={name} onChange={(e) => setName(e.target.value)} />
                    <FormInput label={"Species"} type={"text"} value={species} onChange={(e) => setSpecies(e.target.value)} />
                    <FormInput label={"Breed"} type={"text"} value={breed} onChange={(e) => setBreed(e.target.value)} />
                    <FormInput label={"Date of birth"} type={"date"} value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                    {errorMessage && <p aria-live="polite">{errorMessage}</p>}
                    <button type="submit">Submit</button>
                </form>
            </dialog>
        </div>
    )
}