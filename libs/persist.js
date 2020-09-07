'use strict'

const util = require('./util')
const Program = require('./program')
const Pipeline = require('./pipeline')
const Transform = require('./transform')
const Op = require('./op')
const Value = require('./value')

/**
 * Restore runnable program objects from JSON.
 */
class Restore {
  /**
   * Restore a `Program` from JSON.
   * @params json The JSON containing the program description `['@program', ...pipelines...]`.
   * @return A new instance of `Program`.
   */
  program (json) {
    util.check(Array.isArray(json) &&
               (json.length > 0) &&
               (json[0] === Program.FAMILY),
               `Expected array with program kind`)
    const pipelines = json.slice(1).map(blob => this.pipeline(blob))
    return new Program(...pipelines)
  }

  /**
   * Restore a `Pipeline` from JSON.
   * @params json The JSON containing the pipeline description `['@pipeline', ...transforms...]`.
   * @return A new instance of `Pipeline`.
   */
  pipeline (json) {
    util.check(Array.isArray(json) &&
               (json.length > 1) &&
               (json[0] === Pipeline.FAMILY),
               `Expected array with pipeline element`)
    const transforms = json.slice(1).map(blob => this.transform(blob))
    return new Pipeline(...transforms)
  }

  /**
   * Restore a transform from JSON.
   * @params json The JSON containing the transform description `['@transform',
   * 'species', ...expressions...]`. The `species` must match one of the names
   * exported from `transform.js` and map to a class derived from
   * `TransformBase`.
   * @return A new instance of the class identified by `species`.
   */
  transform (json) {
    util.check(Array.isArray(json) &&
               (json.length > 1) &&
               (json[0] === Transform.FAMILY) &&
               (json[1] in Transform),
               `Unknown transform kind "${json[1]}"`)
    const kind = json[1]
    const args = json.slice(2).map(p => this.expr(p))
    return new Transform[kind](...args)
  }

  /**
   * Restore an expression from JSON.
   * @params json The JSON containing the expression description. This must be
   * either an operation or a value, each of which is handled by its own method.
   * `TransformBase`.
   * @return A new instance of the class identified by the first element of the
   * JSON.
   */
  expr (json) {
    // Values, empty arrays, and unmarked arrays are themselves.
    if (!Array.isArray(json) ||
        (json.length === 0) ||
        (typeof json[0] !== 'string') ||
        (json[0].length === 0) ||
        (json[0][0] !== '@')) {
      return json
    }
    // Dispatch by kind.
    const kind = json[0]
    if (kind === '@op') {
      return this.op(json)
    }
    if (kind === '@value') {
      return this.value(json)
    }
    util.fail(`Unknown expression type "${kind}"`)
  }

  /**
   * Restore an operation from JSON.
   * @params json The JSON containing the operation description `['@op',
   * 'species', ...expressions...]`. The `species` must match one of the names
   * exported from `op.js` and map to a class derived from `ExprBase`.
   * @return A new instance of the class identified by `species`.
   */
  op (json) {
    util.check((json.length > 1) &&
               (json[0] === Op.FAMILY) &&
               (json[1] in Op),
               `Require indicator of known operation kind ${JSON.stringify(json)}`)
    const kind = json[1]
    const args = json.slice(2).map(p => this.expr(p))
    return new Op[kind](...args)
  }

  /**
   * Restore a value from JSON.
   * @params json The JSON containing the operation description `['@value',
   * 'species', ...expressions...]`. The `species` must match one of the names
   * exported from `value.js` and map to a class derived from `ExprBase`.
   * @return A new instance of the class identified by `species`.
   */
  value (json) {
    util.check((json.length > 1) &&
               (json[0] === Value.FAMILY) &&
               (json[1] in Value),
               `Require indicator of known value kind ${JSON.stringify(json)}`)
    const kind = json[1]
    const args = json.slice(2).map(p => this.expr(p))
    return new Value[kind](...args)
  }
}

module.exports = Restore
