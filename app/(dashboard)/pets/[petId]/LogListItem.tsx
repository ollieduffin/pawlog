"use client";
import { LogEntry } from "@/app/generated/prisma/client";
import DeleteLogControl from "./DeleteLogControl";
import EditLogControl from "./EditLogControl";

interface LogListItemProps {
    log: LogEntry
}

export default function LogListItem({log}: LogListItemProps){
    return(
        <li>
            <span>{log.type}</span>
            <span>{log.value}</span>
            <span>{log.notes}</span>
            <DeleteLogControl log={log} />
            <EditLogControl log={log} />
        </li>
    )
}