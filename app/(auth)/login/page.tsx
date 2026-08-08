import LoginForm from "./LoginForm";

export const metadata = {
  title: "Log in — PawLog",
};

export default function LoginPage(){
    return(
        <div>
            <h1>Login Page</h1>
            <LoginForm />
        </div>
        
    )
}