'use strict'

const util = require('./util')
const MISSING = util.MISSING

/**
 * Represent an expression as an object. Derived classes must provide `run(row, i)` and `toJSON()`.
 */
class ExprBase {
  constructor (kind) {
    this.kind = kind
  }

  safeValue (value) {
    return isFinite(value) ? value : MISSING
  }
}

/**
 * Placeholder used when building blanks for cloning.
 */
class ExprPlaceholder extends ExprBase {
  constructor () {
    super(ExprPlaceholder.KIND)
  }

  toJSON () {
    return [Expr.KIND, this.kind]
  }

  static Fields () {
    return [['placeholder']]
  }
}
ExprPlaceholder.KIND = 'placeholder'

// ----------------------------------------------------------------------

/**
 * Generic nullary expression (never instantiated directly).
 */
class ExprNullaryBase extends ExprBase {
  constructor(kind, value) {
    super(kind)
    this.value = value
  }

  equal (other) {
    return (other instanceof ExprNullaryBase) &&
      (this.kind === other.kind) &&
      util.equal(this.value, other.value)
  }

  toJSON () {
    return [Expr.KIND, this.kind, this.value]
  }

  static MakeBlank () {
    return new ExprLogical(false)
  }
}
ExprNullaryBase.OPTIONS = ['logical', 'number', 'string', 'datetime', 'column']

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
    return [Expr.KIND, this.kind, this.arg.toJSON()]
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
    return [Expr.KIND, this.kind, this.left.toJSON(), this.right.toJSON()]
  }
}

/**
 * Ternary expressions.
 */
class ExprTernaryBase extends ExprBase {
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
    return (other instanceof ExprTernaryBase) &&
      (this.kind === other.kind) &&
      this.left.equal(other.left) &&
      this.middle.equal(other.middle) &&
      this.right.equal(other.right)
  }

  toJSON () {
    return [Expr.KIND, this.kind, this.left.toJSON(),
            this.middle.toJSON(), this.right.toJSON()]
  }

  static MakeBlank () {
    const placeholder = new ExprPlaceholder()
    return new ExprIfElse(placeholder, placeholder, placeholder)
  }
}

// ----------------------------------------------------------------------

/**
 * Logical value.
 */
class ExprLogical extends ExprNullaryBase {
  constructor (value) {
    util.check((value === MISSING) || (typeof value === 'boolean'),
               `Logical value must be missing or true/false`)
    super(ExprLogical.KIND, value)
  }

  run (row, i) {
    return this.value
  }

  static Fields () {
    return [['selectKind', ExprNullaryBase.OPTIONS, ExprLogical.KIND],
            ['text', 'value']]
  }
}
ExprLogical.KIND = 'logical'

/**
 * Numeric value.
 */
class ExprNumber extends ExprNullaryBase {
  constructor (value) {
    util.check((value === MISSING) || (typeof value === 'number'),
               `Numeric value must be missing or number`)
    super(ExprNumber.KIND, value)
  }

  run (row, i) {
    return this.value
  }

  static Fields () {
    return [['selectKind', ExprNullaryBase.OPTIONS, ExprNumber.KIND],
            ['text', 'value']]
  }
}
ExprNumber.KIND = 'number'

/**
 * Text value.
 */
class ExprString extends ExprNullaryBase {
  constructor (value) {
    util.check((value === MISSING) || (typeof value === 'string'),
               `String value must be missing or string`)
    super(ExprString.KIND, value)
  }

  run (row, i) {
    return this.value
  }

  static Fields () {
    return [['selectKind', ExprNullaryBase.OPTIONS, ExprString.KIND],
            ['text', 'value']]
  }
}
ExprString.KIND = 'string'

/**
 * Datetime value.
 */
class ExprDatetime extends ExprNullaryBase {
  constructor (value) {
    util.check((value === MISSING) || (value instanceof Date),
               `Datetime value must be missing or date`)
    super(ExprDatetime.KIND, value)
  }

  run (row, i) {
    return this.value
  }

  static Fields () {
    return [['selectKind', ExprNullaryBase.OPTIONS, ExprDatetime.KIND],
            ['text', 'value']]
  }
}
ExprDatetime.KIND = 'datetime'

/**
 * Column value.
 * @param {string} column The column name.
 * @returns The value
 */
class ExprColumn extends ExprNullaryBase {
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
    return [['selectKind', ExprNullaryBase.OPTIONS, ExprColumn.KIND],
            ['text', 'name']]
  }
}
ExprColumn.KIND = 'column'

// ----------------------------------------------------------------------

/**
 * Negations.
 */
class ExprNegationBase extends ExprUnary {
  constructor (kind, arg) {
    super(kind, arg)
  }

  static MakeBlank () {
    const placeholder = new ExprPlaceholder()
    return new ExprNegate(placeholder)
  }

  static _Fields (kind) {
    return [['selectKind', ExprNegationBase.OPTIONS, kind],
            ['expr', 'arg']]
  }
}
ExprNegationBase.OPTIONS = [['-', 'negate'], 'not']

/**
 * Arithmetic negation.
 * @param {expr} arg How to get the value.
 * @returns The negation.
 */
class ExprNegate extends ExprNegationBase {
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
    return ExprNegationBase._Fields(ExprNegate.KIND)
  }
}
ExprNegate.KIND = 'negate'

/**
 * Logical negation.
 * @param {expr} arg How to get the value.
 * @returns The negation.
 */
class ExprNot extends ExprNegationBase {
  constructor (arg) {
    super(ExprNot.KIND, arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    return (value === MISSING) ? MISSING : ((!value) ? true : false)
  }

  static Fields () {
    return ExprNegationBase._Fields(ExprNot.KIND)
  }
}
ExprNot.KIND = 'not'

// ----------------------------------------------------------------------

/**
 * Unary type-checking expressions.
 */
class ExprTypecheckBase extends ExprUnary {
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
    const placeholder = new ExprPlaceholder
    return new ExprIsLogical(placeholder)
  }

  static _Fields (kind) {
    return [['selectKind', ExprTypecheckBase.OPTIONS, kind],
            ['expr', 'arg']]
  }
}
ExprTypecheckBase.OPTIONS = ['isLogical', 'isDatetime', 'isMissing',
                             'isNumber', 'isString']

/**
 * Check if a value is Boolean.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class ExprIsLogical extends ExprTypecheckBase {
  constructor (arg) {
    super(ExprIsLogical.KIND, arg)
  }

  run (row, i) {
    return this.typeCheck(row, i, 'boolean')
  }

  static Fields () {
    return ExprTypecheckBase._Fields(ExprIsLogical.KIND)
  }
}
ExprIsLogical.KIND = 'isLogical'

/**
 * Check if a value is a datetime.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class ExprIsDatetime extends ExprTypecheckBase {
  constructor (arg) {
    super(ExprIsDatetime.KIND, arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    return (value === MISSING) ? MISSING : (value instanceof Date)
  }

  static Fields () {
    return ExprTypecheckBase._Fields(ExprIsDatetime.KIND)
  }
}
ExprIsDatetime.KIND = 'isDatetime'

/**
 * Check if a value is missing.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class ExprIsMissing extends ExprTypecheckBase {
  constructor (arg) {
    super(ExprIsMissing.KIND, arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    return value === MISSING
  }

  static Fields () {
    return ExprTypecheckBase._Fields(ExprIsMissing.KIND)
  }
}
ExprIsMissing.KIND = 'isMissing'

/**
 * Check if a value is numeric.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class ExprIsNumber extends ExprTypecheckBase {
  constructor (arg) {
    super(ExprIsNumber.KIND, arg)
  }

  run (row, i) {
    return this.typeCheck(row, i, 'number')
  }

  static Fields () {
    return ExprTypecheckBase._Fields(ExprIsNumber.KIND)
  }
}
ExprIsNumber.KIND = 'isNumber'

/**
 * Check if a value is a string.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class ExprIsString extends ExprTypecheckBase {
  constructor (arg) {
    super(ExprIsString.KIND, arg)
  }

  run (row, i) {
    return this.typeCheck(row, i, 'string')
  }

  static Fields () {
    return ExprTypecheckBase._Fields(ExprIsString.KIND)
  }
}
ExprIsString.KIND = 'isString'

// ----------------------------------------------------------------------

/**
 * Unary type conversion expressions.
 */
class ExprConvertBase extends ExprUnary {
  constructor (kind, arg) {
    super(kind, arg)
  }

  static MakeBlank () {
    const placeholder = new ExprPlaceholder()
    return new ExprToLogical(placeholder)
  }

  static _Fields (kind) {
    return [['selectKind', ExprConvertBase.OPTIONS, kind],
            ['expr', 'arg']]
  }
}
ExprConvertBase.OPTIONS = ['toLogical', 'toDatetime', 'toNumber', 'toString']

/**
 * Convert a value to Boolean.
 * @param {expr} arg How to get the value.
 * @returns Converted value.
 */
class ExprToLogical extends ExprConvertBase {
  constructor (arg) {
    super(ExprToLogical.KIND, arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    return (value === MISSING)
      ? MISSING
      : (value ? true : false)
  }

  static Fields () {
    return ExprConvertBase._Fields(ExprToLogical.KIND)
  }
}
ExprToLogical.KIND = 'toLogical'

/**
 * Convert a value to a datetime.
 * @param {expr} arg How to get the value.
 * @returns Converted value.
 */
class ExprToDatetime extends ExprConvertBase {
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
    return ExprConvertBase._Fields(ExprToDatetime.KIND)
  }
}
ExprToDatetime.KIND = 'toDatetime'

/**
 * Convert a value to a number.
 * @param {expr} arg How to get the value.
 * @returns Converted value.
 */
class ExprToNumber extends ExprConvertBase {
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
    return ExprConvertBase._Fields(ExprToNumber.KIND)
  }
}
ExprToNumber.KIND = 'toNumber'

/**
 * Convert a value to a string.
 * @param {expr} arg How to get the value.
 * @returns Converted value.
 */
class ExprToString extends ExprConvertBase {
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
    return ExprConvertBase._Fields(ExprToString.KIND)
  }
}
ExprToString.KIND = 'toString'

// ----------------------------------------------------------------------

/**
 * Unary datetime expressions.
 */
class ExprDatetimeBase extends ExprUnary {
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
    const placeholder = new ExprPlaceholder()
    return new ExprToYear(placeholder)
  }

  static _Fields (kind) {
    return [['selectKind', ExprDatetimeBase.OPTIONS, kind],
            ['expr', 'arg']]
  }
}
ExprDatetimeBase.OPTIONS = ['toYear', 'toMonth', 'toDay', 'toWeekday',
                            'toHours', 'toMinutes', 'toSeconds']

/**
 * Extract year from date.
 * @param {expr} arg How to get the value.
 * @returns Month.
 */
class ExprToYear extends ExprDatetimeBase {
  constructor (arg) {
    super(ExprToYear.KIND, arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getFullYear())
  }

  static Fields () {
    return ExprDatetimeBase._Fields(ExprToYear.KIND)
  }
}
ExprToYear.KIND = 'toYear'

/**
 * Extract month from date.
 * @param {expr} arg How to get the value.
 * @returns Month.
 */
class ExprToMonth extends ExprDatetimeBase {
  constructor (arg) {
    super(ExprToMonth.KIND, arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getMonth() + 1)
  }

  static Fields () {
    return ExprDatetimeBase._Fields(ExprToMonth.KIND)
  }
}
ExprToMonth.KIND = 'toMonth'

/**
 * Extract day of month from date.
 * @param {expr} arg How to get the value.
 * @returns Day.
 */
class ExprToDay extends ExprDatetimeBase {
  constructor (arg) {
    super(ExprToDay.KIND, arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getDate())
  }

  static Fields () {
    return ExprDatetimeBase._Fields(ExprToDay.KIND)
  }
}
ExprToDay.KIND = 'toDay'

/**
 * Extract day of week from date.
 * @param {expr} arg How to get the value.
 * @returns Day.
 */
class ExprToWeekday extends ExprDatetimeBase {
  constructor (arg) {
    super(ExprToWeekday.KIND, arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getDay())
  }

  static Fields () {
    return ExprDatetimeBase._Fields(ExprToWeekday.KIND)
  }
}
ExprToWeekday.KIND = 'toWeekday'

/**
 * Extract hour from date.
 * @param {expr} arg How to get the value.
 * @returns Hour.
 */
class ExprToHours extends ExprDatetimeBase {
  constructor (arg) {
    super(ExprToHours.KIND, arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getHours())
  }

  static Fields () {
    return ExprDatetimeBase._Fields(ExprToHours.KIND)
  }
}
ExprToHours.KIND = 'toHours'

/**
 * Extract minutes from date.
 * @param {expr} arg How to get the value.
 * @returns Minutes.
 */
class ExprToMinutes extends ExprDatetimeBase {
  constructor (arg) {
    super(ExprToMinutes.KIND, arg)
  }

  run (row, i) {
    return this.dateValue(row, i, d => d.getMinutes())
  }

  static Fields () {
    return ExprDatetimeBase._Fields(ExprToMinutes.KIND)
  }
}
ExprToMinutes.KIND = 'toMinutes'

/**
 * Extract seconds from date.
 * @param {expr} arg How to get the value.
 * @returns Seconds.
 */
class ExprToSeconds extends ExprDatetimeBase {
  constructor (arg) {
    super(ExprToSeconds.KIND, arg)
  }

  run (row, i) { 
    return this.dateValue(row, i, d => d.getSeconds())
  }

  static Fields () {
    return ExprDatetimeBase._Fields(ExprToSeconds.KIND)
  }
}
ExprToSeconds.KIND = 'toSeconds'

// ----------------------------------------------------------------------

/**
 * Binary arithmetic expressions.
 */
class ExprArithmeticBase extends ExprBinary {
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
    const placeholder = new ExprPlaceholder()
    return new ExprAdd(placeholder, placeholder)
  }

  static _Fields (kind) {
    return [['expr', 'left'],
            ['selectKind', ExprArithmeticBase.OPTIONS, kind],
            ['expr', 'right']]
  }
}
ExprArithmeticBase.OPTIONS = [['+', 'add'], ['-', 'subtract'],
                          ['*', 'multiply'], ['/', 'divide'],
                          ['%', 'remainder'], ['**', 'power']]

/**
 * Addition.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The sum.
 */
class ExprAdd extends ExprArithmeticBase {
  constructor (left, right) {
    super(ExprAdd.KIND, left, right)
  }

  run (row, i) {
    return this.arithmetic(row, i, (left, right) => left + right)
  }

  static Fields () {
    return ExprArithmeticBase._Fields(ExprAdd.KIND)
  }
}
ExprAdd.KIND = 'add'

/**
 * Division.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The quotient.
 */
class ExprDivide extends ExprArithmeticBase {
  constructor (left, right) {
    super(ExprDivide.KIND, left, right)
  }

  run (row, i) {
    return this.arithmetic(row, i, (left, right) => left / right)
  }

  static Fields () {
    return ExprArithmeticBase._Fields(ExprDivide.KIND)
  }
}
ExprDivide.KIND = 'divide'

/**
 * Multiplication.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The product.
 */
class ExprMultiply extends ExprArithmeticBase {
  constructor (left, right) {
    super(ExprMultiply.KIND, left, right)
  }

  run (row, i) {
    return this.arithmetic(row, i, (left, right) => left * right)
  }

  static Fields () {
    return ExprArithmeticBase._Fields(ExprMultiply.KIND)
  }
}
ExprMultiply.KIND = 'multiply'

/**
 * Exponentiation.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The power.
 */
class ExprPower extends ExprArithmeticBase {
  constructor (left, right) {
    super(ExprPower.KIND, left, right)
  }

  run (row, i) {
    return this.arithmetic(row, i, (left, right) => left ** right)
  }

  static Fields () {
    return ExprArithmeticBase._Fields(ExprPower.KIND)
  }
}
ExprPower.KIND = 'power'

/**
 * Remainder.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The remainder.
 */
class ExprRemainder extends ExprArithmeticBase {
  constructor (left, right) {
    super(ExprRemainder.KIND, left, right)
  }

  run (row, i) {
    return this.arithmetic(row, i, (left, right) => left % right)
  }

  static Fields () {
    return ExprArithmeticBase._Fields(ExprRemainder.KIND)
  }
}
ExprRemainder.KIND = 'remainder'

/**
 * Subtraction.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The difference.
 */
class ExprSubtract extends ExprArithmeticBase {
  constructor (left, right) {
    super(ExprSubtract.KIND, left, right)
  }

  run (row, i) {
    return this.arithmetic(row, i, (left, right) => left - right)
  }

  static Fields () {
    return ExprArithmeticBase._Fields(ExprSubtract.KIND)
  }
}
ExprSubtract.KIND = 'subtract'

// ----------------------------------------------------------------------

/**
 * Binary comparison expressions.
 */
class ExprCompareBase extends ExprBinary {
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
    const placeholder = new ExprPlaceholder()
    return new ExprEqual(placeholder, placeholder)
  }

  static _Fields (kind) {
    return [['expr', 'left'],
            ['selectKind', ExprCompareBase.OPTIONS, kind],
            ['expr', 'right']]
  }
}
ExprCompareBase.OPTIONS = [['==', 'equal'], ['!=', 'notEqual'],
                       ['&gt;', 'greater'], ['&gt;=', 'greaterEqual'],
                       ['&lt;=', 'lessEqual'], ['&lt;', 'less']]

/**
 * Equality.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class ExprEqual extends ExprCompareBase {
  constructor (left, right) {
    super(ExprEqual.KIND, left, right)
  }

  run (row, i) {
    return this.comparison(row, i, (left, right) => util.equal(left, right))
  }

  static Fields () {
    return ExprCompareBase._Fields(ExprEqual.KIND)
  }
}
ExprEqual.KIND = 'equal'

/**
 * Strictly greater than.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class ExprGreater extends ExprCompareBase {
  constructor (left, right) {
    super(ExprGreater.KIND, left, right)
  }

  run (row, i) {
    return this.comparison(row, i, (left, right) => (left > right))
  }

  static Fields () {
    return ExprCompareBase._Fields(ExprGreater.KIND)
  }
}
ExprGreater.KIND = 'greater'

/**
 * Greater than or equal.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class ExprGreaterEqual extends ExprCompareBase {
  constructor (left, right) {
    super(ExprGreaterEqual.KIND, left, right)
  }

  run (row, i) {
    return this.comparison(row, i, (left, right) => (left >= right))
  }

  static Fields () {
    return ExprCompareBase._Fields(ExprGreaterEqual.KIND)
  }
}
ExprGreaterEqual.KIND = 'greaterEqual'

/**
 * Strictly less than.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class ExprLess extends ExprCompareBase {
  constructor (left, right) {
    super(ExprLess.KIND, left, right)
  }

  run (row, i) {
    return this.comparison(row, i, (left, right) => (left < right))
  }

  static Fields () {
    return ExprCompareBase._Fields(ExprLess.KIND)
  }
}
ExprLess.KIND = 'less'

/**
 * Less than or equal.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class ExprLessEqual extends ExprCompareBase {
  constructor (left, right) {
    super(ExprLessEqual.KIND, left, right)
  }

  run (row, i) {
    return this.comparison(row, i, (left, right) => (left <= right))
  }

  static Fields () {
    return ExprCompareBase._Fields(ExprLessEqual.KIND)
  }
}
ExprLessEqual.KIND = 'lessEqual'

/**
 * Inequality.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class ExprNotEqual extends ExprCompareBase {
  constructor (left, right) {
    super(ExprNotEqual.KIND, left, right)
  }

  run (row, i) {
    return this.comparison(row, i, (left, right) => (!util.equal(left, right)))
  }

  static Fields () {
    return ExprCompareBase._Fields(ExprNotEqual.KIND)
  }
}
ExprNotEqual.KIND = 'notEqual'

// ----------------------------------------------------------------------

/**
 * Binary logical expressions.
 */
class ExprLogicalBase extends ExprBinary {
  constructor (kind, left, right) {
    super(kind, left, right)
  }

  static MakeBlank () {
    const placeholder = new ExprPlaceholder()
    return new ExprAnd(placeholder, placeholder)
  }

  static _Fields (kind) {
    return [['expr', 'left'],
            ['selectKind', ExprLogicalBase.OPTIONS, kind],
            ['expr', 'right']]
  }
}
ExprLogicalBase.OPTIONS = ['and', 'or']

/**
 * Logical conjunction.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The conjunction using short-circuit evaluation.
 */
class ExprAnd extends ExprLogicalBase {
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
    return ExprLogicalBase._Fields(ExprAnd.KIND)
  }
}
ExprAnd.KIND = 'and'

/**
 * Logical disjunction.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The disjunction using short-circuit evaluation.
 */
class ExprOr extends ExprLogicalBase {
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
    return ExprLogicalBase._Fields(ExprOr.KIND)
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
class ExprIfElse extends ExprTernaryBase {
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
  KIND: '@expr',

  makeBlanks: () => {
    const classes = [
      ExprNullaryBase,
      ExprNegationBase,
      ExprTypecheckBase,
      ExprConvertBase,
      ExprDatetimeBase,
      ExprArithmeticBase,
      ExprCompareBase,
      ExprLogicalBase,
      ExprTernaryBase
    ]
    return classes.map(cls => cls.MakeBlank().toJSON())
  },

  base: ExprBase,
  placeholder: ExprPlaceholder,
  logical: ExprLogical,
  number: ExprNumber,
  string: ExprString,
  datetime: ExprDatetime,
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
  isLogical: ExprIsLogical,
  isDatetime: ExprIsDatetime,
  isMissing: ExprIsMissing,
  isNumber: ExprIsNumber,
  isString: ExprIsString,
  toLogical: ExprToLogical,
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

module.exports = {Expr}
