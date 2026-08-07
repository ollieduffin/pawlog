import SignupForm from "./SignupForm";

export const metadata = {
  title: "Sign Up — PawLog",
};

export default function SignupPage() {
  return (
    <div>
      <h1>Sign Up</h1>
      <SignupForm />
    </div>
  );
}