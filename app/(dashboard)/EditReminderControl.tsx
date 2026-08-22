"use client";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ClientReminder } from "@/lib/types";
import FormInput from "../components/FormInput";

interface EditReminderControlProps {
    reminder: ClientReminder
}

export default function EditReminderControl({reminder}: EditReminderControlProps){
    
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [title, setTitle] = useState(reminder.title);
    const [dueDate, setDueDate] = useState(reminder.dueDate.split('T')[0]);
    const [completed, setCompleted] = useState(reminder.completed);
    const [errorMessage, setErrorMessage] = useState("");
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (updateReminder: object) => {
            const response = await fetch(`/api/pets/${reminder.petId}/reminders/${reminder.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updateReminder)
            })
            if(!response.ok){
                throw new Error('Reminder update error')
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reminder", reminder.petId] })
        },
        onError: (error) => {
            setErrorMessage(error.message);
        }
    })

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        mutation.mutate({id: reminder.id, title: title, dueDate: dueDate, completed: completed});
    }

    return(
        <div>
            <button onClick={()=>{dialogRef.current?.showModal()}}>Edit</button>
            <dialog ref={dialogRef} closedby="any">
                <form onSubmit={(e) => {handleSubmit(e)}}>
                    <FormInput label={"Title"} type={"text"} value={title} onChange={(e) => setTitle(e.target.value)} />
                    <FormInput label={"Due Date"} type={"date"} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    <FormInput label={"Completed"} type={"checkbox"} value={completed} onChange={(e) => setCompleted(e.target.checked)} />
                    {errorMessage && <p aria-live="polite">{errorMessage}</p>}
                    <button type="submit">Submit</button>
                </form>
            </dialog>
        </div>
    )
}