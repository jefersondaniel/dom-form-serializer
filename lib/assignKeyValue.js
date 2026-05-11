const UNSAFE_KEYS = ['__proto__', 'constructor', 'prototype']

export default function assignKeyValue (obj, keychain, value) {
  if (!keychain) { return obj }

  const key = keychain.shift()

  // Refuse to walk into prototype-pollution sinks.
  if (UNSAFE_KEYS.indexOf(key) !== -1) { return obj }

  // build the current object we need to store data
  if (!obj[key]) {
    obj[key] = Array.isArray(key) ? [] : {}
  }

  // if it's the last key in the chain, assign the value directly
  if (keychain.length === 0) {
    if (!Array.isArray(obj[key])) {
      obj[key] = value
    } else if (value !== null) {
      obj[key].push(value)
    }
  }

  // recursive parsing of the array, depth-first
  if (keychain.length > 0) {
    assignKeyValue(obj[key], keychain, value)
  }

  return obj
}
