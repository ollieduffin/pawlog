"use client";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { LogEntry } from "@/app/generated/prisma/client";
import { useState } from "react";

interface DeleteLogControlProps {
    log: LogEntry
}

interface MutationProps {
    petId: string;
    logId: string;
}

export default function DeleteLogControl({ log }: DeleteLogControlProps){
    const [errorMessage, setErrorMessage] = useState("");

    const queryClient = useQueryClient();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const mutation = useMutation({
        mutationFn: async (logIds: MutationProps) => {
            
            const response = await fetch(`/api/pets/${logIds.petId}/logs/${logIds.logId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if(!response.ok){
                throw new Error("Log deletion error")
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['logs', log.petId] })
        },
        onError: (error) => {
            setErrorMessage(error.message);
        }
    })

    async function handleDeletion() {
        mutation.mutate({petId: log.petId, logId: log.id})
    }

    return(
        <div>
            <button onClick={()=>{dialogRef.current?.showModal()}}>Delete</button>
            <dialog ref={dialogRef} closedby="any">
                <p>Are you sure you wish to delete this log?</p>
                <button onClick={() => {handleDeletion()}}>Delete</button>
                {errorMessage && <span>{errorMessage}</span>}
            </dialog>
        </div>
    )
}