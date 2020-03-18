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
    this.options = ['constant', 'column']
    this.value = value
  }

  equal (other) {
    return (other instanceof ExprNullary) &&
      (this.kind === other.kind) &&
      util.equal(this.value, other.value)
  }

  toJSON () {
    return [Expr.NULLARY, this.kind, this.value]
  }

  toHTML (factory) {
    return factory.widget(
      factory.choose(this.options, this.kind),
      factory.input(this.value)
    )
  }

  static MakeBlank () {
    return new ExprConstant(false)
  }
}

/**
 * Generic unary expressions (never instantiated directly).
 */
class ExprUnary extends ExprBase {
  constructor (prefix, kind, arg) {
    util.check(arg instanceof ExprBase,
              `Require expression as child`)
    super(kind)
    this.prefix = prefix
    this.arg = arg
  }

  equal (other) {
    return (other instanceof ExprUnary) &&
      (this.prefix === other.prefix) &&
      (this.kind === other.kind) &&
      this.arg.equal(other.arg)
  }

  toJSON () {
    return [this.prefix, this.kind, this.arg.toJSON()]
  }

  toHTML (factory) {
    return factory.widget(
      factory.choose(this.options, this.kind),
      factory.expr(this.arg)
    )
  }
}

/**
 * Binary expressions.
 */
class ExprBinary extends ExprBase {
  constructor (prefix, kind, left, right) {
    util.check(left instanceof ExprBase,
              `Require expression as left child`)
    util.check(right instanceof ExprBase,
              `Require expression as right child`)
    super(kind)
    this.prefix = prefix
    this.left = left
    this.right = right
  }

  equal (other) {
    return (other instanceof ExprBinary) &&
      (this.prefix === other.prefix) &&
      (this.kind === other.kind) &&
      this.left.equal(other.left) &&
      this.right.equal(other.right)
  }

  toJSON () {
    return [this.prefix, this.kind,
            this.left.toJSON(), this.right.toJSON()]
  }

  toHTML (factory) {
    return factory.infixWidget(
      factory.expr(this.left),
      factory.choose(this.options, this.kind),
      factory.expr(this.right)
    )
  }
}

/**
 * Ternary expressions.
 */
class ExprTernary extends ExprBase {
  constructor (prefix, kind, left, middle, right) {
    util.check(left instanceof ExprBase,
               `Require expression as left child`)
    util.check(middle instanceof ExprBase,
              `Require expression as middle child`)
    util.check(right instanceof ExprBase,
              `Require expression as right child`)
    super(kind)
    this.prefix = prefix
    this.left = left
    this.middle = middle
    this.right = right
  }

  equal (other) {
    return (other instanceof ExprTernary) &&
      (this.prefix === other.prefix) &&
      (this.kind === other.kind) &&
      this.left.equal(other.left) &&
      this.middle.equal(other.middle) &&
      this.right.equal(other.right)
  }

  toJSON () {
    return [this.prefix, this.kind,
            this.left.toJSON(),
            this.middle.toJSON(),
            this.right.toJSON()]
  }

  toHTML (factory) {
    return factory.widget(
      'if',
      factory.expr(this.left),
      'then',
      factory.expr(this.middle),
      'else',
      factory.expr(this.right)
    )
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
    super('constant', value)
  }

  run (row, i) {
    return this.value
  }
}

/**
 * Column value.
 * @param {string} column The column name.
 * @returns The value
 */
class ExprColumn extends ExprNullary {
  constructor (name) {
    util.check(name && (typeof name === 'string'),
               `Column name must be string`)
    super('column', name)
  }

  run (row, i) {
    util.check(typeof row === 'object',
               `Row must be object`)
    util.check(this.value in row,
               `${this.name} not in row`)
    return row[this.value]
  }
}

// ----------------------------------------------------------------------

/**
 * Negations.
 */
class ExprNegation extends ExprUnary {
  constructor (kind, arg) {
    super(Expr.NEGATE, kind, arg)
    this.options = [['-', 'negate'], 'not']
  }

  static MakeBlank () {
    const placeholder = new ExprConstant(false)
    const result = new ExprNegate(placeholder)
    result.arg = null
    return result
  }
}

/**
 * Arithmetic negation.
 * @param {expr} arg How to get the value.
 * @returns The negation.
 */
class ExprNegate extends ExprNegation {
  constructor (arg) {
    super('negate', arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    util.checkNumber(value,
                     `Require number for ${this.name}`)
    return (value === MISSING) ? MISSING : this.safeValue(-value)
  }
}

/**
 * Logical negation.
 * @param {expr} arg How to get the value.
 * @returns The negation.
 */
class ExprNot extends ExprNegation {
  constructor (arg) {
    super('not', arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    return (value === MISSING) ? MISSING : ((!value) ? true : false)
  }
}

// ----------------------------------------------------------------------

/**
 * Unary type-checking expressions.
 */
class ExprTypecheck extends ExprUnary {
  constructor (kind, arg) {
    super(Expr.TYPECHECK, kind, arg)
    this.options = ['isBool', 'isDatetime', 'isMissing',
                    'isNumber', 'isString']
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
}

/**
 * Check if a value is Boolean.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class ExprIsBool extends ExprTypecheck {
  constructor (arg) {
    super('isBool', arg)
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
class ExprIsDatetime extends ExprTypecheck {
  constructor (arg) {
    super('isDatetime', arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    return (value === MISSING) ? MISSING : (value instanceof Date)
  }
}

/**
 * Check if a value is missing.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class ExprIsMissing extends ExprTypecheck {
  constructor (arg) {
    super('isMissing', arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    return value === MISSING
  }
}

/**
 * Check if a value is numeric.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class ExprIsNumber extends ExprTypecheck {
  constructor (arg) {
    super('isNumber', arg)
  }

  run (row, i) {
    return this.typeCheck(row, i, 'number')
  }
}

/**
 * Check if a value is a string.
 * @param {expr} arg How to get the value.
 * @returns Boolean result.
 */
class ExprIsString extends ExprTypecheck {
  constructor (arg) {
    super('isString', arg)
  }

  run (row, i) {
    return this.typeCheck(row, i, 'string')
  }
}

// ----------------------------------------------------------------------

/**
 * Unary type conversion expressions.
 */
class ExprConvert extends ExprUnary {
  constructor (kind, arg) {
    super(Expr.CONVERT, kind, arg)
    this.options = ['toBool', 'toDatetime', 'toNumber', 'toString']
  }

  static MakeBlank () {
    const placeholder = new ExprConstant(false)
    const result = new ExprToBool(placeholder)
    result.arg = null
    return result
  }
}

/**
 * Convert a value to Boolean.
 * @param {expr} arg How to get the value.
 * @returns Converted value.
 */
class ExprToBool extends ExprConvert {
  constructor (arg) {
    super('toBool', arg)
  }

  run (row, i) {
    const value = this.arg.run(row, i)
    return (value === MISSING)
      ? MISSING
      : (value ? true : false)
  }
}

/**
 * Convert a value to a datetime.
 * @param {expr} arg How to get the value.
 * @returns Converted value.
 */
class ExprToDatetime extends ExprConvert {
  constructor (arg) {
    super('toDatetime', arg)
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
}

/**
 * Convert a value to a number.
 * @param {expr} arg How to get the value.
 * @returns Converted value.
 */
class ExprToNumber extends ExprConvert {
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
        value = MISSING
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
class ExprToString extends ExprConvert {
  constructor (arg) {
    super('toString', arg)
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
}

// ----------------------------------------------------------------------

/**
 * Unary datetime expressions.
 */
class ExprDatetime extends ExprUnary {
  constructor (kind, arg) {
    super(Expr.DATETIME, kind, arg)
    this.options = ['toYear', 'toMonth', 'toDay', 'toWeekday',
                    'toHours', 'toMinutes', 'toSeconds']
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
}

/**
 * Extract year from date.
 * @param {expr} arg How to get the value.
 * @returns Month.
 */
class ExprToYear extends ExprDatetime {
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
class ExprToMonth extends ExprDatetime {
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
class ExprToDay extends ExprDatetime {
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
class ExprToWeekday extends ExprDatetime {
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
class ExprToHours extends ExprDatetime {
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
class ExprToMinutes extends ExprDatetime {
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
class ExprToSeconds extends ExprDatetime {
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
class ExprArithmetic extends ExprBinary {
  constructor (kind, left, right) {
    super(Expr.ARITHMETIC, kind, left, right)
    this.options = [['+', 'add'], ['-', 'subtract'],
                    ['*', 'multiply'], ['/', 'divide'],
                    ['%', 'remainder'], ['**', 'power']]
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
}

/**
 * Addition.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The sum.
 */
class ExprAdd extends ExprArithmetic {
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
class ExprDivide extends ExprArithmetic {
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
class ExprMultiply extends ExprArithmetic {
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
class ExprPower extends ExprArithmetic {
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
class ExprRemainder extends ExprArithmetic {
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
class ExprSubtract extends ExprArithmetic {
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
class ExprCompare extends ExprBinary {
  constructor (kind, left, right) {
    super(Expr.COMPARE, kind, left, right)
    this.options = [['==', 'equal'], ['!=', 'notEqual'],
                    ['&gt;', 'greater'], ['&gt;=', 'greaterEqual'],
                    ['&lt;=', 'lessEqual'], ['&lt;', 'less']]
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
}

/**
 * Equality.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The Boolean result.
 */
class ExprEqual extends ExprCompare {
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
class ExprGreater extends ExprCompare {
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
class ExprGreaterEqual extends ExprCompare {
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
class ExprLess extends ExprCompare {
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
class ExprLessEqual extends ExprCompare {
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
class ExprNotEqual extends ExprCompare {
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
class ExprLogical extends ExprBinary {
  constructor (kind, left, right) {
    super(Expr.LOGICAL, kind, left, right)
    this.options = ['and', 'or']
  }

  static MakeBlank () {
    const placeholder = new ExprConstant(false)
    const result = new ExprAnd(placeholder, placeholder)
    result.left = null
    result.right = null
    return result
  }
}

/**
 * Logical conjunction.
 * @param {expr} left How to get the left value.
 * @param {expr} right How to get the right value.
 * @returns The conjunction using short-circuit evaluation.
 */
class ExprAnd extends ExprLogical {
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
class ExprOr extends ExprLogical {
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
class ExprIfElse extends ExprTernary {
  constructor (left, middle, right) {
    super(Expr.TERNARY, 'ifElse', left, middle, right)
  }

  run (row, i) {
    const cond = this.left.run(row, i)
    return (cond === MISSING)
      ? MISSING
      : (cond ? this.middle.run(row, i) : this.right.run(row, i))
  }
}

// ----------------------------------------------------------------------

/**
 * Lookup table of everything exported from this file.
 */
const Expr = {
  /**
   * Indicators.
   */
  NULLARY: '@nullary',
  NEGATE: '@negate',
  TYPECHECK: '@typecheck',
  CONVERT: '@convert',
  DATETIME: '@datetime',
  ARITHMETIC: '@arithmetic',
  COMPARE: '@compare',
  LOGICAL: '@logical',
  TERNARY: '@ternary',

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
    util.check((json.length > 1) && (json[1] in Expr),
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
          .map(item => factory.exprFromHTML(item))
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
