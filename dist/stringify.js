const stringify = (value) => {
    if (typeof value === 'function') {
        return value.toString();
    }
    if (Array.isArray(value)) {
        return `[${value.map(stringify).join()}]`;
    }
    if (typeof value === 'object' && value !== null) {
        return `{${Object.entries(value).sort().map((key, value) => `"${key}":${stringify(value)}`).join()}}`;
    }
    return JSON.stringify(value);
};
export default stringify;
