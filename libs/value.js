const random = require('@stdlib/random/base')

const util = require('./util')
const {
  ExprBase,
  ExprNullary,
  ExprValue
} = require('./expr')

const FAMILY = '@value'

/**
 * Absent value (placeholder for incomplete expressions).
 */
class ValueAbsent extends ExprNullary {
  constructor () {
    super(FAMILY, 'absent')
  }

  equal (other) {
    return other instanceof ValueAbsent
  }

  run (row, i) {
    util.fail('Missing expression')
  }
}

/**
 * Row number.
 */
class ValueRowNum extends ExprNullary {
  constructor () {
    super(FAMILY, 'rownum')
  }

  equal (other) {
    return other instanceof ValueRowNum
  }

  run (row, i) {
    return i
  }
}

/**
 * Column value.
 * @param {string} column The column name.
 * @returns The value
 */
class ValueColumn extends ExprValue {
  constructor (name) {
    util.check(name && (typeof name === 'string'),
               `Column name must be string`)
    super(FAMILY, 'column', name)
  }

  run (row, i) {
    util.check(typeof row === 'object',
               `Row must be object`)
    util.check(this.value in row,
               `${this.name} not in row`)
    return row[this.value]
  }
}

/**
 * Datetime value.
 */
class ValueDatetime extends ExprValue {
  constructor (value) {
    util.check((value === util.MISSING) || (value instanceof Date),
               `Datetime value must be missing or date`)
    super(FAMILY, 'datetime', value)
  }

  run (row, i) {
    return this.value
  }
}

/**
 * Logical value.
 */
class ValueLogical extends ExprValue {
  constructor (value) {
    util.check((value === util.MISSING) || (typeof value === 'boolean'),
               `Logical value must be missing or true/false`)
    super(FAMILY, 'logical', value)
  }

  run (row, i) {
    return this.value
  }
}

/**
 * Numeric value.
 */
class ValueNumber extends ExprValue {
  constructor (value) {
    util.check((value === util.MISSING) || (typeof value === 'number'),
               `Numeric value must be missing or number`)
    super(FAMILY, 'number', value)
  }

  run (row, i) {
    return this.value
  }
}

/**
 * Text value.
 */
class ValueText extends ExprValue {
  constructor (value) {
    util.check((value === util.MISSING) || (typeof value === 'string'),
               `String value must be missing or string`)
    super(FAMILY, 'text', value)
  }

  run (row, i) {
    return this.value
  }
}

/**
 * Exponential random variable
 */
class ValueExponential extends ExprValue {
  constructor (rate) {
    super(FAMILY, 'exponential', rate)
  }

  run (row, i) {
    return random.exponential(this.value)
  }
}

/**
 * Normal random variable
 */
class ValueNormal extends ExprBase {
  constructor (mean, stdDev) {
    super(FAMILY, 'normal')
    this.mean = mean
    this.stdDev = stdDev
  }

  equal (other) {
    return (other instanceof ValueNormal) &&
      (this.mean === other.mean) &&
      (this.stdDev === other.stdDev)
  }

  toJSON () {
    return [FAMILY, this.kind, this.mean, this.stdDev]
  }

  run (row, i) {
    return random.normal(this.mean, this.stdDev)
  }
}

/**
 * Uniform random variable
 */
class ValueUniform extends ExprBase {
  constructor (low, high) {
    super(FAMILY, 'uniform')
    this.low = low
    this.high = high
  }

  equal (other) {
    return (other instanceof ValueUniform) &&
      (this.low === other.low) &&
      (this.high === other.high)
  }

  toJSON () {
    return [FAMILY, this.kind, this.low, this.high]
  }

  run (row, i) {
    return random.uniform(this.low, this.high)
  }
}

module.exports = {
  FAMILY: FAMILY,
  absent: ValueAbsent,
  rownum: ValueRowNum,
  column: ValueColumn,
  datetime: ValueDatetime,
  logical: ValueLogical,
  number: ValueNumber,
  text: ValueText,
  exponential: ValueExponential,
  normal: ValueNormal,
  uniform: ValueUniform,
}
