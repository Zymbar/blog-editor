import {useEffect, useState} from "react";
import {delay} from "../utils/utils";

type NamesSummary = { names: string[], errors: string[] };
type QuotesSummary = { promises: Promise<string | void>[], errors: string[] };
type Quotable = { quotes: Object };

export type UseAPI = {
    getNames: (symbols: string[]) => NamesSummary; getQuotes: (symbol: string[]) => QuotesSummary;
};

export const useAPI = (): UseAPI => {
    const url = `https://api.coinpaprika.com/v1/`;
    const [currencies, setCurrencies] = useState<any[] | null>(null);
    const [knownNames, setKnownNames] = useState<Map<string, string>>(new Map());
    const [knownIds, setKnownIds] = useState<Map<string, string>>(new Map());
    useEffect(() => {
        fetch(`${url}coins`)
            .then(response => response.json())
            .then(d => setCurrencies(d))
            .catch(er => console.error(er));
    }, [url]);

    const getNames = (symbols: string[]): NamesSummary => {
        const namesSummary: NamesSummary = symbols.reduce((summary: NamesSummary, symbol: string) => {
            if (knownNames.has(symbol)) {
                return {
                    ...summary, names: [...summary.names, knownNames.get(symbol)!]
                }
            }
            const foundCurrency = currencies?.find(curr => curr.symbol === symbol);
            if (foundCurrency) {
                const name = foundCurrency.name;
                const newKnownNames = new Map(knownNames);
                newKnownNames.set(symbol, name);
                setKnownNames(newKnownNames);
                return {...summary, names: [...summary.names, name]};
            } else {
                return {names: [...summary.names, `{{ Name/${symbol} }}`], errors: [...summary.errors, symbol]};
            }

        }, {errors: [], names: []});
        return namesSummary;
    }

    const getIdBySymbol = (symbol: string): string | null => {
        if (knownIds.has(symbol)) {
            return knownIds.get(symbol)!;
        }
        const foundCurrency = currencies?.find(curr => curr.symbol === symbol);
        if (foundCurrency) {
            const id = foundCurrency.id;
            const newKnownIds = new Map(knownIds);
            newKnownIds.set(symbol, id);
            setKnownIds(newKnownIds)
            return id;
        }
        return null;
    }

    const getQuotes = (symbols: string[]): QuotesSummary => {
        return symbols.reduce((summary: QuotesSummary, symbol: string, index) => {
            const id = getIdBySymbol(symbol);
            const promise: Promise<string | void> = id === null ? Promise.resolve(`{{ Quote/${symbol}}}`) : delay(Math.floor(index / 10) * 1001).then(() => fetch(`${url}tickers/${id}`))
                .then((response: any) => response.json())
                .then((data: Quotable) => {
                    const quotes: Object = data.quotes;
                    const formattedQuote: string = `${Object.keys(quotes)[0]}${Object.values(quotes)[0].price}`
                    return formattedQuote;
                });
            const errors: string[] = id === null ? [...summary.errors, symbol] : summary.errors;
            return {promises: [...summary.promises, promise], errors}
        }, {promises: [], errors: []})
    }

    return {getNames, getQuotes};
}