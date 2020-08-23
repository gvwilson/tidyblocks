'use strict'

const util = require('./util')

/**
 * Represent an expression as an object. Derived classes must implement
 * `equal(other)` and `run(row, i, data)`.
 */
class ExprBase {
  /**
   * @param {string} family An '@'-prefixed family name for dispatch in `Restore`.
   * @param {string} kind Identifies a specific class within that family.
   */
  constructor (family, kind) {
    this.family = family
    this.kind = kind
  }
}

/**
 * Base class for nullary (no-argument) expressions.
 *
 * - Equal to other nullary expressions of the same type with the same value.
 */
class ExprNullary extends ExprBase {
  /**
   * @param {string} family An '@'-prefixed family name for dispatch in `Restore`.
   * @param {string} kind Identifies a specific class within that family.
   * @param {any} value The value of this expression.
   */
  constructor (family, kind, value) {
    super(family, kind)
    this.value = value
  }

  equal (other) {
    return (other instanceof ExprNullary) &&
      (this.kind === other.kind) &&
      util.equal(this.value, other.value)
  }
}

/**
 * Generic unary expression.
 *
 * - Equal to other unary expressions of the same type whose argument is equal.
 */
class ExprUnary extends ExprBase {
  /**
   * Construct a new expression object that applies a unary function to a sub-expression.
   * @param {string} family An '@'-prefixed family name for dispatch in `Restore`.
   * @param {string} kind Identifies a specific class within that family.
   * @param {ExprBase} arg The runnable sub-expression to operate on.
   */
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
 *
 * - Equal to other binary expressions of the same type whose arguments are equal.
 */
class ExprBinary extends ExprBase {
  /**
   * Construct a new expression object that applies a binary function to two sub-expressions.
   * @param {string} family An '@'-prefixed family name for dispatch in `Restore`.
   * @param {string} kind Identifies a specific class within that family.
   * @param {ExprBase} left The left-hand runnable sub-expression to operate on.
   * @param {ExprBase} right The right-hand runnable sub-expression to operate on.
   */
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
 *
 * - Equal to other ternary expressions of the same type whose arguments are equal.
 */
class ExprTernary extends ExprBase {
  /**
   * Construct a new expression object that applies a ternary function to three sub-expressions.
   * @param {string} family An '@'-prefixed family name for dispatch in `Restore`.
   * @param {string} kind Identifies a specific class within that family.
   * @param {ExprBase} left The left-hand runnable sub-expression to operate on.
   * @param {ExprBase} middle The middle runnable sub-expression to operate on.
   * @param {ExprBase} right The right-hand runnable sub-expression to operate on.
   */
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
  ExprNullary,
  ExprUnary,
  ExprBinary,
  ExprTernary
}
