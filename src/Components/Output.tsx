import React from "react";
import "../styles/index.css";
import {Loader} from "./Loader";

type OutputProps = {
    text: string; isLoading: boolean;
};

export const Output: React.FC<OutputProps> = ({text, isLoading}) => {
    return (isLoading ? <Loader/> : <div className="output">{text}</div>)
}