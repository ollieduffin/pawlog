import { Pet } from "@/app/generated/prisma/client";


export type ClientPet = Omit<Pet, "dateOfBirth" | "createdAt"> & {
  dateOfBirth: string | null;
  createdAt: string;
};