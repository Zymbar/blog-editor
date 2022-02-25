export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const extractTags = (text: string, regex: RegExp, keyLength: number): string[] => {
    const foundInstances = text.match(regex);
    return foundInstances?.map((inst) => extractCurrencySymbol(inst, keyLength)) ?? [];
}

const extractCurrencySymbol = (input: string, length: number): string => {
    return input.trim().substring(4 + length, input.length - 3);
}