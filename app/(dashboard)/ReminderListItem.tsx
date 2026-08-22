"use client";
import { ClientReminder } from "@/lib/types";
import DeleteReminderControl from "./DeleteReminderControl";
import EditReminderControl from "./EditReminderControl";

interface ReminderListItemProps {
    reminder: ClientReminder
}

export default function ReminderListItem({reminder}: ReminderListItemProps){
    return(
        <li>
            <span>{reminder.title}</span>
            <span>{reminder.dueDate}</span>
            <EditReminderControl reminder={reminder}/>
            <DeleteReminderControl reminder={reminder}/>
        </li>
    )
}