'use strict'

const util = require('./util')
const {
  ExprUnary,
  ExprBinary,
  ExprTernary
} = require('./expr')

const FAMILY = '@op'

// ----------------------------------------------------------------------

/**
 * Negations.
 */
class OpNegationBase extends ExprUnary {
  constructor (species, arg) {
    super(FAMILY, species, arg)
  }
}

/**
 * Arithmetic negation.
 * @param {expr} arg How to get the value.
 * @returns The negation.
 */
class OpNegate extends OpNegationBase {
  constructor (arg) {
    super('negate', arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    util.checkNumber(value,
                     `Require number for ${this.name}`)
    return (value === util.MISSING) ? util.MISSING : util.safeValue(-value)
  }
}

/**
 * Logical negation.
 * @param {expr} arg How to get the value.
 * @returns The negation.
 */
class OpNot extends OpNegationBase {
  constructor (arg) {
    super('not', arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    return (value === util.MISSING) ? util.MISSING : !util.makeBoolean(value)
  }
}

// ----------------------------------------------------------------------

/**
 * Unary type-checking expressions.
 */
class OpTypecheckBase extends ExprUnary {
  constructor (species, arg) {
    super(FAMILY, species, arg)
  }

  typeCheck (row, i, typeName) {
    const value = this.arg.run(row, i)
    return (value === util.MISSING)
      ? util.MISSING
      : (typeof value === typeName)
  }
}

/**
 * Check if a value is Boolean.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class OpIsLogical extends OpTypecheckBase {
  constructor (arg) {
    super('isLogical', arg)
  }

  run (row, i) {
    return this.typeCheck(row, i, 'boolean')
  }
}

/**
 * Check if a value is a datetime.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class OpIsDatetime extends OpTypecheckBase {
  constructor (arg) {
    super('isDatetime', arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    return (value === util.MISSING) ? util.MISSING : (value instanceof Date)
  }
}

/**
 * Check if a value is missing.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class OpIsMissing extends OpTypecheckBase {
  constructor (arg) {
    super('isMissing', arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    return value === util.MISSING
  }
}

/**
 * Check if a value is numeric.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class OpIsNumber extends OpTypecheckBase {
  constructor (arg) {
    super('isNumber', arg)
  }

  run (row, i) {
    return this.typeCheck(row, i, 'number')
  }
}

/**
 * Check if a value is text.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class OpIsText extends OpTypecheckBase {
  constructor (arg) {
    super('isText', arg)
  }

  run (row, i) {
    return this.typeCheck(row, i, 'string')
  }
}

// ----------------------------------------------------------------------

/**
 * Unary type conversion expressions.
 */
class OpConvertBase extends ExprUnary {
  constructor (species, arg) {
    super(FAMILY, species, arg)
  }
}

/**
 * Convert a value to Boolean.
 * @param {expr} arg How to get the value.
 * @returns Converted value.
 */
class OpToLogical extends OpConvertBase {
  constructor (arg) {
    super('toLogical', arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    return (value === util.MISSING) ? util.MISSING : util.makeBoolean(value)
  }
}

/**
 * Convert a value to a datetime.
 * @param {expr} arg How to get the value.
 * @returns Converted value.
 */
class OpToDatetime extends OpConvertBase {
  constructor (arg) {
    super('toDatetime', arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    if (value === util.MISSING) {
      return util.MISSING
    }
    let result = new Date(value)
    if (result.toString() === 'Invalid Date') {
      result = util.MISSING
    }
    return result
  }
}

/**
 * Convert a value to a number.
 * @param {expr} arg How to get the value.
 * @returns Converted value.
 */
class OpToNumber extends OpConvertBase {
  constructor (arg) {
    super('toNumber', arg)
  }

  run (row, i) {
    let value = this.arg.run(row, i)
    if (typeof value === 'boolean') {
      value = value ? 1 : 0
    }
    else if (value instanceof Date) {
      value = value.getTime()
    }
    else if (typeof value === 'string') {
      value = parseFloat(value)
      if (Number.isNaN(value)) {
        value = util.MISSING
      }
    }
    return value
  }
}

/**
 * Convert a value to a string.
 * @param {expr} arg How to get the value.
 * @returns Converted value.
 */
class OpToString extends OpConvertBase {
  constructor (arg) {
    super('toString', arg)
  }

  run (row, i) {
    let value = this.arg.run(row, i)
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
  constructor (species, arg) {
    super(FAMILY, species, arg)
  }

  dateValue (row, i, func) {
    const value = this.arg.run(row, i)
    if (value === util.MISSING) {
      return util.MISSING
    }
    util.check(value instanceof Date,
               `Require date for ${this.species}`)
    return func(value)
  }
}

/**
 * Extract year from date.
 * @param {expr} arg How to get the value.
 * @returns Month.
 */
class OpToYear extends OpDatetimeBase {
  constructor (arg) {
    super('toYear', arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getFullYear())
  }
}

/**
 * Extract month from date.
 * @param {expr} arg How to get the value.
 * @returns Month.
 */
class OpToMonth extends OpDatetimeBase {
  constructor (arg) {
    super('toMonth', arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getMonth() + 1)
  }
}

/**
 * Extract day of month from date.
 * @param {expr} arg How to get the value.
 * @returns Day.
 */
class OpToDay extends OpDatetimeBase {
  constructor (arg) {
    super('toDay', arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getDate())
  }
}

/**
 * Extract day of week from date.
 * @param {expr} arg How to get the value.
 * @returns Day.
 */
class OpToWeekday extends OpDatetimeBase {
  constructor (arg) {
    super('toWeekday', arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getDay())
  }
}

/**
 * Extract hour from date.
 * @param {expr} arg How to get the value.
 * @returns Hour.
 */
class OpToHours extends OpDatetimeBase {
  constructor (arg) {
    super('toHours', arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getHours())
  }
}

/**
 * Extract minutes from date.
 * @param {expr} arg How to get the value.
 * @returns Minutes.
 */
class OpToMinutes extends OpDatetimeBase {
  constructor (arg) {
    super('toMinutes', arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getMinutes())
  }
}

/**
 * Extract seconds from date.
 * @param {expr} arg How to get the value.
 * @returns Seconds.
 */
class OpToSeconds extends OpDatetimeBase {
  constructor (arg) {
    super('toSeconds', arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getSeconds())
  }
}

// ----------------------------------------------------------------------

/**
 * Binary arithmetic expressions.
 */
class OpArithmeticBase extends ExprBinary {
  constructor (species, left, right) {
    super(FAMILY, species, left, right)
  }

  arithmetic (row, i, func) {
    const left = this.left.run(row, i)
    util.checkNumber(left,
                     `Require number for ${this.species}`)
    const right = this.right.run(row, i)
    util.checkNumber(right,
                     `Require number for ${this.species}`)
    return ((left === util.MISSING) || (right === util.MISSING))
      ? util.MISSING
      : util.safeValue(func(left, right))
  }
}

/**
 * Addition.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The sum.
 */
class OpAdd extends OpArithmeticBase {
  constructor (left, right) {
    super('add', left, right)
  }

  run (row, i) {
    return this.arithmetic(row, i, (left, right) => left + right)
  }
}

/**
 * Division.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The quotient.
 */
class OpDivide extends OpArithmeticBase {
  constructor (left, right) {
    super('divide', left, right)
  }

  run (row, i) {
    return this.arithmetic(row, i, (left, right) => left / right)
  }
}

/**
 * Multiplication.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The product.
 */
class OpMultiply extends OpArithmeticBase {
  constructor (left, right) {
    super('multiply', left, right)
  }

  run (row, i) {
    return this.arithmetic(row, i, (left, right) => left * right)
  }
}

/**
 * Exponentiation.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The power.
 */
class OpPower extends OpArithmeticBase {
  constructor (left, right) {
    super('power', left, right)
  }

  run (row, i) {
    return this.arithmetic(row, i, (left, right) => left ** right)
  }
}

/**
 * Remainder.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The remainder.
 */
class OpRemainder extends OpArithmeticBase {
  constructor (left, right) {
    super('remainder', left, right)
  }

  run (row, i) {
    return this.arithmetic(row, i, (left, right) => left % right)
  }
}

/**
 * Subtraction.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The difference.
 */
class OpSubtract extends OpArithmeticBase {
  constructor (left, right) {
    super('subtract', left, right)
  }

  run (row, i) {
    return this.arithmetic(row, i, (left, right) => left - right)
  }
}

// ----------------------------------------------------------------------

/**
 * Binary comparison expressions.
 */
class OpCompareBase extends ExprBinary {
  constructor (species, left, right) {
    super(FAMILY, species, left, right)
  }

  comparison (row, i, func) {
    const left = this.left.run(row, i)
    const right = this.right.run(row, i)
    util.checkTypeEqual(left, right,
                        `Require equal types for ${this.species}`)
    return ((left === util.MISSING) || (right === util.MISSING))
      ? util.MISSING
      : func(left, right)
  }
}

/**
 * Equality.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class OpEqual extends OpCompareBase {
  constructor (left, right) {
    super('equal', left, right)
  }

  run (row, i) {
    return this.comparison(row, i, (left, right) => util.equal(left, right))
  }
}

/**
 * Strictly greater than.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class OpGreater extends OpCompareBase {
  constructor (left, right) {
    super('greater', left, right)
  }

  run (row, i) {
    return this.comparison(row, i, (left, right) => (left > right))
  }
}

/**
 * Greater than or equal.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class OpGreaterEqual extends OpCompareBase {
  constructor (left, right) {
    super('greaterEqual', left, right)
  }

  run (row, i) {
    return this.comparison(row, i, (left, right) => (left >= right))
  }
}

/**
 * Strictly less than.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class OpLess extends OpCompareBase {
  constructor (left, right) {
    super('less', left, right)
  }

  run (row, i) {
    return this.comparison(row, i, (left, right) => (left < right))
  }
}

/**
 * Less than or equal.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class OpLessEqual extends OpCompareBase {
  constructor (left, right) {
    super('lessEqual', left, right)
  }

  run (row, i) {
    return this.comparison(row, i, (left, right) => (left <= right))
  }
}

/**
 * Inequality.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class OpNotEqual extends OpCompareBase {
  constructor (left, right) {
    super('notEqual', left, right)
  }

  run (row, i) {
    return this.comparison(row, i, (left, right) => (!util.equal(left, right)))
  }
}

// ----------------------------------------------------------------------

/**
 * Binary logical expressions.
 */
class OpLogicalBase extends ExprBinary {
  constructor (species, left, right) {
    super(FAMILY, species, left, right)
  }
}

/**
 * Logical conjunction.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The conjunction using short-circuit evaluation.
 */
class OpAnd extends OpLogicalBase {
  constructor (left, right) {
    super('and', left, right)
  }

  run (row, i) {
    const left = this.left.run(row, i)
    if (!left) {
      return left
    }
    return this.right.run(row, i)
  }
}

/**
 * Logical disjunction.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The disjunction using short-circuit evaluation.
 */
class OpOr extends OpLogicalBase {
  constructor (left, right) {
    super('or', left, right)
  }

  run (row, i) {
    const left = this.left.run(row, i)
    if (left) {
      return left
    }
    return this.right.run(row, i)
  }
}

// ----------------------------------------------------------------------

/**
 * Logical selection.
 * @param {expr} left How to get the left value.
 * @param {expr} middle How to get the middle value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class OpIfElse extends ExprTernary {
  constructor (left, middle, right) {
    super(FAMILY, 'ifElse', left, middle, right)
  }

  run (row, i) {
    const cond = this.left.run(row, i)
    return (cond === util.MISSING)
      ? util.MISSING
      : (cond ? this.middle.run(row, i) : this.right.run(row, i))
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
  toString: OpToString,
  toYear: OpToYear,
  toMonth: OpToMonth,
  toDay: OpToDay,
  toWeekday: OpToWeekday,
  toHours: OpToHours,
  toMinutes: OpToMinutes,
  toSeconds: OpToSeconds
}
