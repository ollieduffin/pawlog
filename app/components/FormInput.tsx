interface SelectProps{
    type: "select";
    options: Array<string>;
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface InputProps{
    label: string;
    type: "text" | "email" | "password" | "date";
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface CheckboxProps{
    label: string;
    type: "checkbox";
    value: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

type FormInputProps = SelectProps | InputProps | CheckboxProps



export default function FormInput(props: FormInputProps) {
    if(props.type == "select"){
        return(
            <div>
                <label>{props.label}</label>
                <select value={props.value} onChange={props.onChange}>
                    {props.options.map((option) => <option key={option} value={option}>{option}</option>) }
                </select>
            </div>
        )
    }

    if(props.type == "checkbox"){
        return(
        <div>
            <label>{props.label}</label>
            <input type={props.type} checked={props.value} onChange={props.onChange} /> 
        </div>
        )
    }

    return(
        <div>
            <label>{props.label}</label>
            <input type={props.type} value={props.value} onChange={props.onChange} /> 
        </div>
    )
}