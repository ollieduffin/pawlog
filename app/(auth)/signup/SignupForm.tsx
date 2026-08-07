"use client"
import FormInput from "@/app/components/FormInput";

import { useRouter } from 'next/navigation'

import { useState } from "react";


export default function SignupForm (){
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const url = "/api/signup";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: name, email: email, password: password})
            })

            if(response.status === 201){
                router.push("/login");
            }else{
                const body = await response.json();
                setErrorMessage(body.error);
            }
        } catch (e) {
            setErrorMessage("Unknown error");
        }
    }

    return(
        <div>
            <form onSubmit={(e) => {handleSubmit(e)}}>
                <FormInput label={"Name"} type={"text"} value={name} onChange={(e) => setName(e.target.value)} />
                <FormInput label={"Email"} type={"email"} value={email} onChange={(e) => setEmail(e.target.value)} />
                <FormInput label={"Password"} type={"password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                {errorMessage && <p aria-live="polite">{errorMessage}</p>}
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}