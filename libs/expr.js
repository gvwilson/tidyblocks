'use strict'

const util = require('./util')

/**
 * Represent an expression as an object. Derived classes must provide a member
 * variable `family` and implement `equal(other)` and `run(row, i)`.
 */
class ExprBase {
  constructor (family, kind) {
    this.family = family
    this.kind = kind
  }
}

/**
 * Generic value expression.
 */
class ExprValue extends ExprBase {
  constructor (family, kind, value) {
    super(family, kind)
    this.value = value
  }

  equal (other) {
    return (other instanceof ExprValue) &&
      (this.kind === other.kind) &&
      util.equal(this.value, other.value)
  }
}

/**
 * Generic unary expression.
 */
class ExprUnary extends ExprBase {
  constructor (family, kind, arg) {
    util.check(arg instanceof ExprBase,
               `Require expression as child`)
    super(family, kind)
    this.arg = arg
  }

  equal (other) {
    return (other instanceof ExprUnary) &&
      (this.kind === other.kind) &&
      this.arg.equal(other.arg)
  }
}

/**
 * Generic binary expression.
 */
class ExprBinary extends ExprBase {
  constructor (family, kind, left, right) {
    util.check(left instanceof ExprBase,
               `Require expression as left child`)
    util.check(right instanceof ExprBase,
               `Require expression as right child`)
    super(family, kind)
    this.left = left
    this.right = right
  }

  equal (other) {
    return (other instanceof ExprBinary) &&
      (this.kind === other.kind) &&
      this.left.equal(other.left) &&
      this.right.equal(other.right)
  }
}

/**
 * Generic ternary expression.
 */
class ExprTernary extends ExprBase {
  constructor (family, kind, left, middle, right) {
    util.check(left instanceof ExprBase,
               `Require expression as left child`)
    util.check(middle instanceof ExprBase,
               `Require expression as middle child`)
    util.check(right instanceof ExprBase,
               `Require expression as right child`)
    super(family, kind)
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
}

module.exports = {
  ExprBase,
  ExprValue,
  ExprUnary,
  ExprBinary,
  ExprTernary
}
