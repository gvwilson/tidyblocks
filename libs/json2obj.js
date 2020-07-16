'use strict'

const util = require('./util')
const {Expr} = require('./expr')
const {Transform} = require('./transform')
const {Pipeline} = require('./pipeline')
const {Program} = require('./program')

class JsonToObj {
  constructor () {
  }

  program (json) {
    util.check(Array.isArray(json) &&
               (json.length > 0) &&
               (json[0] === Program.KIND),
              `Expected array with program kind`)
    const pipelines = json.slice(1).map(blob => this.pipeline(blob))
    return new Program(...pipelines)
  }

  pipeline (json) {
    util.check(Array.isArray(json) &&
               (json.length > 1) &&
               (json[0] === Pipeline.KIND),
              `Expected array with pipeline element`)
    const transforms = json.slice(1).map(blob => this.transform(blob))
    return new Pipeline(...transforms)
  }

  transform (json) {
    util.check(Array.isArray(json) &&
               (json.length > 1) &&
               (json[0] === Transform.KIND) &&
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
    util.check((json.length > 1) &&
               (json[0] === Expr.KIND) &&
               (json[1] in Expr),
               `Require indicator of known expression kind`)
    const kind = json[1]
    const args = json.slice(2).map(p => this.expr(p))
    return new Expr[kind](...args)
  }
}

module.exports = {JsonToObj}
