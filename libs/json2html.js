'use strict'

const util = require('./util')
const {Expr} = require('./expr')
const {Stage} = require('./stage')
const {Program} = require('./program')
const {Pipeline} = require('./pipeline')

class JsonToHtml {
  constructor () {
  }

  program (json) {
    this._check(json, 'program')
    const pipelines = json.slice(1).map(x => this.pipeline(x))
    return this._stitch(
      ['table', 'id="briq-program"', `data-briq-class="${Program.KIND}"`],
      ['tbody'],
      pipelines.join('')
    )
  }

  pipeline (json) {
    this._check(json, 'pipeline')
    const stages = json.slice(1).map(x => this.stage(x))
    return this._stitch(
      ['tr', `data-briq-class="${Pipeline.KIND}"`],
      stages.join('')
    )
  }

  stage (json) {
    this._check(json, 'stage')
    util.check((json.length > 1) && (json[1] in Stage),
               `Require valid stage identifier`)
    const kind = json[1]
    util.check(kind in Stage,
               `Unknown stage kind "${kind}"`)
    const rest = json.slice(2)
    const fields = Stage[kind].Fields()
    const converted = this._convert(kind, fields, rest)
    return this._stitch(
      ['td'],
      ['div', 'class="redips-drag redips-clone"'],
      ['table', `data-briq-class="${Stage.KIND}"`, `data-briq-kind="${kind}"`],
      ['tbody'],
      ['tr'],
      converted.join('')
    )
  }

  expr (json) {
    this._check(json, 'expr')
    util.check((json.length > 1) && (json[1] in Expr),
               `Require valid expression identifier`)
    const kind = json[1]
    util.check(kind in Expr,
               `Unknown expression kind "${kind}"`)
    util.check('Fields' in Expr[kind],
               `Expression ${kind} does not define fields`)
    const rest = json.slice(2)
    const fields = Expr[kind].Fields()
    const converted = this._convert(kind, fields, rest)
    return this._stitch(
      ['td'],
      ['table', `data-briq-class="${Expr.KIND}"`, `data-briq-kind="${kind}"`],
      ['tbody'],
      ['tr'],
      converted.join('')
    )
  }
  
  check (isChecked, _unused) {
    const checkedAttr = isChecked ? 'checked="checked"' : ''
    return this._stitch(
      ['td'],
      ['input', 'data-briq-class="@check"', 'type="checkbox"', checkedAttr],
      ''
    )
  }

  label (kind, text) {
    return this._stitch(
      ['td', 'class="redips-mark"'],
      ['span', 'data-briq-class="@label"'],
      text
    )
  }

  multiText (text, _unused) {
    return this._stitch(
      ['td'],
      ['input', 'data-briq-class="@multiInput"', 'type="text"', `value="${text}"`],
      ''
    )
  }

  text (text, _unused) {
    return this._stitch(
      ['td'],
      ['input', 'data-briq-class="@input"', 'type="text"', `value="${text}"`],
      ''
    )
  }

  selectKind (selected, options) {
    return this._select(selected, options)
  }

  selectValue (selected, options) {
    return this._select(selected, options)
  }

  _check (json, kind) {
    util.check(json &&
               Array.isArray(json) &&
               json.length > 0 &&
               (typeof json[0] === 'string') &&
               (json[0][0] === '@') &&
               (json[0].slice(1) === kind),
               `Expected "${kind}"`)
  }

  _convert (kind, specs, json) {
    util.check(specs.length >= json.length,
               `Must have at least as many field specs as fields`)
    let current = -1
    return specs.map(spec => {
      const [key, value] = spec
      util.check(key in this,
                 `Unknown field type ${key}`)
      if (this._isStatic(key)) {
        return this[key](kind, value)
      }
      else {
        current += 1
        return this[key](json[current], value)
      }
    })
  }

  _select (selected, options) {
    options = options.map(opt => {
      const [display, value] = (typeof opt === 'string')
             ? [opt, opt]
             : opt // array
      const s = (selected === value) ? 'selected="selected"' : ''
      return `<option value="${value}" ${s}>${display}</option>`
    })
    options = options.join('')
    return this._stitch(
      ['td'],
      ['select', 'data-briq-class="@select"'],
      options
    )
  }

  _stitch (...things) {
    const prefix = things.slice(0, -1).map(thing => {
      const attributes = thing.slice(1).map(x => ` ${x}`).join('')
      return `<${thing[0]}${attributes}>`
    })
    const suffix = things.slice(0, -1).reverse().map(thing => `</${thing[0]}>`)
    const result = `${prefix.join('')}${things.slice(-1)}${suffix.join('')}`
    return result
  }

  _isStatic (key) {
    return ['label', 'selectKind'].includes(key)
  }
}

module.exports = {JsonToHtml}
