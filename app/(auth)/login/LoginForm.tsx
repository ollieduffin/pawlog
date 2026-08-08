"use client"
import FormInput from "@/app/components/FormInput";

import { signIn } from "next-auth/react"

import { useRouter } from 'next/navigation'

import { useState } from "react";

export default function LoginForm (){
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    async function submitHandler(event: React.SubmitEvent<HTMLFormElement>){
        event.preventDefault();

        try{
            const result =  await signIn("credentials", { redirect: false, email: email, password: password })
            
            if(result?.error){
                setErrorMessage(result.error)
            }else{
                router.push('/')
            }
        } catch(e) {
            setErrorMessage('Unknown error')
        }

    }

    return(
        <div>
            <form onSubmit={(e) => {submitHandler(e)}}>
                <FormInput label={"Email"} type={"email"} value={email} onChange={(e) => setEmail(e.target.value)} />
                <FormInput label={"Password"} type={"password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                {errorMessage && <p aria-live="polite">{errorMessage}</p>}
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}