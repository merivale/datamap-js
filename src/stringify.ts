export const stringify = (value: unknown): string => {
  // arrays
  if (Array.isArray(value)) {
    return `[${value.map(stringify).join()}]`
  }

  // other objects
  if (typeof value === 'function' || (typeof value === 'object' && value !== null)) {
    return `{${Object.entries(value).sort().map(([key, value]) => `"${key}":${stringify(value)}`).join()}}`
  }

  // anything else (i.e. primitives)
  return JSON.stringify(value)
}

export const parse = (value: string): unknown => {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}
