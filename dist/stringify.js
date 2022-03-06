export const stringify = (value) => {
    if (Array.isArray(value)) {
        return `[${value.map(stringify).join()}]`;
    }
    if (typeof value === 'function' || (typeof value === 'object' && value !== null)) {
        return `{${Object.entries(value).sort().map(([key, value]) => `"${key}":${stringify(value)}`).join()}}`;
    }
    return JSON.stringify(value);
};
export const parse = (value) => {
    try {
        return JSON.parse(value);
    }
    catch {
        return value;
    }
};
