"use client";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LogEntry } from "@/app/generated/prisma/client";
import FormInput from "@/app/components/FormInput";

interface EditLogControlProps {
    log: LogEntry
}

interface MutationProps {
    logId: string;
    petId: string;
    type: string;
    value: string;
    notes: string;
}

export default function EditLogControl({log}: EditLogControlProps){
    
    const dialogRef = useRef<HTMLDialogElement>(null);

   const [type, setType] = useState("");
    const [value, setValue] = useState("");
    const [notes, setNotes] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (updateLog: MutationProps) => {
            const response = await fetch(`/api/pets/${updateLog.petId}/logs/${updateLog.logId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updateLog)
            })
            if(!response.ok){
                console.log(response);
                throw new Error('Log update error')
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['logs', log.petId] })
        },
        onError: (error) => {
            setErrorMessage(error.message);
        }
    })

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        mutation.mutate({logId: log.id, petId: log.petId, type: type, value: value, notes: notes});
    }

    return(
        <div>
            <button onClick={()=>{dialogRef.current?.showModal()}}>Edit</button>
            <dialog ref={dialogRef} closedby="any">
                <form onSubmit={(e) => {handleSubmit(e)}}>
                    <FormInput label={"Type"} type={"select"} options={["FEEDING","SYMPTOM","TRAINING","WEIGHT","NOTE"]} value={type} onChange={(e) => setType(e.target.value)} />
                    <FormInput label={"Contents"} type={"text"} value={value} onChange={(e) => setValue(e.target.value)} />
                    <FormInput label={"Notes"} type={"text"} value={notes} onChange={(e) => setNotes(e.target.value)} />
                    {errorMessage && <p aria-live="polite">{errorMessage}</p>}
                    <button type="submit">Submit</button>
                </form>
            </dialog>
        </div>
    )
}