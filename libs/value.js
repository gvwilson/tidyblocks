'use strict'

const random = require('random')

const util = require('./util')
const {
  ExprBase,
  ExprNullary
} = require('./expr')

/**
 * Indicate that persisted JSON is a value.
 */
const FAMILY = '@value'

/**
 * @extends ExprBase
 * Absent value used as placeholder for incomplete expressions.
 *
 * - Requires no parameters.
 * - Is exactly equal to other absent values.
 * - Cannot be run.
 */
class ValueAbsent extends ExprBase {
  constructor () {
    super(FAMILY, 'absent')
  }

  equal (other) {
    return other instanceof ValueAbsent
  }

  run (row, i, data) {
    util.fail('Missing expression')
  }
}

/**
 * @extends ExprBase
 * Missing value (called `NULL` in SQL or `NA` in R).
 *
 * - Requires no parameters.
 * - Is exactly equal to other missing value expressions.
 */
class ValueMissing extends ExprBase {
  constructor () {
    super(FAMILY, 'missing')
  }

  equal (other) {
    return other instanceof ValueMissing
  }

  run (row, i, data) {
    return util.MISSING
  }
}

/**
 * Column value.
 */
class ValueColumn extends ExprNullary {
  /**
   * @param {string} name Column to access.
   */
  constructor (name) {
    util.check(name && (typeof name === 'string'),
               `Column name must be string`)
    super(FAMILY, 'column', name)
  }

  run (row, i, data) {
    util.check((0 <= i) && (i < data.length),
               `Row index ${i} out of range`)
    util.check(typeof row === 'object',
               `Row must be object`)
    util.check(this.value in row,
               `${this.name} not in row ${i}`)
    return row[this.value]
  }
}

/**
 * @extends ExprNullary
 * A constant datetime value.
 *
 * - Can be constructed from `MISSING`, a `Date` object, or a string that can be converted to a `Date`.
 * - Equal to other datetimes with the same value.
 * - Produces that constant datetime.
 */
class ValueDatetime extends ExprNullary {
  /**
   * @param {(MISSING|string|Date)} value Value to produce.
   */
  constructor (value) {
    value = util.makeDate(value)
    util.check((value === util.MISSING) || (value instanceof Date),
               `Datetime value "${value}" must be MISSING, date, or convertible string`)
    super(FAMILY, 'datetime', value)
  }

  run (row, i, data) {
    return this.value
  }
}

/**
 * @extends ExprNullary
 * A constant logical (Boolean) value.
 *
 * - Can be constructed from `MISSING` or a `boolean` value.
 * - Equal to other equally-valued logical values.
 * - Always produces the logical value.
 */
class ValueLogical extends ExprNullary {
  /**
   * @param {(MISSING|boolean)} value Value to produce.
   */
  constructor (value) {
    util.check((value === util.MISSING) || (typeof value === 'boolean'),
               `Logical value "${value}" must be MISSING or true/false`)
    super(FAMILY, 'logical', value)
  }

  run (row, i, data) {
    return this.value
  }
}

/**
 * @extends ExprNullary
 * A constant numeric value.
 *
 * - Can be constructed from `MISSING` or the specific number.
 * - Equal to equal numbers.
 * - Produces the specified value.
 */
class ValueNumber extends ExprNullary {
  /**
   * @param {(MISSING|number)} value Value to produce.
   */
  constructor (value) {
    util.check((value === util.MISSING) || (typeof value === 'number'),
               `Numeric value "${value}" must be missing or number`)
    super(FAMILY, 'number', value)
  }

  run (row, i, data) {
    return this.value
  }
}

/**
 * @extends ExprNullary
 * A constant text value.
 *
 * - Can be constructed from `MISSING` or a text value (possibly the empty string).
 * - Equal to equal-valued text.
 * - Produces that text.
 */
class ValueText extends ExprNullary {
  /**
   * @param {(MISSING|string)} value Value to produce.
   */
  constructor (value) {
    util.check((value === util.MISSING) || (typeof value === 'string'),
               `String value "${value}" must be missing or string`)
    super(FAMILY, 'text', value)
  }

  run (row, i, data) {
    return this.value
  }
}

/**
 * @extends ExprNullary
 * Sample an exponential distribution.
 *
 * - Requires a positive number as a rate parameter when constructed.
 * - Equal to equivalent exponential distributions.
 * - Samples the specified distribution.
 */
class ValueExponential extends ExprNullary {
  /**
   * @param {number} rate Distribution parameter.
   */
  constructor (rate) {
    util.check((typeof rate === 'number') && (rate > 0),
               `Rate "${rate}" must be positive number`)
    super(FAMILY, 'exponential', rate)
    this.generator = random.exponential(this.value)
  }

  run (row, i, data) {
    return this.generator()
  }
}

/**
 * @extends ExprNullary
 * Sample a normal distribution.
 *
 * - Requires a number as mean and a non-negative number as standard deviation.
 * - Equal to equivalent normal distributions.
 * - Samples the specified distribution.
 */
class ValueNormal extends ExprBase {
  /**
   * @param {number} mean Distribution parameter.
   * @param {number} stdDev Distribution parameter.
   */
  constructor (mean, stdDev) {
    util.check(typeof mean === 'number',
               `Mean "${mean}" must be a number`)
    util.check((typeof stdDev === 'number') && (stdDev >= 0),
               `Standard deviation "${stdDev}" must be a non-negative number`)
    super(FAMILY, 'normal')
    this.mean = mean
    this.stdDev = stdDev
    this.generator = random.normal(this.mean, this.stdDev)
  }

  equal (other) {
    return (other instanceof ValueNormal) &&
      (this.mean === other.mean) &&
      (this.stdDev === other.stdDev)
  }

  run (row, i, data) {
    return this.generator()
  }
}

/**
 * @extends ExprNullary
 * Sample a uniform distribution.
 *
 * - Requires an ordered pair of numbers as low and high bounds.
 * - Equal to equivalent uniform distributions.
 * - Samples the specified distribution.
 */
class ValueUniform extends ExprBase {
  /**
   * @param {number} low Distribution parameter.
   * @param {number} high Distribution parameter.
   */
  constructor (low, high) {
    util.check(typeof low === 'number',
               `Low end "${low}" must be a number`)
    util.check(typeof high === 'number',
               `High end "${high}" must be a number`)
    util.check(low <= high,
               `Low end "${low}" must not be greater than high end "${high}"`)
    super(FAMILY, 'uniform')
    this.low = low
    this.high = high
    this.generator = random.uniform(this.low, this.high)
  }

  equal (other) {
    return (other instanceof ValueUniform) &&
      (this.low === other.low) &&
      (this.high === other.high)
  }

  run (row, i, data) {
    return this.generator()
  }
}

module.exports = {
  FAMILY: FAMILY,
  absent: ValueAbsent,
  missing: ValueMissing,
  column: ValueColumn,
  datetime: ValueDatetime,
  logical: ValueLogical,
  number: ValueNumber,
  text: ValueText,
  exponential: ValueExponential,
  normal: ValueNormal,
  uniform: ValueUniform
}
