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
 * @extends ExprUnary
 * Arithmetic negation.
 */
class OpNegate extends ExprUnary {
  /**
   * @param {ExprBase} arg How to get the value (which must be numeric or MISSING).
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
 * @extends ExprUnary
 * Absolute value.
 */
class OpAbs extends ExprUnary {
  /**
   * @param {ExprBase} arg How to get the value (which must be numeric or MISSING).
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
 * @extends ExprUnary
 * Logical negation.
 */
class OpNot extends ExprUnary {
  /**
   * @param {ExprBase} arg How to get the value (which must be logical or MISSING).
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
 * @extends ExprUnary
 * Base class for type-checking expressions.
 */
class OpTypecheckBase extends ExprUnary {
  /**
   * @param {string} species The precise function name.
   * @param {ExprBase} arg How to get a value.
   */
  constructor (species, arg) {
    super(FAMILY, species, arg)
  }

  /**
   * Check the type of a value, returning MISSING for missing values.
   * @param {Object} row The row containing the value.
   * @param {number} i The row index.
   * @param {Array<Object>} data The array of rows.
   * @param {string} typeName The type to check for.
   * @return {boolean} Whether the value of `arg` has the right type.
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
 * @extends OpTypecheckBase
 * Check if a value is logical.
 */
class OpIsLogical extends OpTypecheckBase {
  /**
   * @param {ExprBase} arg How to get a value.
   */
  constructor (arg) {
    super('isLogical', arg)
  }

  run (row, i, data) {
    return this.typeCheck(row, i, data, 'boolean')
  }
}

/**
 * @extends OpTypecheckBase
 * Check if a value is a datetime.
 */
class OpIsDatetime extends OpTypecheckBase {
  /**
   * @param {ExprBase} arg How to get a value.
   */
  constructor (arg) {
    super('isDatetime', arg)
  }

  run (row, i, data) {
    const value = this.arg.run(row, i, data)
    return (value === util.MISSING) ? util.MISSING : (value instanceof Date)
  }
}

/**
 * @extends OpTypecheckBase
 * Check if a value is missing.
 */
class OpIsMissing extends OpTypecheckBase {
  /**
   * @param {ExprBase} arg How to get a value.
   */
  constructor (arg) {
    super('isMissing', arg)
  }

  run (row, i, data) {
    const value = this.arg.run(row, i, data)
    return value === util.MISSING
  }
}

/**
 * @extends OpTypecheckBase
 * Check if a value is numeric.
 */
class OpIsNumber extends OpTypecheckBase {
  /**
   * @param {ExprBase} arg How to get a value.
   */
  constructor (arg) {
    super('isNumber', arg)
  }

  run (row, i, data) {
    return this.typeCheck(row, i, data, 'number')
  }
}

/**
 * @extends OpTypecheckBase
 * Check if a value is text.
 */
class OpIsText extends OpTypecheckBase {
  /**
   * @param {ExprBase} arg How to get a value.
   */
  constructor (arg) {
    super('isText', arg)
  }

  run (row, i, data) {
    return this.typeCheck(row, i, data, 'string')
  }
}

// ----------------------------------------------------------------------

/**
 * @extends ExprUnary
 * Base class for type conversion expressions.
 */
class OpConvertBase extends ExprUnary {
  /**
   * @param {string} species The precise function name.
   * @param {ExprBase} arg How to get a value.
   */
  constructor (species, arg) {
    super(FAMILY, species, arg)
  }
}

/**
 * @extends OpConvertBase
 * Convert a value to logical, producing MISSING for missing values.
 */
class OpToLogical extends OpConvertBase {
  /**
   * @param {ExprBase} arg How to get a value.
   */
  constructor (arg) {
    super('toLogical', arg)
  }

  run (row, i, data) {
    const value = this.arg.run(row, i, data)
    return (value === util.MISSING) ? util.MISSING : util.makeLogical(value)
  }
}

/**
 * @extends OpConvertBase
 * Convert a value to a datetime, producing MISSING for missing values.
 */
class OpToDatetime extends OpConvertBase {
  /**
   * @param {ExprBase} arg How to get a value.
   */
  constructor (arg) {
    super('toDatetime', arg)
  }

  run (row, i, data) {
    const value = this.arg.run(row, i, data)
    return util.makeDate(value)
  }
}

/**
 * @extends OpConvertBase
 * Convert a value to a number, producing MISSING for missing values.
 */
class OpToNumber extends OpConvertBase {
  /**
   * @param {ExprBase} arg How to get a value.
   */
  constructor (arg) {
    super('toNumber', arg)
  }

  run (row, i, data) {
    let value = this.arg.run(row, i, data)
    return util.makeNumber(value)
  }
}

/**
 * @extends OpConvertBase
 * Convert a value to text, producing MISSING for missing values.
 */
class OpToText extends OpConvertBase {
  /**
   * @param {ExprBase} arg How to get a value.
   */
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
 * @extends ExprUnary
 * Base class for unary datetime expressions.
 */
class OpDatetimeBase extends ExprUnary {
  /**
   * @param {string} species The precise function name.
   * @param {ExprBase} arg How to get a value.
   * @param {function} converter Conversion function from Date to value.
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
 * @extends OpDatetimeBase
 * Extract year from date.
 */
class OpToYear extends OpDatetimeBase {
  /**
   * Extract year from Date.
   */
  static CONVERTER = d => d.getFullYear()

  /**
   * @param {ExprBase} arg How to get a value.
   */
  constructor (arg) {
    super('toYear', arg, OpToYear.CONVERTER)
  }
}

/**
 * @extends OpDatetimeBase
 * Extract 1-based month from date.
 */
class OpToMonth extends OpDatetimeBase {
  /**
   * Extract year from Date.
   */
  static CONVERTER = d => d.getMonth() + 1

  /**
   * @param {ExprBase} arg How to get a value.
   */
  constructor (arg) {
    super('toMonth', arg, OpToMonth.CONVERTER)
  }
}

/**
 * @extends OpDatetimeBase
 * Extract 1-based day of month from date.
 */
class OpToDay extends OpDatetimeBase {
  /**
   * Extract year from Date.
   */
  static CONVERTER = d => d.getDate()

  /**
   * @param {ExprBase} arg How to get a value.
   */
  constructor (arg) {
    super('toDay', arg, OpToDay.CONVERTER)
  }
}

/**
 * @extends OpDatetimeBase
 * Extract day of week from date.
 */
class OpToWeekday extends OpDatetimeBase {
  /**
   * Extract year from Date.
   */
  static CONVERTER = d => d.getDay()

  /**
   * @param {ExprBase} arg How to get a value.
   */
  constructor (arg) {
    super('toWeekday', arg, OpToWeekday.CONVERTER)
  }
}

/**
 * @extends OpDatetimeBase
 * Extract hour from date.
 */
class OpToHours extends OpDatetimeBase {
  /**
   * Extract year from Date.
   */
  static CONVERTER = d => d.getHours()

  /**
   * @param {ExprBase} arg How to get a value.
   */
  constructor (arg) {
    super('toHours', arg, OpToHours.CONVERTER)
  }
}

/**
 * @extends OpDatetimeBase
 * Extract minutes from date.
 */
class OpToMinutes extends OpDatetimeBase {
  /**
   * Extract year from Date.
   */
  static CONVERTER = d => d.getMinutes()

  /**
   * @param {ExprBase} arg How to get a value.
   */
  constructor (arg) {
    super('toMinutes', arg, OpToMinutes.CONVERTER)
  }
}

/**
 * @extends OpDatetimeBase
 * Extract seconds from date.
 */
class OpToSeconds extends OpDatetimeBase {
  /**
   * Extract year from Date.
   */
  static CONVERTER = d => d.getSeconds()

  /**
   * @param {ExprBase} arg How to get a value.
   */
  constructor (arg) {
    super('toSeconds', arg, OpToSeconds.CONVERTER)
  }
}

// ----------------------------------------------------------------------

/**
 * @extends ExprBinary
 * Base class for binary arithmetic expressions.
 */
class OpArithmeticBase extends ExprBinary {
  /**
   * @param {string} species The name of the operation.
   * @param {ExprBase} left How to get the left value.
   * @param {ExprBase} right How to get the right value.
   * @param {function} operator How to combine values.
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
 * @extends OpArithmeticBase
 * Addition.
 */
class OpAdd extends OpArithmeticBase {
  /**
   * Add values.
   */
  static OPERATOR = (left, right) => left + right

  /**
   * @param {ExprBase} left How to get a value.
   * @param {ExprBase} right How to get a value.
   */
  constructor (left, right) {
    super('add', left, right, OpAdd.OPERATOR)
  }
}

/**
 * @extends OpArithmeticBase
 * Division.
 */
class OpDivide extends OpArithmeticBase {
  /**
   * Divie values.
   */
  static OPERATOR = (left, right) => left / right

  /**
   * @param {ExprBase} left How to get a value.
   * @param {ExprBase} right How to get a value.
   */
  constructor (left, right) {
    super('divide', left, right, OpDivide.OPERATOR)
  }
}

/**
 * @extends OpArithmeticBase
 * Multiplication.
 */
class OpMultiply extends OpArithmeticBase {
  /**
   * Multiply values.
   */
  static OPERATOR = (left, right) => left * right

  /**
   * @param {ExprBase} left How to get a value.
   * @param {ExprBase} right How to get a value.
   */
  constructor (left, right) {
    super('multiply', left, right, OpMultiply.OPERATOR)
  }
}

/**
 * @extends OpArithmeticBase
 * Exponentiation.
 */
class OpPower extends OpArithmeticBase {
  /**
   * Exponentiate values.
   */
  static OPERATOR = (left, right) => left ** right

  /**
   * @param {ExprBase} left How to get a value.
   * @param {ExprBase} right How to get a value.
   */
  constructor (left, right) {
    super('power', left, right, OpPower.OPERATOR)
  }
}

/**
 * @extends OpArithmeticBase
 * Remainder.
 */
class OpRemainder extends OpArithmeticBase {
  /**
   * Remainder values.
   */
  static OPERATOR = (left, right) => left % right

  /**
   * @param {ExprBase} left How to get a value.
   * @param {ExprBase} right How to get a value.
   */
  constructor (left, right) {
    super('remainder', left, right, OpRemainder.OPERATOR)
  }
}

/**
 * @extends OpArithmeticBase
 * Subtraction.
 */
class OpSubtract extends OpArithmeticBase {
  /**
   * Subtract values.
   */
  static OPERATOR = (left, right) => left - right

  /**
   * @param {ExprBase} left How to get a value.
   * @param {ExprBase} right How to get a value.
   */
  constructor (left, right) {
    super('subtract', left, right, OpSubtract.OPERATOR)
  }
}

// ----------------------------------------------------------------------

/**
 * @extends ExprBinary
 * Base class for extremum operations.
 */
class OpExtremumBase extends ExprBinary {
  /**
   * @param {string} species The name of the operation.
   * @param {ExprBase} left How to get the left value.
   * @param {ExprBase} right How to get the right value.
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
 * @extends OpExtremumBase
 * Maximum of two values.
 */
class OpMaximum extends OpExtremumBase {
  /**
   * Get maximum of values.
   */
  static OPERATOR = (left, right) => (left > right ? left : right)

  /**
   * @param {ExprBase} left How to get a value.
   * @param {ExprBase} right How to get a value.
   */
  constructor (left, right) {
    super('maximum', left, right, OpMaximum.OPERATOR)
  }
}

/**
 * @extends OpExtremumBase
 * Minimum of two values.
 */
class OpMinimum extends OpExtremumBase {
  /**
   * Get minimum of values.
   */
  static OPERATOR = (left, right) => (left < right ? left : right)

  /**
   * @param {ExprBase} left How to get a value.
   * @param {ExprBase} right How to get a value.
   */
  constructor (left, right) {
    super('minimum', left, right, OpMinimum.OPERATOR)
  }
}

// ----------------------------------------------------------------------

/**
 * @extends ExprBinary
 * Base class for binary comparison expressions.
 */
class OpCompareBase extends ExprBinary {
  /**
   * @param {string} species The name of the operation.
   * @param {ExprBase} left How to get the left value.
   * @param {ExprBase} right How to get the right value.
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
 * @extends OpCompareBase
 * Equality.
 */
class OpEqual extends OpCompareBase {
  /**
   * Test values for equality.
   */
  static OPERATOR = (left, right) => util.equal(left, right)

  /**
   * @param {ExprBase} left How to get a value.
   * @param {ExprBase} right How to get a value.
   */
  constructor (left, right) {
    super('equal', left, right, OpEqual.OPERATOR)
  }
}

/**
 * @extends OpCompareBase
 * Strictly greater than.
 */
class OpGreater extends OpCompareBase {
  /**
   * Test values for strict order.
   */
  static OPERATOR = (left, right) => (left > right)

  /**
   * @param {ExprBase} left How to get a value.
   * @param {ExprBase} right How to get a value.
   */
  constructor (left, right) {
    super('greater', left, right, OpGreater.OPERATOR)
  }
}

/**
 * @extends OpCompareBase
 * Greater than or equal.
 */
class OpGreaterEqual extends OpCompareBase {
  /**
   * Test values for order.
   */
  static OPERATOR = (left, right) => (left >= right)

  /**
   * @param {ExprBase} left How to get a value.
   * @param {ExprBase} right How to get a value.
   */
  constructor (left, right) {
    super('greaterEqual', left, right, OpGreaterEqual.OPERATOR)
  }
}

/**
 * @extends OpCompareBase
 * Strictly less than.
 */
class OpLess extends OpCompareBase {
  /**
   * Test values for strict order.
   */
  static OPERATOR = (left, right) => (left < right)

  /**
   * @param {ExprBase} left How to get a value.
   * @param {ExprBase} right How to get a value.
   */
  constructor (left, right) {
    super('less', left, right, OpLess.OPERATOR)
  }
}

/**
 * @extends OpCompareBase
 * Less than or equal.
 */
class OpLessEqual extends OpCompareBase {
  /**
   * Test values for order.
   */
  static OPERATOR = (left, right) => (left <= right)

  /**
   * @param {ExprBase} left How to get a value.
   * @param {ExprBase} right How to get a value.
   */
  constructor (left, right) {
    super('lessEqual', left, right, OpLessEqual.OPERATOR)
  }
}

/**
 * @extends OpCompareBase
 * Inequality.
 */
class OpNotEqual extends OpCompareBase {
  /**
   * Test values for inequality.
   */
  static OPERATOR = (left, right) => (!util.equal(left, right))

  /**
   * @param {ExprBase} left How to get a value.
   * @param {ExprBase} right How to get a value.
   */
  constructor (left, right) {
    super('notEqual', left, right, OpNotEqual.OPERATOR)
  }
}

// ----------------------------------------------------------------------

/**
 * @extends ExprBinary
 * Base class for binary logical expressions.
 */
class OpLogicalBase extends ExprBinary {
  /**
   * @param {string} species The name of the operation.
   * @param {ExprBase} left How to get the left value.
   * @param {ExprBase} right How to get the right value.
   */
  constructor (species, left, right) {
    super(FAMILY, species, left, right)
  }
}

/**
 * @extends OpLogicalBase
 * Logical conjunction.
 */
class OpAnd extends OpLogicalBase {
  /**
   * @param {ExprBase} left How to get a value.
   * @param {ExprBase} right How to get a value.
   */
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
 * @extends OpLogicalBase
 * Logical disjunction.
 */
class OpOr extends OpLogicalBase {
  /**
   * @param {ExprBase} left How to get a value.
   * @param {ExprBase} right How to get a value.
   */
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
 * @extends ExprTernary
 * Logical selection.
 */
class OpIfElse extends ExprTernary {
  /**
   * Constructor
   * @param {ExprBase} left How to get the condition's value.
   * @param {ExprBase} middle How to get a value if the condition is truthy.
   * @param {ExprBase} right How to get a value if the condition is not truthy.
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
 * @extends ExprBase
 * Shift values up or down a column.
 */
class OpShift extends ExprBase {
  /**
   * @param {string} column Which column to get values from.
   * @param {number} amount How much to shift (positive for up, negative for down).
   */
  constructor (column, amount) {
    util.check(column && (typeof column === 'string'),
               `Column name must be string`)
    util.check((typeof amount === 'number') && Number.isInteger(amount),
               `Shift amount must be integer`)
    super(FAMILY, 'shift')
    this.column = column
    this.amount = amount
  }

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
