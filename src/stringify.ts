const stringify = (value: unknown): string => {
  // callable objects
  if (typeof value === 'function') {
    return value.toString()
  }

  // arrays
  if (Array.isArray(value)) {
    return `[${value.map(stringify).join()}]`
  }

  // other objects
  if (typeof value === 'object' && value !== null) {
    return `{${Object.entries(value).sort().map((key, value) => `"${key}":${stringify(value)}`).join()}}`
  }

  // anything else (i.e. primitives)
  return JSON.stringify(value)
}

export default stringify
