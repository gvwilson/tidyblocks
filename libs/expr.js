'use strict'

const util = require('./util')

/**
 * Represent an expression as an object. Derived classes must implement
 * `equal(other)` and `run(row, i, data)`.
 */
class ExprBase {
  /**
   * Construct a new expression object.
   * @param {string} family An '@'-prefixed family name for dispatch in `Restore`.
   * @param {string} kind Identifies a specific class within that family.
   */
  constructor (family, kind) {
    this.family = family
    this.kind = kind
  }
}

/**
 * Generic value expression.
 */
class ExprValue extends ExprBase {
  /**
   * Construct a new expression object that stores a value.
   * @param {string} family An '@'-prefixed family name for dispatch in `Restore`.
   * @param {string} kind Identifies a specific class within that family.
   * @param value The value of this expression.
   */
  constructor (family, kind, value) {
    super(family, kind)
    this.value = value
  }

  /**
   * Check for equality.
   * @param other The object to check against.
   * @returns Equality.
   */
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
  /**
   * Construct a new expression object that applies a unary function to a sub-expression.
   * @param {string} family An '@'-prefixed family name for dispatch in `Restore`.
   * @param {string} kind Identifies a specific class within that family.
   * @param arg The runnable sub-expression to operate on.
   */
  constructor (family, kind, arg) {
    util.check(arg instanceof ExprBase,
               `Require expression as child`)
    super(family, kind)
    this.arg = arg
  }

  /**
   * Check for equality.
   * @param other The object to check against.
   * @returns Equality.
   */
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
  /**
   * Construct a new expression object that applies a binary function to two sub-expressions.
   * @param {string} family An '@'-prefixed family name for dispatch in `Restore`.
   * @param {string} kind Identifies a specific class within that family.
   * @param left The left-hand runnable sub-expression to operate on.
   * @param right The right-hand runnable sub-expression to operate on.
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

  /**
   * Check for equality.
   * @param other The object to check against.
   * @returns Equality.
   */
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
  /**
   * Construct a new expression object that applies a ternary function to three sub-expressions.
   * @param {string} family An '@'-prefixed family name for dispatch in `Restore`.
   * @param {string} kind Identifies a specific class within that family.
   * @param left The left-hand runnable sub-expression to operate on.
   * @param middle The middle runnable sub-expression to operate on.
   * @param right The right-hand runnable sub-expression to operate on.
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

  /**
   * Check for equality.
   * @param other The object to check against.
   * @returns Equality.
   */
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
