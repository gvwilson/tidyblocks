'use strict'

const util = require('./util')
const {
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

  /**
   * Operate on a single row.
   * @param {object} row The row to operate on.
   * @param {number} i The row's index.
   * @return The negation of the value returned by the sub-expression.
   */
  run (row, i, numRows) {
    const value = this.arg.run(row, i, numRows)
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

  /**
   * Operate on a single row.
   * @param {object} row The row to operate on.
   * @param {number} i The row's index.
   * @return The negation of the value returned by the sub-expression.
   */
  run (row, i, numRows) {
    const value = this.arg.run(row, i, numRows)
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

  /**
   * Operate on a single row.
   * @param {object} row The row to operate on.
   * @param {number} i The row's index.
   * @return The logical negation of the value returned by the sub-expression.
   */
  run (row, i, numRows) {
    const value = this.arg.run(row, i, numRows)
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
   * @param {object} row The row to operate on.
   * @param {number} i The row's index.
   * @param {string} typeName What type to check for.
   * @returns True or false.
   */
  typeCheck (row, i, numRows, typeName) {
    const value = this.arg.run(row, i, numRows)
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

  run (row, i, numRows) {
    return this.typeCheck(row, i, numRows, 'boolean')
  }
}

/**
 * Check if a value is a datetime.
 */
class OpIsDatetime extends OpTypecheckBase {
  constructor (arg) {
    super('isDatetime', arg)
  }

  run (row, i, numRows) {
    const value = this.arg.run(row, i, numRows)
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

  run (row, i, numRows) {
    const value = this.arg.run(row, i, numRows)
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

  run (row, i, numRows) {
    return this.typeCheck(row, i, numRows, 'number')
  }
}

/**
 * Check if a value is text.
 */
class OpIsText extends OpTypecheckBase {
  constructor (arg) {
    super('isText', arg)
  }

  run (row, i, numRows) {
    return this.typeCheck(row, i, numRows, 'string')
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

  /**
   * Operate on a single row.
   * @param {object} row The row to operate on.
   * @param {number} i The row's index.
   * @return The sub-expression value as MISSING, true, or false.
   */
  run (row, i, numRows) {
    const value = this.arg.run(row, i, numRows)
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

  /**
   * Operate on a single row.
   * @param {object} row The row to operate on.
   * @param {number} i The row's index.
   * @return The sub-expression value as MISSING or a Date.
   */
  run (row, i, numRows) {
    const value = this.arg.run(row, i, numRows)
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

  /**
   * Operate on a single row.
   * @param {object} row The row to operate on.
   * @param {number} i The row's index.
   * @return The sub-expression value as a number.
   */
  run (row, i, numRows) {
    let value = this.arg.run(row, i, numRows)
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

  /**
   * Operate on a single row.
   * @param {object} row The row to operate on.
   * @param {number} i The row's index.
   * @return The sub-expression value as text.
   */
  run (row, i, numRows) {
    let value = this.arg.run(row, i, numRows)
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

  /**
   * Extract a date component.
   * @param {object} row The row to operate on.
   * @param {number} i The row index within the dataframe.
   * @returns The date component's value.
   */
  run (row, i, numRows) {
    const value = this.arg.run(row, i, numRows)
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

  /**
   * Perform a binary arithmetic operation.
   * @param {object} row The row to operate on.
   * @param {number} i The row index within the dataframe.
   * @returns The result.
   */
  run (row, i, numRows) {
    const left = this.left.run(row, i, numRows)
    util.checkNumber(left,
                     `Require number for ${this.species}`)
    const right = this.right.run(row, i, numRows)
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

  /**
   * Perform a binary comparison operation.
   * @param {object} row The row to operate on.
   * @param {number} i The row index within the dataframe.
   * @returns The result.
   */
  run (row, i, numRows) {
    const left = this.left.run(row, i, numRows)
    const right = this.right.run(row, i, numRows)
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

  /**
   * Perform short-circuit logical 'and'.
   * @param {object} row The row to operate on.
   * @param {number} i The row index within the dataframe.
   * @returns The left value if it is not truthy, otherwise the right value. The
   * right expression is only evaluated if necessary.
   */
  run (row, i, numRows) {
    const left = this.left.run(row, i, numRows)
    if (!left) {
      return left
    }
    return this.right.run(row, i, numRows)
  }
}

/**
 * Logical disjunction.
 */
class OpOr extends OpLogicalBase {
  constructor (left, right) {
    super('or', left, right)
  }

  /**
   * Perform short-circuit logical 'or'.
   * @param {object} row The row to operate on.
   * @param {number} i The row index within the dataframe.
   * @returns The left value if it is truthy, otherwise the right value. The
   * right expression is only evaluated if necessary.
   */
  run (row, i, numRows) {
    const left = this.left.run(row, i, numRows)
    if (left) {
      return left
    }
    return this.right.run(row, i, numRows)
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

  /**
   * Perform short-circuit logical 'or'.
   * @param {object} row The row to operate on.
   * @param {number} i The row index within the dataframe.
   * @returns The left value if the condition is truthy, otherwise the right
   * value. The left and right expressions are only evaluated if necessary.
   */
  run (row, i, numRows) {
    const cond = this.left.run(row, i, numRows)
    return (cond === util.MISSING)
      ? util.MISSING
      : (cond ? this.middle.run(row, i, numRows) : this.right.run(row, i, numRows))
  }
}

// ----------------------------------------------------------------------

module.exports = {
  FAMILY: FAMILY,
  add: OpAdd,
  and: OpAnd,
  divide: OpDivide,
  equal: OpEqual,
  greater: OpGreater,
  greaterEqual: OpGreaterEqual,
  ifElse: OpIfElse,
  less: OpLess,
  lessEqual: OpLessEqual,
  multiply: OpMultiply,
  negate: OpNegate,
  abs: OpAbs,
  not: OpNot,
  notEqual: OpNotEqual,
  or: OpOr,
  power: OpPower,
  remainder: OpRemainder,
  subtract: OpSubtract,
  isLogical: OpIsLogical,
  isDatetime: OpIsDatetime,
  isMissing: OpIsMissing,
  isNumber: OpIsNumber,
  isText: OpIsText,
  toLogical: OpToLogical,
  toDatetime: OpToDatetime,
  toNumber: OpToNumber,
  toText: OpToText,
  toYear: OpToYear,
  toMonth: OpToMonth,
  toDay: OpToDay,
  toWeekday: OpToWeekday,
  toHours: OpToHours,
  toMinutes: OpToMinutes,
  toSeconds: OpToSeconds
}
