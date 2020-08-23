'use strict'

import papaparse from 'papaparse'

/**
 * Value to indicate missing data.
 */
export const MISSING = null

/**
 * Unilaterally fail: used to mark unimplemented functions and in cases where
 * `check` won't fit.
 * @param {string} message What to report.
 */
export const fail = (message) => {
  throw new Error(message)
}

/**
 * Raise exception if a condition doesn't hold. This ensures that everything
 * raises `Error`.
 * @param {Boolean} condition Condition that must be true.
 * @param {string} message What to say if it isn't.
 */
export const check = (condition, message) => {
  if (!condition) {
    fail(message)
  }
}

/**
 * Check that a value is MISSING or numeric.
 * @param {whatever} value What to check.
 */
export const checkNumber = (value) => {
  check((value === MISSING) ||
        (typeof value === 'number'),
        `Value ${value} is not missing or a number`)
}

/**
 * Check that the types of two values are the same (handling MISSING).
 * @param {whatever} left One of the values.
 * @param {whatever} right The other value.
 */
export const checkTypeEqual = (left, right) => {
  check((left === MISSING) ||
        (right === MISSING) ||
        (typeof left === typeof right),
        `Values ${left} and ${right} have different types`)
}

/**
 * Implementing equality test that handles dates correctly.
 * @param left One side of test.
 * @param right Other side of test.
 * @return Boolean.
 */
export const equal = (left, right) => {
  if ((left === MISSING) && (right === MISSING)) {
    return true
  }
  if ((left instanceof Date) && (right instanceof Date)) {
    return left.getTime() === right.getTime()
  }
  return left === right
}

/**
 * Turn something into a date. MISSING and actual dates are returned as-is,
 * strings are converted if they can be, and everything else fails.
 * @param value What to try to convert.
 * @return Date.
 */
export const makeDate = (value) => {
  if ((value === MISSING) || (value instanceof Date)) {
    return value
  }
  if (typeof value === 'number') {
    return new Date(value)
  }
  check(typeof value === 'string',
        `Cannot create date from ${value} of type ${typeof value}`)
  value = new Date(value)
  check(value.toString() !== 'Invalid Date',
        `Cannot create date from ${value} of type ${typeof value}`)
  return value
}

/**
 * Convert a value into a strict Boolean (exactly `true` or `false`).
 * @param value What to convert.
 * @return Either `true` or `false`.
 */
export const makeLogical = (value) => {
  if (value) {
    return true
  }
  return false
}

/**
 * Convert a value into a number.
 */
export const makeNumber = (value) => {
  if (value === MISSING) {
    return MISSING
  }
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'boolean') {
    return value ? 1 : 0
  }
  if (value instanceof Date) {
    return value.getTime()
  }
  check(typeof value === 'string',
        `Cannot convert "${value}" to number`)
  value = parseFloat(value)
  return Number.isNaN(value) ? MISSING : value
}

/**
 * Convert extraordinary numerical values into our MISSING.
 * @param {value} Value to check and convert.
 * @return Safe value.
 */
export const safeValue = (value) => {
  return isFinite(value) ? value : MISSING
}

/**
 * Convert CSV-formatted text to array of objects with uniform keys. The first
 * row must contain valid headers; null and the string 'NA' are converted to
 * MISSING. Other values (numeric, date, logical) are *not* inferred, but must
 * be converted explicitly.
 * @param {string} text Text to parse.
 * @return Array of objects.
 */
export const csvToTable = (text) => {
  const seen = new Map() // Headers (used across all calls to transformHeader)

  // Header transformation function required by PapaParse.
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
