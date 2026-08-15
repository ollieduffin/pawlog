"use client"
import FormInput from "@/app/components/FormInput";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";


export default function AddPetForm (){

    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [breed, setBreed] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (addPet: object) => {
            const url = '/api/pets';
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(addPet)
            })
            if(!response.ok){
                const body = await response.json();
                throw new Error(body.error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pets"] })
        },
        onError: (error)=>{
            setErrorMessage(error.message);
        }
    })
    
    
    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        mutation.mutate({name: name, species: species, breed: breed || undefined, dateOfBirth: dateOfBirth || undefined})
    }

    return(
        <div>
            <form onSubmit={(e) => {handleSubmit(e)}}>
                <FormInput label={"Pet name"} type={"text"} value={name} onChange={(e) => setName(e.target.value)} />
                <FormInput label={"Species"} type={"text"} value={species} onChange={(e) => setSpecies(e.target.value)} />
                <FormInput label={"Breed"} type={"text"} value={breed} onChange={(e) => setBreed(e.target.value)} />
                <FormInput label={"Date of birth"} type={"date"} value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                {errorMessage && <p aria-live="polite">{errorMessage}</p>}
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}