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
 * Our own equality test because dates are special.
 */
const equal = (left, right) => {
  if ((left instanceof Date) && (right instanceof Date)) {
    return left.getTime() === right.getTime()
  }
  return left === right
}

/**
 * Turn something into a Boolean.
 */
const makeBoolean = (value) => {
  if (value) {
    return true
  }
  return false
}

/**
 * Turn something into a date.
 */
const makeDate = (value) => {
  if ((value === MISSING) || (value instanceof Date)) {
    return value
  }
  check(typeof value === 'string',
        `Cannot create date from ${value} of type ${typeof value}`)
  value = new Date(value)
  check(value.toString() !== 'Invalid Date',
        `Cannot create date from ${value} of type ${typeof value}`)
  return value
}

/**
 * Convert extraordinary values into our MISSING.
 * @param {value} Value to check (and convert).
 * @returns Safe value.
 */
const safeValue = (value) => {
  return isFinite(value) ? value : MISSING
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

  const trimmed = text.trim()
  const result = papaparse.parse(trimmed, {
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

module.exports = {
  fail,
  check,
  checkNumber,
  checkTypeEqual,
  equal,
  makeBoolean,
  makeDate,
  safeValue,
  csvToTable,
  MISSING
}
