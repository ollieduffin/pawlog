"use client";
import { useQuery } from "@tanstack/react-query";
import { LogEntry } from "@/app/generated/prisma/client";
import LogListItem from "./LogListItem";

interface LogListProps {
    petId: string
}

export default function LogList({petId}: LogListProps){
    const {data, isError, isPending, error} = useQuery({
        queryKey: ['logs', petId],
        queryFn: async () => {
            const result = await fetch(`/api/pets/${petId}/logs`);
            if(!result.ok){
                throw new Error("Failed to fetch logs")
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
    console.log(data);
    return (
        <ul>
            {data.pet.logs.map((log:LogEntry) => <LogListItem key={log.id} log={log} />)}
        </ul>
    )
}