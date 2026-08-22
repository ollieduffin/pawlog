"use client";
import { useQuery } from "@tanstack/react-query";
import { ClientReminder } from "@/lib/types";
import ReminderListItem from "./ReminderListItem";

interface ReminderListProps {
    petId: string
}

export default function ReminderList({petId} : ReminderListProps){
    const {data, isError, isPending, error} = useQuery({
        queryKey: ["reminder", petId],
        queryFn: async () => {
            const result = await fetch(`/api/pets/${petId}/reminders`);
            if(!result.ok){
                throw new Error("Failed to fetch reminders")
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

    return (
        <ul>
            {data.pet.reminders.map((reminder:ClientReminder) => <ReminderListItem key={reminder.id} reminder={reminder} />)}
        </ul>
    )
}