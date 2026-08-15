import AddPetForm from "./AddPetForm";
import PetList from "./PetList";
export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <AddPetForm />
      <PetList />
    </div>
  );
}