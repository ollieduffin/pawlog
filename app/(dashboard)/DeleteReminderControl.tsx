"use client";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ClientReminder } from "@/lib/types";

interface DeleteReminderControlProps {
    reminder: ClientReminder
}

interface MutationProps {
    petId: string;
    reminderId: string;
}

export default function DeleteReminderControl({ reminder }: DeleteReminderControlProps){
    const [errorMessage, setErrorMessage] = useState("");
    
    const queryClient = useQueryClient();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const mutation = useMutation({
        mutationFn: async (reminderIds: MutationProps) => {
            
            const response = await fetch(`/api/pets/${reminderIds.petId}/reminders/${reminderIds.reminderId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if(!response.ok){
                throw new Error("Reminder deletion error")
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reminder", reminder.petId] })
        },
        onError: (error) => {
            setErrorMessage(error.message);
        }
    })

    async function handleDeletion() {
        mutation.mutate({petId: reminder.petId, reminderId: reminder.id})
    }

    return(
        <div>
            <button onClick={()=>{dialogRef.current?.showModal()}}>Delete</button>
            <dialog ref={dialogRef} closedby="any">
                <p>Are you sure you wish to delete this reminder?</p>
                <button onClick={() => {handleDeletion()}}>Delete</button>
                {errorMessage && <span>{errorMessage}</span>}
            </dialog>
        </div>
    )
}