"use client"
import FormInput from "@/app/components/FormInput";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

interface AddReminderFormProps {
    petId: string
}

export default function AddReminderForm ({petId}: AddReminderFormProps){
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (addReminder: object) => {
            const url = `/api/pets/${petId}/reminders`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(addReminder)
            })
            if(!response.ok){
                const body = await response.json();
                throw new Error(body.error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reminder", petId] })
        },
        onError: (error)=>{
            setErrorMessage(error.message);
        }
    })
    
    
    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        mutation.mutate({title: title, dueDate: dueDate})
    }

    return(
        <div>
            <form onSubmit={(e) => {handleSubmit(e)}}>
                <FormInput label={"Title"} type={"text"} value={title} onChange={(e) => setTitle(e.target.value)} />
                <FormInput label={"Due Date"} type={"date"} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                {errorMessage && <p aria-live="polite">{errorMessage}</p>}
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}