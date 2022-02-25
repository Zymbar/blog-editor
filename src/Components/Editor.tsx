import React, {useCallback, useState} from "react";
import {TextArea} from "./TextArea";
import {Output} from "./Output";
import "../styles/index.css";
import {useAPI} from "../Hooks/useAPI";
import {extractTags} from "../utils/utils";

export const Editor: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [output, setOutput] = useState<string>("");
    const [namesErrors, setNamesErrors] = useState<string[]>([]);
    const [idsErrors, setIdsErrors] = useState<string[]>([]);
    const [promiseErrors, setPromiseErrors] = useState<string[]>([]);
    const {getNames, getQuotes} = useAPI();

    const handleSave = useCallback((text: string): void => {
        Promise.resolve(() => {
            setIsLoading(true);
            let newText = text.slice();
            const symbolRegex = /{{ Name\/\w+ }}/gi;
            const tagsForNames = Array.from(new Set(extractTags(text, symbolRegex, 4)));
            const {errors, names} = getNames(tagsForNames);
            setNamesErrors(errors);
            names.forEach((name, index) => {
                newText = newText.replaceAll(`{{ Name/${tagsForNames[index]} }}`, name);
            });
            return newText;
        }).then((newText) => {
            let updatedText = newText();
            const tickerRegex = /{{ Quote\/\w+ }}/gi;
            const tagsForQuotes = Array.from(new Set(extractTags(updatedText, tickerRegex, 5)));
            const {errors: idsErrors, promises} = getQuotes(tagsForQuotes);
            setIdsErrors(idsErrors);
            Promise.all(promises)
                .then((quotes) => {
                    quotes.forEach((quote, index) => {
                        if (typeof quote === "string") {
                            updatedText = updatedText.replaceAll(`{{ Quote/${tagsForQuotes[index]} }}`, quote);
                        }
                    })
                    setOutput(updatedText);
                    setIsLoading(false);
                })
                .catch((er) => setPromiseErrors(er));
        })

    }, [getNames, getQuotes]);

    const allSymbolErrors = Array.from(new Set([...idsErrors, ...namesErrors]));
    const symbolsErrorMessage = allSymbolErrors.length > 0 ? `Couldn't find names for symbols: ${allSymbolErrors.join(", ")}.` : "";
    const errorMessage = `${symbolsErrorMessage}
    ${promiseErrors}`

    return (<div className="editor">
        <TextArea onButtonClick={handleSave} error={errorMessage}/>
        <Output text={output} isLoading={isLoading}/>
    </div>)
}