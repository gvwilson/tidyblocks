'use strict'

const util = require('./util')
const MISSING = util.MISSING

/**
 * Represent an expression as an object. Derived classes must provide `run(row, i)` and `toJSON()`.
 * @param {string} kind What kind of expression this is.
 */
class ExprBase {
  constructor (kind) {
    this.kind = kind
  }

  safeValue (value) {
    return isFinite(value) ? value : MISSING
  }
}

// ----------------------------------------------------------------------

/**
 * Generic nullary expression (never instantiated directly).
 */
class ExprNullary extends ExprBase {
  constructor(kind, value) {
    super(kind)
    this.value = value
  }

  equal (other) {
    return (other instanceof ExprNullary) &&
      (this.kind === other.kind) &&
      util.equal(this.value, other.value)
  }

  toJSON () {
    return ['@expr', this.kind, this.value]
  }

  static MakeBlank () {
    return new ExprConstant(false)
  }
}
ExprNullary.OPTIONS = ['constant', 'column']

/**
 * Generic unary expressions (never instantiated directly).
 */
class ExprUnary extends ExprBase {
  constructor (kind, arg) {
    util.check(arg instanceof ExprBase,
              `Require expression as child`)
    super(kind)
    this.arg = arg
  }

  equal (other) {
    return (other instanceof ExprUnary) &&
      (this.kind === other.kind) &&
      this.arg.equal(other.arg)
  }

  toJSON () {
    return ['@expr', this.kind, this.arg.toJSON()]
  }
}

/**
 * Binary expressions.
 */
class ExprBinary extends ExprBase {
  constructor (kind, left, right) {
    util.check(left instanceof ExprBase,
              `Require expression as left child`)
    util.check(right instanceof ExprBase,
              `Require expression as right child`)
    super(kind)
    this.left = left
    this.right = right
  }

  equal (other) {
    return (other instanceof ExprBinary) &&
      (this.kind === other.kind) &&
      this.left.equal(other.left) &&
      this.right.equal(other.right)
  }

  toJSON () {
    return ['@expr', this.kind, this.left.toJSON(), this.right.toJSON()]
  }
}

/**
 * Ternary expressions.
 */
class ExprTernary extends ExprBase {
  constructor (kind, left, middle, right) {
    util.check(left instanceof ExprBase,
               `Require expression as left child`)
    util.check(middle instanceof ExprBase,
              `Require expression as middle child`)
    util.check(right instanceof ExprBase,
              `Require expression as right child`)
    super(kind)
    this.left = left
    this.middle = middle
    this.right = right
  }

  equal (other) {
    return (other instanceof ExprTernary) &&
      (this.kind === other.kind) &&
      this.left.equal(other.left) &&
      this.middle.equal(other.middle) &&
      this.right.equal(other.right)
  }

  toJSON () {
    return ['@expr', this.kind, this.left.toJSON(),
            this.middle.toJSON(), this.right.toJSON()]
  }

  static MakeBlank () {
    const placeholder = new ExprConstant(false)
    const result = new ExprIfElse(placeholder, placeholder, placeholder)
    result.left = null
    result.middle = null
    result.right = null
    return result
  }
}

// ----------------------------------------------------------------------

/**
 * Constant value.
 * @param {any} value The value to return.
 * @returns The value
 */
class ExprConstant extends ExprNullary {
  constructor (value) {
    super(ExprConstant.KIND, value)
  }

  run (row, i) {
    return this.value
  }

  static Fields () {
    return [['selectKind', ExprNullary.OPTIONS, ExprConstant.KIND],
            ['text', 'value']]
  }
}
ExprConstant.KIND = 'constant'

/**
 * Column value.
 * @param {string} column The column name.
 * @returns The value
 */
class ExprColumn extends ExprNullary {
  constructor (name) {
    util.check(name && (typeof name === 'string'),
               `Column name must be string`)
    super(ExprColumn.KIND, name)
  }

  run (row, i) {
    util.check(typeof row === 'object',
               `Row must be object`)
    util.check(this.value in row,
               `${this.name} not in row`)
    return row[this.value]
  }

  static Fields () {
    return [['selectKind', ExprNullary.OPTIONS, ExprColumn.KIND],
            ['text', 'name']]
  }
}
ExprColumn.KIND = 'column'

// ----------------------------------------------------------------------

/**
 * Negations.
 */
class ExprNegation extends ExprUnary {
  constructor (kind, arg) {
    super(kind, arg)
  }

  static MakeBlank () {
    const placeholder = new ExprConstant(false)
    const result = new ExprNegate(placeholder)
    result.arg = null
    return result
  }

  static _Fields (kind) {
    return [['selectKind', ExprNegation.OPTIONS, kind],
            ['expr', 'arg']]
  }
}
ExprNegation.OPTIONS = [['-', 'negate'], 'not']

/**
 * Arithmetic negation.
 * @param {expr} arg How to get the value.
 * @returns The negation.
 */
class ExprNegate extends ExprNegation {
  constructor (arg) {
    super(ExprNegate.KIND, arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    util.checkNumber(value,
                     `Require number for ${this.name}`)
    return (value === MISSING) ? MISSING : this.safeValue(-value)
  }

  static Fields () {
    return ExprNegation._Fields(ExprNegate.KIND)
  }
}
ExprNegate.KIND = 'negate'

/**
 * Logical negation.
 * @param {expr} arg How to get the value.
 * @returns The negation.
 */
class ExprNot extends ExprNegation {
  constructor (arg) {
    super(ExprNot.KIND, arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    return (value === MISSING) ? MISSING : ((!value) ? true : false)
  }

  static Fields () {
    return ExprNegation._Fields(ExprNot.KIND)
  }
}
ExprNot.KIND = 'not'

// ----------------------------------------------------------------------

/**
 * Unary type-checking expressions.
 */
class ExprTypecheck extends ExprUnary {
  constructor (kind, arg) {
    super(kind, arg)
  }

  typeCheck (row, i, typeName) {
    const value = this.arg.run(row, i)
    return (value === MISSING)
      ? MISSING
      : (typeof value === typeName)
  }

  static MakeBlank () {
    const placeholder = new ExprConstant(false)
    const result = new ExprIsBool(placeholder)
    result.arg = null
    return result
  }

  static _Fields (kind) {
    return [['selectKind', ExprTypecheck.OPTIONS, kind],
            ['expr', 'arg']]
  }
}
ExprTypecheck.OPTIONS = ['isBool', 'isDatetime', 'isMissing',
                         'isNumber', 'isString']

/**
 * Check if a value is Boolean.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class ExprIsBool extends ExprTypecheck {
  constructor (arg) {
    super(ExprIsBool.KIND, arg)
  }

  run (row, i) {
    return this.typeCheck(row, i, 'boolean')
  }

  static Fields () {
    return ExprTypecheck._Fields(ExprIsBool.KIND)
  }
}
ExprIsBool.KIND = 'isBool'

/**
 * Check if a value is a datetime.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class ExprIsDatetime extends ExprTypecheck {
  constructor (arg) {
    super(ExprIsDatetime.KIND, arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    return (value === MISSING) ? MISSING : (value instanceof Date)
  }

  static Fields () {
    return ExprTypecheck._Fields(ExprIsDatetime.KIND)
  }
}
ExprIsDatetime.KIND = 'isDatetime'

/**
 * Check if a value is missing.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class ExprIsMissing extends ExprTypecheck {
  constructor (arg) {
    super(ExprIsMissing.KIND, arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    return value === MISSING
  }

  static Fields () {
    return ExprTypecheck._Fields(ExprIsMissing.KIND)
  }
}
ExprIsMissing.KIND = 'isMissing'

/**
 * Check if a value is numeric.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class ExprIsNumber extends ExprTypecheck {
  constructor (arg) {
    super(ExprIsNumber.KIND, arg)
  }

  run (row, i) {
    return this.typeCheck(row, i, 'number')
  }

  static Fields () {
    return ExprTypecheck._Fields(ExprIsNumber.KIND)
  }
}
ExprIsNumber.KIND = 'isNumber'

/**
 * Check if a value is a string.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class ExprIsString extends ExprTypecheck {
  constructor (arg) {
    super(ExprIsString.KIND, arg)
  }

  run (row, i) {
    return this.typeCheck(row, i, 'string')
  }

  static Fields () {
    return ExprTypecheck._Fields(ExprIsString.KIND)
  }
}
ExprIsString.KIND = 'isString'

// ----------------------------------------------------------------------

/**
 * Unary type conversion expressions.
 */
class ExprConvert extends ExprUnary {
  constructor (kind, arg) {
    super(kind, arg)
  }

  static MakeBlank () {
    const placeholder = new ExprConstant(false)
    const result = new ExprToBool(placeholder)
    result.arg = null
    return result
  }

  static _Fields (kind) {
    return [['selectKind', ExprConvert.OPTIONS, kind],
            ['expr', 'arg']]
  }
}
ExprConvert.OPTIONS = ['toBool', 'toDatetime', 'toNumber', 'toString']

/**
 * Convert a value to Boolean.
 * @param {expr} arg How to get the value.
 * @returns Converted value.
 */
class ExprToBool extends ExprConvert {
  constructor (arg) {
    super(ExprToBool.KIND, arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    return (value === MISSING)
      ? MISSING
      : (value ? true : false)
  }

  static Fields () {
    return ExprConvert._Fields(ExprToBool.KIND)
  }
}
ExprToBool.KIND = 'toBool'

/**
 * Convert a value to a datetime.
 * @param {expr} arg How to get the value.
 * @returns Converted value.
 */
class ExprToDatetime extends ExprConvert {
  constructor (arg) {
    super(ExprToDatetime.KIND, arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    if (value === MISSING) {
      return MISSING
    }
    let result = new Date(value)
    if ((typeof result === 'object') &&
        (result.toString() === 'Invalid Date')) {
      result = MISSING
    }
    return result
  }

  static Fields () {
    return ExprConvert._Fields(ExprToDatetime.KIND)
  }
}
ExprToDatetime.KIND = 'toDatetime'

/**
 * Convert a value to a number.
 * @param {expr} arg How to get the value.
 * @returns Converted value.
 */
class ExprToNumber extends ExprConvert {
  constructor (arg) {
    super(ExprToNumber.KIND, arg)
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
        value = MISSING
      }
    }
    return value
  }

  static Fields () {
    return ExprConvert._Fields(ExprToNumber.KIND)
  }
}
ExprToNumber.KIND = 'toNumber'

/**
 * Convert a value to a string.
 * @param {expr} arg How to get the value.
 * @returns Converted value.
 */
class ExprToString extends ExprConvert {
  constructor (arg) {
    super(ExprToString.KIND, arg)
  }

  run (row, i) {
    let value = this.arg.run(row, i)
    if (value === MISSING) {
      return MISSING
    }
    if (typeof value !== 'string') {
      value = `${value}`
    }
    return value
  }

  static Fields () {
    return ExprConvert._Fields(ExprToString.KIND)
  }
}
ExprToString.KIND = 'toString'

// ----------------------------------------------------------------------

/**
 * Unary datetime expressions.
 */
class ExprDatetime extends ExprUnary {
  constructor (kind, arg) {
    super(kind, arg)
  }

  dateValue (row, i, func) {
    const value = this.arg.run(row, i)
    if (value === MISSING) {
      return MISSING
    }
    util.check(value instanceof Date,
               `Require date for ${this.kind}`)
    return func(value)
  }

  static MakeBlank () {
    const placeholder = new ExprConstant(false)
    const result = new ExprToYear(placeholder)
    result.arg = null
    return result
  }

  static _Fields (kind) {
    return [['selectKind', ExprDatetime.OPTIONS, kind],
            ['expr', 'arg']]
  }
}
ExprDatetime.OPTIONS = ['toYear', 'toMonth', 'toDay', 'toWeekday',
                        'toHours', 'toMinutes', 'toSeconds']

/**
 * Extract year from date.
 * @param {expr} arg How to get the value.
 * @returns Month.
 */
class ExprToYear extends ExprDatetime {
  constructor (arg) {
    super(ExprToYear.KIND, arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getFullYear())
  }

  static Fields () {
    return ExprDatetime._Fields(ExprToYear.KIND)
  }
}
ExprToYear.KIND = 'toYear'

/**
 * Extract month from date.
 * @param {expr} arg How to get the value.
 * @returns Month.
 */
class ExprToMonth extends ExprDatetime {
  constructor (arg) {
    super(ExprToMonth.KIND, arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getMonth() + 1)
  }

  static Fields () {
    return ExprDatetime._Fields(ExprToMonth.KIND)
  }
}
ExprToMonth.KIND = 'toMonth'

/**
 * Extract day of month from date.
 * @param {expr} arg How to get the value.
 * @returns Day.
 */
class ExprToDay extends ExprDatetime {
  constructor (arg) {
    super(ExprToDay.KIND, arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getDate())
  }

  static Fields () {
    return ExprDatetime._Fields(ExprToDay.KIND)
  }
}
ExprToDay.KIND = 'toDay'

/**
 * Extract day of week from date.
 * @param {expr} arg How to get the value.
 * @returns Day.
 */
class ExprToWeekday extends ExprDatetime {
  constructor (arg) {
    super(ExprToWeekday.KIND, arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getDay())
  }

  static Fields () {
    return ExprDatetime._Fields(ExprToWeekday.KIND)
  }
}
ExprToWeekday.KIND = 'toWeekday'

/**
 * Extract hour from date.
 * @param {expr} arg How to get the value.
 * @returns Hour.
 */
class ExprToHours extends ExprDatetime {
  constructor (arg) {
    super(ExprToHours.KIND, arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getHours())
  }

  static Fields () {
    return ExprDatetime._Fields(ExprToHours.KIND)
  }
}
ExprToHours.KIND = 'toHours'

/**
 * Extract minutes from date.
 * @param {expr} arg How to get the value.
 * @returns Minutes.
 */
class ExprToMinutes extends ExprDatetime {
  constructor (arg) {
    super(ExprToMinutes.KIND, arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getMinutes())
  }

  static Fields () {
    return ExprDatetime._Fields(ExprToMinutes.KIND)
  }
}
ExprToMinutes.KIND = 'toMinutes'

/**
 * Extract seconds from date.
 * @param {expr} arg How to get the value.
 * @returns Seconds.
 */
class ExprToSeconds extends ExprDatetime {
  constructor (arg) {
    super(ExprToSeconds.KIND, arg)
  }

  run (row, i) { 
    return this.dateValue(row, i, d => d.getSeconds())
  }

  static Fields () {
    return ExprDatetime._Fields(ExprToSeconds.KIND)
  }
}
ExprToSeconds.KIND = 'toSeconds'

// ----------------------------------------------------------------------

/**
 * Binary arithmetic expressions.
 */
class ExprArithmetic extends ExprBinary {
  constructor (kind, left, right) {
    super(kind, left, right)
  }

  arithmetic (row, i, func) {
    const left = this.left.run(row, i)
    util.checkNumber(left,
                     `Require number for ${this.kind}`)
    const right = this.right.run(row, i)
    util.checkNumber(right,
                     `Require number for ${this.kind}`)
    return ((left === MISSING) || (right === MISSING))
      ? MISSING
      : this.safeValue(func(left, right))
  }

  static MakeBlank () {
    const placeholder = new ExprConstant(false)
    const result = new ExprAdd(placeholder, placeholder)
    result.left = null
    result.right = null
    return result
  }

  static _Fields (kind) {
    return [['expr', 'left'],
            ['selectKind', ExprArithmetic.OPTIONS, kind],
            ['expr', 'right']]
  }
}
ExprArithmetic.OPTIONS = [['+', 'add'], ['-', 'subtract'],
                          ['*', 'multiply'], ['/', 'divide'],
                          ['%', 'remainder'], ['**', 'power']]

/**
 * Addition.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The sum.
 */
class ExprAdd extends ExprArithmetic {
  constructor (left, right) {
    super(ExprAdd.KIND, left, right)
  }

  run (row, i) {
    return this.arithmetic(row, i, (left, right) => left + right)
  }

  static Fields () {
    return ExprArithmetic._Fields(ExprAdd.KIND)
  }
}
ExprAdd.KIND = 'add'

/**
 * Division.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The quotient.
 */
class ExprDivide extends ExprArithmetic {
  constructor (left, right) {
    super(ExprDivide.KIND, left, right)
  }

  run (row, i) {
    return this.arithmetic(row, i, (left, right) => left / right)
  }

  static Fields () {
    return ExprArithmetic._Fields(ExprDivide.KIND)
  }
}
ExprDivide.KIND = 'divide'

/**
 * Multiplication.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The product.
 */
class ExprMultiply extends ExprArithmetic {
  constructor (left, right) {
    super(ExprMultiply.KIND, left, right)
  }

  run (row, i) {
    return this.arithmetic(row, i, (left, right) => left * right)
  }

  static Fields () {
    return ExprArithmetic._Fields(ExprMultiply.KIND)
  }
}
ExprMultiply.KIND = 'multiply'

/**
 * Exponentiation.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The power.
 */
class ExprPower extends ExprArithmetic {
  constructor (left, right) {
    super(ExprPower.KIND, left, right)
  }

  run (row, i) {
    return this.arithmetic(row, i, (left, right) => left ** right)
  }

  static Fields () {
    return ExprArithmetic._Fields(ExprPower.KIND)
  }
}
ExprPower.KIND = 'power'

/**
 * Remainder.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The remainder.
 */
class ExprRemainder extends ExprArithmetic {
  constructor (left, right) {
    super(ExprRemainder.KIND, left, right)
  }

  run (row, i) {
    return this.arithmetic(row, i, (left, right) => left % right)
  }

  static Fields () {
    return ExprArithmetic._Fields(ExprRemainder.KIND)
  }
}
ExprRemainder.KIND = 'remainder'

/**
 * Subtraction.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The difference.
 */
class ExprSubtract extends ExprArithmetic {
  constructor (left, right) {
    super(ExprSubtract.KIND, left, right)
  }

  run (row, i) {
    return this.arithmetic(row, i, (left, right) => left - right)
  }

  static Fields () {
    return ExprArithmetic._Fields(ExprSubtract.KIND)
  }
}
ExprSubtract.KIND = 'subtract'

// ----------------------------------------------------------------------

/**
 * Binary comparison expressions.
 */
class ExprCompare extends ExprBinary {
  constructor (kind, left, right) {
    super(kind, left, right)
  }

  comparison (row, i, func) {
    const left = this.left.run(row, i)
    const right = this.right.run(row, i)
    util.checkTypeEqual(left, right,
                        `Require equal types for ${this.kind}`)
    return ((left === MISSING) || (right === MISSING))
      ? MISSING
      : func(left, right)
  }

  static MakeBlank () {
    const placeholder = new ExprConstant(false)
    const result = new ExprEqual(placeholder, placeholder)
    result.left = null
    result.right = null
    return result
  }

  static _Fields (kind) {
    return [['expr', 'left'],
            ['selectKind', ExprCompare.OPTIONS, kind],
            ['expr', 'right']]
  }
}
ExprCompare.OPTIONS = [['==', 'equal'], ['!=', 'notEqual'],
                       ['&gt;', 'greater'], ['&gt;=', 'greaterEqual'],
                       ['&lt;=', 'lessEqual'], ['&lt;', 'less']]

/**
 * Equality.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class ExprEqual extends ExprCompare {
  constructor (left, right) {
    super(ExprEqual.KIND, left, right)
  }

  run (row, i) {
    return this.comparison(row, i, (left, right) => util.equal(left, right))
  }

  static Fields () {
    return ExprCompare._Fields(ExprEqual.KIND)
  }
}
ExprEqual.KIND = 'equal'

/**
 * Strictly greater than.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class ExprGreater extends ExprCompare {
  constructor (left, right) {
    super(ExprGreater.KIND, left, right)
  }

  run (row, i) {
    return this.comparison(row, i, (left, right) => (left > right))
  }

  static Fields () {
    return ExprCompare._Fields(ExprGreater.KIND)
  }
}
ExprGreater.KIND = 'greater'

/**
 * Greater than or equal.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class ExprGreaterEqual extends ExprCompare {
  constructor (left, right) {
    super(ExprGreaterEqual.KIND, left, right)
  }

  run (row, i) {
    return this.comparison(row, i, (left, right) => (left >= right))
  }

  static Fields () {
    return ExprCompare._Fields(ExprGreaterEqual.KIND)
  }
}
ExprGreaterEqual.KIND = 'greaterEqual'

/**
 * Strictly less than.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class ExprLess extends ExprCompare {
  constructor (left, right) {
    super(ExprLess.KIND, left, right)
  }

  run (row, i) {
    return this.comparison(row, i, (left, right) => (left < right))
  }

  static Fields () {
    return ExprCompare._Fields(ExprLess.KIND)
  }
}
ExprLess.KIND = 'less'

/**
 * Less than or equal.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class ExprLessEqual extends ExprCompare {
  constructor (left, right) {
    super(ExprLessEqual.KIND, left, right)
  }

  run (row, i) {
    return this.comparison(row, i, (left, right) => (left <= right))
  }

  static Fields () {
    return ExprCompare._Fields(ExprLessEqual.KIND)
  }
}
ExprLessEqual.KIND = 'lessEqual'

/**
 * Inequality.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class ExprNotEqual extends ExprCompare {
  constructor (left, right) {
    super(ExprNotEqual.KIND, left, right)
  }

  run (row, i) {
    return this.comparison(row, i, (left, right) => (!util.equal(left, right)))
  }

  static Fields () {
    return ExprCompare._Fields(ExprNotEqual.KIND)
  }
}
ExprNotEqual.KIND = 'notEqual'

// ----------------------------------------------------------------------

/**
 * Binary logical expressions.
 */
class ExprLogical extends ExprBinary {
  constructor (kind, left, right) {
    super(kind, left, right)
  }

  static MakeBlank () {
    const placeholder = new ExprConstant(false)
    const result = new ExprAnd(placeholder, placeholder)
    result.left = null
    result.right = null
    return result
  }

  static _Fields (kind) {
    return [['expr', 'left'],
            ['selectKind', ExprLogical.OPTIONS, kind],
            ['expr', 'right']]
  }
}
ExprLogical.OPTIONS = ['and', 'or']

/**
 * Logical conjunction.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The conjunction using short-circuit evaluation.
 */
class ExprAnd extends ExprLogical {
  constructor (left, right) {
    super(ExprAnd.KIND, left, right)
  }

  run (row, i) {
    const left = this.left.run(row, i)
    if (!left) {
      return left
    }
    return this.right.run(row, i)
  }

  static Fields () {
    return ExprLogical._Fields(ExprAnd.KIND)
  }
}
ExprAnd.KIND = 'and'

/**
 * Logical disjunction.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The disjunction using short-circuit evaluation.
 */
class ExprOr extends ExprLogical {
  constructor (left, right) {
    super(ExprOr.KIND, left, right)
  }

  run (row, i) {
    const left = this.left.run(row, i)
    if (left) {
      return left
    }
    return this.right.run(row, i)
  }

  static Fields () {
    return ExprLogical._Fields(ExprOr.KIND)
  }
}
ExprOr.KIND = 'or'

// ----------------------------------------------------------------------

/**
 * Logical selection.
 * @param {expr} left How to get the left value.
 * @param {expr} middle How to get the middle value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class ExprIfElse extends ExprTernary {
  constructor (left, middle, right) {
    super(ExprIfElse.KIND, left, middle, right)
  }

  run (row, i) {
    const cond = this.left.run(row, i)
    return (cond === MISSING)
      ? MISSING
      : (cond ? this.middle.run(row, i) : this.right.run(row, i))
  }

  static Fields () {
    return [['label', 'if'],
            ['expr', 'left'],
            ['label', 'then'],
            ['expr', 'middle'],
            ['label', 'else'],
            ['expr', 'right']]
  }
}
ExprIfElse.KIND = 'ifElse'

// ----------------------------------------------------------------------

/**
 * Lookup table of everything exported from this file.
 */
const Expr = {
  /**
   * Build expression tree from JSON representation.
   * @param {JSON} json List-of-lists.
   * @returns Expression tree.
   */
  fromJSON: (json) => {
    // Values, empty arrays, and unmarked arrays are themselves.
    if (!Array.isArray(json) ||
        (json.length === 0) ||
        (typeof json[0] !== 'string') ||
        (json[0].length === 0) ||
        (json[0][0] != '@')) {
      return json
    }
    util.check((json.length > 1) &&
               (json[0] === '@expr') &&
               (json[1] in Expr),
               `Require indicator of known expression kind`)
    const kind = json[1]
    const args = json.slice(2).map(p => Expr.fromJSON(p))
    return new Expr[kind](...args)
  },

  /**
   * Build expression tree from HTML representation.
   * @param {DOM} node Current node in recursive nesting.
   * @return Expression tree.
   */
  fromHTML: (factory, dom) => {
    const children = factory.getChildren(dom)
          .map(td => td.firstChild)
          .map(item => factory.getExpr(item))
    if (factory.isInfix(dom)) {
      util.check(children.length === 3,
                 `Expect three children for infix operator`)
      const [left, middle, right] = children
      return new Expr[middle](left, right)
    }
    const kind = children[0]
    const args = children.slice(1)
    return new Expr[kind](...args)
  },

  base: ExprBase,
  constant: ExprConstant,
  column: ExprColumn,
  add: ExprAdd,
  and: ExprAnd,
  divide: ExprDivide,
  equal: ExprEqual,
  greater: ExprGreater,
  greaterEqual: ExprGreaterEqual,
  ifElse: ExprIfElse,
  less: ExprLess,
  lessEqual: ExprLessEqual,
  multiply: ExprMultiply,
  negate: ExprNegate,
  not: ExprNot,
  notEqual: ExprNotEqual,
  or: ExprOr,
  power: ExprPower,
  remainder: ExprRemainder,
  subtract: ExprSubtract,
  isBool: ExprIsBool,
  isDatetime: ExprIsDatetime,
  isMissing: ExprIsMissing,
  isNumber: ExprIsNumber,
  isString: ExprIsString,
  toBool: ExprToBool,
  toDatetime: ExprToDatetime,
  toNumber: ExprToNumber,
  toString: ExprToString,
  toYear: ExprToYear,
  toMonth: ExprToMonth,
  toDay: ExprToDay,
  toWeekday: ExprToWeekday,
  toHours: ExprToHours,
  toMinutes: ExprToMinutes,
  toSeconds: ExprToSeconds
}

/**
 * Classes - must be done here to ensure Stage.TRANSFORM etc. have been
 * defined.
 */
Expr.CLASSES = [
  ExprNullary,
  ExprNegate,
  ExprTypecheck,
  ExprConvert,
  ExprDatetime,
  ExprArithmetic,
  ExprCompare,
  ExprLogical,
  ExprTernary
]

module.exports = {Expr}
