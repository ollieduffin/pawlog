"use client";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
export default function DeletePetControl({ petId }:{petId: string}){
    const [errorMessage, setErrorMessage] = useState("");

    const queryClient = useQueryClient();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const mutation = useMutation({
        mutationFn: async (petId: string) => {
            
            const response = await fetch(`/api/pets/${petId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if(!response.ok){
                throw new Error("Pet deletion error")
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pets"] })
        },
        onError: (error) => {
            setErrorMessage(error.message);
        }
    })

    async function handleDeletion() {
        mutation.mutate(petId)
    }

    return(
        <div>
            <button onClick={()=>{dialogRef.current?.showModal()}}>Delete</button>
            <dialog ref={dialogRef} closedby="any">
                <p>Are you sure you wish to delete this pet?</p>
                <button onClick={() => {handleDeletion()}}>Delete</button>
                {errorMessage && <span>{errorMessage}</span>}
            </dialog>
        </div>
    )
}