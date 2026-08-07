interface FormInputProps {
    label: string;
    type: "text" | "email" | "password";
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({label, type, value, onChange}: FormInputProps) {
    return(
        <div>
            <label>{label}</label>
            <input type={type} value={value} onChange={onChange} />
        </div>
    )
}