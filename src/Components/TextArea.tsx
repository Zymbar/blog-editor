import React, {MutableRefObject, useRef} from "react";
import "../styles/index.css";

type TextAreaProps = {
    onButtonClick: (text: string) => void; error: string;
};

export const TextArea: React.FC<TextAreaProps> = ({onButtonClick, error}) => {
    const inputArea: MutableRefObject<HTMLTextAreaElement | null> = useRef(null);

    const onClick = () => {
        onButtonClick(inputArea.current?.value ?? "");
    };

    return (<div className="textarea_wrapper">
            <textarea className="textarea" placeholder="Enter your post here..." ref={inputArea}/>
            <button className="button" onClick={onClick}>Save</button>
            <div className="error">{error}</div>
        </div>)
}