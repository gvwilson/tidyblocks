'use strict'

const util = require('./util')
const Program = require('./program')
const Pipeline = require('./pipeline')
const Transform = require('./transform')
const Op = require('./op')
const Value = require('./value')

class Restore {
  constructor () {
  }

  program (json) {
    util.check(Array.isArray(json) &&
               (json.length > 0) &&
               (json[0] === Program.FAMILY),
              `Expected array with program kind`)
    const pipelines = json.slice(1).map(blob => this.pipeline(blob))
    return new Program(...pipelines)
  }

  pipeline (json) {
    util.check(Array.isArray(json) &&
               (json.length > 1) &&
               (json[0] === Pipeline.FAMILY),
              `Expected array with pipeline element`)
    const transforms = json.slice(1).map(blob => this.transform(blob))
    return new Pipeline(...transforms)
  }

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

  op (json) {
    util.check((json.length > 1) &&
               (json[0] === Op.FAMILY) &&
               (json[1] in Op),
               `Require indicator of known operation kind`)
    const kind = json[1]
    const args = json.slice(2).map(p => this.expr(p))
    return new Op[kind](...args)
  }

  value (json) {
    util.check((json.length > 1) &&
               (json[0] === Value.FAMILY) &&
               (json[1] in Value),
               `Require indicator of known value kind`)
    const kind = json[1]
    const args = json.slice(2).map(p => this.expr(p))
    return new Value[kind](...args)
  }
}

module.exports = Restore
