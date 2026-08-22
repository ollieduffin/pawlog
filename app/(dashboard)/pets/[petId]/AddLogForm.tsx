"use client"
import FormInput from "@/app/components/FormInput";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

interface AddLogFormProps {
    petId: string
}

export default function AddLogForm ({petId}: AddLogFormProps){
    const [type, setType] = useState("FEEDING");
    const [value, setValue] = useState("");
    const [notes, setNotes] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (addLog: object) => {
            const url = `/api/pets/${petId}/logs`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(addLog)
            })
            if(!response.ok){
                const body = await response.json();
                throw new Error(body.error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['logs', petId] })
        },
        onError: (error)=>{
            setErrorMessage(error.message);
        }
    })
    
    
    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        mutation.mutate({type: type, value: value || undefined, notes: notes || undefined})
    }

    return(
        <div>
            <form onSubmit={(e) => {handleSubmit(e)}}>
                <FormInput label={"Type"} type={"select"} options={["FEEDING","SYMPTOM","TRAINING","WEIGHT","NOTE"]} value={type} onChange={(e) => setType(e.target.value)} />
                <FormInput label={"Contents"} type={"text"} value={value} onChange={(e) => setValue(e.target.value)} />
                <FormInput label={"Notes"} type={"text"} value={notes} onChange={(e) => setNotes(e.target.value)} />
                {errorMessage && <p aria-live="polite">{errorMessage}</p>}
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}