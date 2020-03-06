'use strict'

const papaparse = require('papaparse')

/**
 * Unilaterally fail (used to mark unimplemented functions).
 * @param {string} message What to report.
 */
const fail = (message) => {
  throw new Error(message)
}

/**
 * Raise exception if a condition doesn't hold.
 * @param {Boolean} condition Condition that must be true.
 * @param {string} message What to say if it isn't.
 */
const check = (condition, message) => {
  if (!condition) {
    fail(message)
  }
}

/**
 * Check that a value is numeric.
 * @param {whatever} value What to check.
 */
const checkNumber = (value) => {
  check((value === MISSING) ||
        (typeof value === 'number'),
        `Value ${value} is not missing or a number`)
  return value
}

/**
 * Check that the types of two values are the same.
 * @param {whatever} left One of the values.
 * @param {whatever} right The other value.
 */
const checkTypeEqual = (left, right) => {
  check((left === MISSING) ||
        (right === MISSING) ||
        (typeof left === typeof right),
        `Values ${left} and ${right} have different types`)
}

/**
 * Convert CSV-formatted text to array of objects with uniform keys.
 * @param {string} text Text to parse.
 * @returns Array of objects.
 */
const csvToTable = (text) => {
  const seen = new Map() // used across all calls to transformHeader
  const transformHeader = (name) => {
    // Simple character fixes.
    name = name
      .trim()
      .replace(/ /g, '_')
      .replace(/[^A-Za-z0-9_]/g, '')

    // Ensure header is not empty after character fixes.
    if (name.length === 0) {
      name = 'EMPTY'
    }

    // Name must start with underscore or letter.
    if (!name.match(/^[_A-Za-z]/)) {
      name = `_${name}`
    }

    // Name must be unique.
    if (seen.has(name)) {
      const serial = seen.get(name) + 1
      seen.set(name, serial)
      name = `${name}_${serial}`
    }
    else {
      seen.set(name, 0)
    }

    return name
  }

  const result = papaparse.parse(text.trim(), {
    dynamicTyping: true,
    header: true,
    skipEmptyLines: true,
    transformHeader: transformHeader,
    transform: function (value) {
      return (value === 'NA' | value === null) ? MISSING : value
    }
  })

  return result.data
}

/**
 * Value to indicate missing data.
 */
const MISSING = null

/**
 * Central dispatch for JSON persistence, placed here to avoid circular dependencies.
 */
const DispatchJSON = new Map()

/**
 * Register persistence lookup function.
 * @param {function} func JSON-to-object function.
 * @param {string[]} allKinds Identifiers to be handled by that function.
 */
const registerFromJSON = (func, ...allKinds) => {
  allKinds.forEach(kind => {
    check(kind &&
          (typeof kind === 'string') &&
          (kind[0] === '@'),
          `Require @name as kind not "${kind}"`)
    check(typeof func === 'function',
          `Require runnable function for dispatch`)
    DispatchJSON.set(kind, func)
  })
}

/**
 * Turn JSON into objects.
 * @param {JSON} json What to interpret.
 * @returns Object.
 */
const fromJSON = (json) => {
  if (!Array.isArray(json)) {
    return json
  }
  if (json.length === 0) {
    return json
  }

  const first = json[0]
  if ((!first) ||
      (typeof first != 'string') ||
      (!first.startsWith('@'))) {
    return json.map(x => fromJSON(x))
  }

  if (DispatchJSON.has(first)) {
    return DispatchJSON.get(first)(json)
  }

  fail(`Unknown kind "${kind}"`)
}

module.exports = {
  fail,
  check,
  checkNumber,
  checkTypeEqual,
  csvToTable,
  MISSING,
  registerFromJSON,
  fromJSON
}
