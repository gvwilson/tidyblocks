'use strict'

const util = require('./util')
const {
  ExprBase,
  ExprUnary,
  ExprBinary,
  ExprTernary
} = require('./expr')

/**
 * Indicate that persisted JSON is an operation.
 */
const FAMILY = '@op'

// ----------------------------------------------------------------------

/**
 * Arithmetic negation.
 */
class OpNegate extends ExprUnary {
  /**
   * Constructor.
   * @param {expr} arg How to get the value.
   * @returns The negation.
   */
  constructor (arg) {
    super(FAMILY, 'negate', arg)
  }

  run (row, i, data) {
    const value = this.arg.run(row, i, data)
    util.checkNumber(value,
                     `Require number for ${this.name}`)
    return (value === util.MISSING) ? util.MISSING : util.safeValue(-value)
  }
}

/**
 * Absolute Value.
 */
class OpAbs extends ExprUnary {
  /**
   * Constructor.
   * @param {expr} arg How to get the value.
   * @returns The absolute value.
   */
  constructor (arg) {
    super(FAMILY, 'abs', arg)
  }

  run (row, i, data) {
    const value = this.arg.run(row, i, data)
    util.checkNumber(value,
                     `Require number for ${this.name}`)
    return (value === util.MISSING) ? util.MISSING : util.safeValue(Math.abs(value))
  }
}

/**
 * Logical negation.
 */
class OpNot extends ExprUnary {
  /**
   * Constructor.
   * @param {expr} arg How to get the value.
   * @returns The negation.
   */
  constructor (arg) {
    super(FAMILY, 'not', arg)
  }

  run (row, i, data) {
    const value = this.arg.run(row, i, data)
    return (value === util.MISSING) ? util.MISSING : !util.makeLogical(value)
  }
}

// ----------------------------------------------------------------------

/**
 * Type-checking expressions.
 */
class OpTypecheckBase extends ExprUnary {
  /**
   * Constructor.
   * @param {string} species The precise function name.
   * @param arg How to get a value.
   */
  constructor (species, arg) {
    super(FAMILY, species, arg)
  }

  /**
   * Check the type of a value.
   */
  typeCheck (row, i, data, typeName) {
    const value = this.arg.run(row, i, data)
    if (value === util.MISSING) {
      return util.MISSING
    }
    const actual = typeof value
    return actual === typeName
  }
}

/**
 * Check if a value is logical.
 */
class OpIsLogical extends OpTypecheckBase {
  constructor (arg) {
    super('isLogical', arg)
  }

  run (row, i, data) {
    return this.typeCheck(row, i, data, 'boolean')
  }
}

/**
 * Check if a value is a datetime.
 */
class OpIsDatetime extends OpTypecheckBase {
  constructor (arg) {
    super('isDatetime', arg)
  }

  run (row, i, data) {
    const value = this.arg.run(row, i, data)
    return (value === util.MISSING) ? util.MISSING : (value instanceof Date)
  }
}

/**
 * Check if a value is missing.
 */
class OpIsMissing extends OpTypecheckBase {
  constructor (arg) {
    super('isMissing', arg)
  }

  run (row, i, data) {
    const value = this.arg.run(row, i, data)
    return value === util.MISSING
  }
}

/**
 * Check if a value is numeric.
 */
class OpIsNumber extends OpTypecheckBase {
  constructor (arg) {
    super('isNumber', arg)
  }

  run (row, i, data) {
    return this.typeCheck(row, i, data, 'number')
  }
}

/**
 * Check if a value is text.
 */
class OpIsText extends OpTypecheckBase {
  constructor (arg) {
    super('isText', arg)
  }

  run (row, i, data) {
    return this.typeCheck(row, i, data, 'string')
  }
}

// ----------------------------------------------------------------------

/**
 * Type conversion expressions.
 */
class OpConvertBase extends ExprUnary {
  /**
   * Constructor.
   * @param {string} species The precise function name.
   * @param arg How to get a value.
   */
  constructor (species, arg) {
    super(FAMILY, species, arg)
  }
}

/**
 * Convert a value to logical.
 */
class OpToLogical extends OpConvertBase {
  constructor (arg) {
    super('toLogical', arg)
  }

  run (row, i, data) {
    const value = this.arg.run(row, i, data)
    return (value === util.MISSING) ? util.MISSING : util.makeLogical(value)
  }
}

/**
 * Convert a value to a datetime.
 */
class OpToDatetime extends OpConvertBase {
  constructor (arg) {
    super('toDatetime', arg)
  }

  run (row, i, data) {
    const value = this.arg.run(row, i, data)
    return util.makeDate(value)
  }
}

/**
 * Convert a value to a number.
 */
class OpToNumber extends OpConvertBase {
  constructor (arg) {
    super('toNumber', arg)
  }

  run (row, i, data) {
    let value = this.arg.run(row, i, data)
    return util.makeNumber(value)
  }
}

/**
 * Convert a value to text.
 */
class OpToText extends OpConvertBase {
  constructor (arg) {
    super('toText', arg)
  }

  run (row, i, data) {
    let value = this.arg.run(row, i, data)
    if (value === util.MISSING) {
      return util.MISSING
    }
    if (typeof value !== 'string') {
      value = `${value}`
    }
    return value
  }
}

// ----------------------------------------------------------------------

/**
 * Unary datetime expressions.
 */
class OpDatetimeBase extends ExprUnary {
  /**
   * Constructor.
   * @param {string} species The precise function name.
   * @param arg How to get a value.
   */
  constructor (species, arg, converter) {
    super(FAMILY, species, arg)
    this.converter = converter
  }

  run (row, i, data) {
    const value = this.arg.run(row, i, data)
    if (value === util.MISSING) {
      return util.MISSING
    }
    util.check(value instanceof Date,
               `Require date for ${this.species}`)
    return this.converter(value)
  }
}

/**
 * Extract year from date.
 */
class OpToYear extends OpDatetimeBase {
  static CONVERTER = d => d.getFullYear()

  constructor (arg) {
    super('toYear', arg, OpToYear.CONVERTER)
  }
}

/**
 * Extract 1-based month from date.
 */
class OpToMonth extends OpDatetimeBase {
  static CONVERTER = d => d.getMonth() + 1

  constructor (arg) {
    super('toMonth', arg, OpToMonth.CONVERTER)
  }
}

/**
 * Extract 1-based day of month from date.
 */
class OpToDay extends OpDatetimeBase {
  static CONVERTER = d => d.getDate()

  constructor (arg) {
    super('toDay', arg, OpToDay.CONVERTER)
  }
}

/**
 * Extract day of week from date.
 */
class OpToWeekday extends OpDatetimeBase {
  static CONVERTER = d => d.getDay()

  constructor (arg) {
    super('toWeekday', arg, OpToWeekday.CONVERTER)
  }
}

/**
 * Extract hour from date.
 */
class OpToHours extends OpDatetimeBase {
  static CONVERTER = d => d.getHours()

  constructor (arg) {
    super('toHours', arg, OpToHours.CONVERTER)
  }
}

/**
 * Extract minutes from date.
 */
class OpToMinutes extends OpDatetimeBase {
  static CONVERTER = d => d.getMinutes()

  constructor (arg) {
    super('toMinutes', arg, OpToMinutes.CONVERTER)
  }
}

/**
 * Extract seconds from date.
 */
class OpToSeconds extends OpDatetimeBase {
  static CONVERTER = d => d.getSeconds()

  constructor (arg) {
    super('toSeconds', arg, OpToSeconds.CONVERTER)
  }
}

// ----------------------------------------------------------------------

/**
 * Binary arithmetic expressions.
 */
class OpArithmeticBase extends ExprBinary {
  /**
   * Constructor.
   * @param {string} species The name of the operation.
   * @param {expr} left How to get the left value.
   * @param {expr} right How to get the right value.
   */
  constructor (species, left, right, operator) {
    super(FAMILY, species, left, right)
    this.operator = operator
  }

  run (row, i, data) {
    const left = this.left.run(row, i, data)
    util.checkNumber(left,
                     `Require number for ${this.species}`)
    const right = this.right.run(row, i, data)
    util.checkNumber(right,
                     `Require number for ${this.species}`)
    return ((left === util.MISSING) || (right === util.MISSING))
      ? util.MISSING
      : util.safeValue(this.operator(left, right))
  }
}

/**
 * Addition.
 */
class OpAdd extends OpArithmeticBase {
  static OPERATOR = (left, right) => left + right

  constructor (left, right) {
    super('add', left, right, OpAdd.OPERATOR)
  }
}

/**
 * Division.
 */
class OpDivide extends OpArithmeticBase {
  static OPERATOR = (left, right) => left / right

  constructor (left, right) {
    super('divide', left, right, OpDivide.OPERATOR)
  }
}

/**
 * Multiplication.
 */
class OpMultiply extends OpArithmeticBase {
  static OPERATOR = (left, right) => left * right

  constructor (left, right) {
    super('multiply', left, right, OpMultiply.OPERATOR)
  }
}

/**
 * Exponentiation.
 */
class OpPower extends OpArithmeticBase {
  static OPERATOR = (left, right) => left ** right

  constructor (left, right) {
    super('power', left, right, OpPower.OPERATOR)
  }
}

/**
 * Remainder.
 */
class OpRemainder extends OpArithmeticBase {
  static OPERATOR = (left, right) => left % right

  constructor (left, right) {
    super('remainder', left, right, OpRemainder.OPERATOR)
  }
}

/**
 * Subtraction.
 */
class OpSubtract extends OpArithmeticBase {
  static OPERATOR = (left, right) => left - right

  constructor (left, right) {
    super('subtract', left, right, OpSubtract.OPERATOR)
  }
}

// ----------------------------------------------------------------------

/**
 * Extremum operations.
 */
class OpExtremumBase extends ExprBinary {
  /**
   * Constructor.
   * @param {string} species The name of the operation.
   * @param {expr} left How to get the left value.
   * @param {expr} right How to get the right value.
   */
  constructor (species, left, right, operator) {
    super(FAMILY, species, left, right)
    this.operator = operator
  }

  run (row, i, data) {
    const left = this.left.run(row, i, data)
    const right = this.right.run(row, i, data)
    return ((left === util.MISSING) || (right === util.MISSING))
      ? util.MISSING
      : this.operator(left, right)
  }
}

/**
 * Maximum of two values.
 */
class OpMaximum extends OpExtremumBase {
  static OPERATOR = (left, right) => (left > right ? left : right)

  constructor (left, right) {
    super('maximum', left, right, OpMaximum.OPERATOR)
  }
}

/**
 * Minimum of two values.
 */
class OpMinimum extends OpExtremumBase {
  static OPERATOR = (left, right) => (left < right ? left : right)

  constructor (left, right) {
    super('minimum', left, right, OpMinimum.OPERATOR)
  }
}

// ----------------------------------------------------------------------

/**
 * Binary comparison expressions.
 */
class OpCompareBase extends ExprBinary {
  /**
   * Constructor.
   * @param {string} species The name of the operation.
   * @param {expr} left How to get the left value.
   * @param {expr} right How to get the right value.
   */
  constructor (species, left, right, operator) {
    super(FAMILY, species, left, right)
    this.operator = operator
  }

  run (row, i, data) {
    const left = this.left.run(row, i, data)
    const right = this.right.run(row, i, data)
    util.checkTypeEqual(left, right,
                        `Require equal types for ${this.species}`)
    return ((left === util.MISSING) || (right === util.MISSING))
      ? util.MISSING
      : this.operator(left, right)
  }
}

/**
 * Equality.
 */
class OpEqual extends OpCompareBase {
  static OPERATOR = (left, right) => util.equal(left, right)

  constructor (left, right) {
    super('equal', left, right, OpEqual.OPERATOR)
  }
}

/**
 * Strictly greater than.
 */
class OpGreater extends OpCompareBase {
  static OPERATOR = (left, right) => (left > right)

  constructor (left, right) {
    super('greater', left, right, OpGreater.OPERATOR)
  }
}

/**
 * Greater than or equal.
 */
class OpGreaterEqual extends OpCompareBase {
  static OPERATOR = (left, right) => (left >= right)

  constructor (left, right) {
    super('greaterEqual', left, right, OpGreaterEqual.OPERATOR)
  }
}

/**
 * Strictly less than.
 */
class OpLess extends OpCompareBase {
  static OPERATOR = (left, right) => (left < right)

  constructor (left, right) {
    super('less', left, right, OpLess.OPERATOR)
  }
}

/**
 * Less than or equal.
 */
class OpLessEqual extends OpCompareBase {
  static OPERATOR = (left, right) => (left <= right)

  constructor (left, right) {
    super('lessEqual', left, right, OpLessEqual.OPERATOR)
  }
}

/**
 * Inequality.
 */
class OpNotEqual extends OpCompareBase {
  static OPERATOR = (left, right) => (!util.equal(left, right))

  constructor (left, right) {
    super('notEqual', left, right, OpNotEqual.OPERATOR)
  }
}

// ----------------------------------------------------------------------

/**
 * Binary logical expressions.
 */
class OpLogicalBase extends ExprBinary {
  /**
   * Constructor.
   * @param {string} species The name of the operation.
   * @param {expr} left How to get the left value.
   * @param {expr} right How to get the right value.
   */
  constructor (species, left, right) {
    super(FAMILY, species, left, right)
  }
}

/**
 * Logical conjunction.
 */
class OpAnd extends OpLogicalBase {
  constructor (left, right) {
    super('and', left, right)
  }

  run (row, i, data) {
    const left = this.left.run(row, i, data)
    if (!left) {
      return left
    }
    return this.right.run(row, i, data)
  }
}

/**
 * Logical disjunction.
 */
class OpOr extends OpLogicalBase {
  constructor (left, right) {
    super('or', left, right)
  }

  run (row, i, data) {
    const left = this.left.run(row, i, data)
    if (left) {
      return left
    }
    return this.right.run(row, i, data)
  }
}

// ----------------------------------------------------------------------

/**
 * Logical selection.
 */
class OpIfElse extends ExprTernary {
  /**
   * Constructor
   * @param {expr} left How to get the condition's value.
   * @param {expr} middle How to get a value if the condition is truthy.
   * @param {expr} right How to get a value if the condition is not truthy.
   */
  constructor (left, middle, right) {
    super(FAMILY, 'ifElse', left, middle, right)
  }

  run (row, i, data) {
    const cond = this.left.run(row, i, data)
    return (cond === util.MISSING)
      ? util.MISSING
      : (cond ? this.middle.run(row, i, data) : this.right.run(row, i, data))
  }
}

// ----------------------------------------------------------------------

/**
 * Shift values up or down a column.
 */
class OpShift extends ExprBase {
  constructor (column, amount) {
    super(FAMILY, 'shift')
    this.column = column
    this.amount = amount
  }

  /**
   * Check for equality.
   * @param other The object to check against.
   * @returns Equality.
   */
  equal (other) {
    return (other instanceof OpShift) &&
      (this.column === other.column) &&
      (this.amount === other.amount)
  }

  run (row, i, data) {
    util.check(this.column in row,
               `${this.column} not in data`)

    // Shift up.
    if (this.amount > 0) {
      if ((i - this.amount) < 0) {
        return util.MISSING
      }
      return data[i - this.amount][this.column]
    }

    // No shift
    if (this.amount === 0) {
      return data[i][this.column]
    }

    // Shift down (amount is negative).
    if ((i - this.amount) >= data.length) {
      return util.MISSING
    }
    return data[i - this.amount][this.column]
  }
}

// ----------------------------------------------------------------------

module.exports = {
  FAMILY: FAMILY,
  abs: OpAbs,
  add: OpAdd,
  and: OpAnd,
  divide: OpDivide,
  equal: OpEqual,
  greater: OpGreater,
  greaterEqual: OpGreaterEqual,
  ifElse: OpIfElse,
  isDatetime: OpIsDatetime,
  isLogical: OpIsLogical,
  isMissing: OpIsMissing,
  isNumber: OpIsNumber,
  isText: OpIsText,
  less: OpLess,
  lessEqual: OpLessEqual,
  maximum: OpMaximum,
  minimum: OpMinimum,
  multiply: OpMultiply,
  negate: OpNegate,
  not: OpNot,
  notEqual: OpNotEqual,
  or: OpOr,
  power: OpPower,
  remainder: OpRemainder,
  shift: OpShift,
  subtract: OpSubtract,
  toDatetime: OpToDatetime,
  toDay: OpToDay,
  toHours: OpToHours,
  toLogical: OpToLogical,
  toMinutes: OpToMinutes,
  toMonth: OpToMonth,
  toNumber: OpToNumber,
  toSeconds: OpToSeconds,
  toText: OpToText,
  toWeekday: OpToWeekday,
  toYear: OpToYear
}
