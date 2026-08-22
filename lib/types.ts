import { Pet, Reminder } from "@/app/generated/prisma/client";


export type ClientPet = Omit<Pet, "dateOfBirth" | "createdAt"> & {
  dateOfBirth: string | null;
  createdAt: string;
};

export type ClientReminder = Omit<Reminder, "dueDate"> & {
  dueDate: string;
};