'use strict'

const util = require('./util')
const MISSING = util.MISSING
const {Stage} = require('./stage')
const {Expr} = require('./expr')

const VALUES = new Set(['logical', 'number', 'string', 'datetime'])
const BINARY = new Set(['add', 'subtract', 'multiply', 'divide',
                        'remainder', 'power',
                        'equal', 'notEqual', 'greater',
                        'greaterEqual', 'lessEqual', 'less',
                        'and', 'or'])

class HtmlToJson {
  constructor () {
  }

  program (dom) {
    this._check(dom, 'table', '@program')
    const pipelines = this._all(dom, 'tr[data-briq-class="@pipeline"]')
          .map(node => this.pipeline(node))
    return ['@program', ...pipelines]
  }

  pipeline (dom) {
    this._check(dom, 'tr', '@pipeline')
    const stages = this._all(dom, 'div[class="redips-drag redips-clone"]')
          .map(node => this.stage(node))
    return ['@pipeline', ...stages]
  }

  stage (dom) {
    util.check(dom.tagName.match(/div/i,),
               `Expected DIV`)
    dom = dom.firstChild
    this._check(dom, 'table', '@stage')
    const kind = dom.getAttribute('data-briq-kind')
    util.check(kind in Stage,
               `Unknown kind of stage "${kind}"`)
    // table >tbody >tr >children
    const children = Array.from(dom.firstChild.firstChild.children)
    const first = children[0]
    util.check(first.textContent === kind,
               `Expected first child "${first.textContent}" to be kind "${kind}"`)
    const fields = children.slice(1)
          .map(field => this._convert(field))
          .filter(field => (field !== null))
    return ['@stage', kind, ...fields]
  }

  expr (dom) {
    this._check(dom, 'table', '@expr')
    const kind = dom.getAttribute('data-briq-kind')
    util.check(kind in Expr,
               `Unknown kind of expression "${kind}"`)

    // table >tbody >tr >children
    const children = Array.from(dom.firstChild.firstChild.children)
    const fields = children
          .map(field => this._convert(field))
          .filter(field => (field !== null))

    if (VALUES.has(kind)) {
      util.check((fields.length === 2) && (kind === fields[0]),
                 `Expected two fields and first field to match kind`)
      return this._fixTypes(['@expr', ...fields])
    }
    else if (BINARY.has(kind)) {
      util.check((fields.length === 3) && (kind === fields[1]),
                 `Expected three fields and second field to match kind`)
      const temp = [fields[1], fields[0], fields[2]]
      return ['@expr', ...temp]
    }

    return ['@expr', ...fields]
  }

  check (dom) {
    util.check(dom.getAttribute('data-briq-class') === '@check',
               `Expected check`)
    util.check(dom.getAttribute('type') === 'checkbox',
               `Expected input of type checkbox`)
    return dom.getAttribute('checked') === 'checked'
  }

  input (dom) {
    util.check(dom.getAttribute('data-briq-class') === '@input',
               `Expected input`)
    util.check(dom.getAttribute('type') === 'text',
               `Expected input of type text`)
    const value = dom.getAttribute('value')
    util.check(value !== null,
               `Expected input to have non-null value`)
    return value
  }

  label (dom) {
    util.check(dom.getAttribute('data-briq-class') === '@label',
               `Expected label`)
    return null
  }

  multiInput (dom) {
    util.check(dom.getAttribute('data-briq-class') === '@multiInput',
               `Expected input`)
    util.check(dom.getAttribute('type') === 'text',
               `Expected input of type text`)
    const value = dom.getAttribute('value')
    util.check(value !== null,
               `Expected input to have non-null value`)
    return value.split(',').map(s => s.trim())
  }

  select (dom) {
    util.check(dom.getAttribute('data-briq-class') === '@select',
               `Expected select`)
    const options = dom.querySelectorAll('option[selected="selected"]')
    util.check(options.length === 1,
               `Must have exactly one option selected`)
    const value = options[0].getAttribute('value')
    util.check(value !== null,
               `Value not set for selected option`)
    return value
  }

  _all (dom, selector) {
    return Array.from(dom.querySelectorAll(selector))
  }

  _check (dom, tagName, briqClass) {
    util.check(dom.tagName.match(new RegExp(tagName, 'i')),
               `Wrong tag name "${dom.tagName}" instead of "${tagName}"`)
    util.check(dom.hasAttribute('data-briq-class'),
               `Node does not have data-briq-class attribute`)
    const attr = dom.getAttribute('data-briq-class')
    util.check(attr === briqClass,
               `Wrong briq class "${attr}" instead of "${briqClass}"`)
  }

  _convert (dom) {
    util.check(dom.tagName.match(/td/i),
               `Expected <td>, not "${dom.tagName}"`)
    util.check(dom.children.length === 1,
               `Expected table cell to have exactly one child`)
    dom = dom.firstChild
    const briqClass = dom.getAttribute('data-briq-class')
    util.check(briqClass,
               `Expected data-briq-class attribute`)
    util.check(briqClass.startsWith('@'),
               `Expected '@' at start of "${briqClass}"`)
    const kind = briqClass.slice(1)
    util.check(kind in this,
               `Unknown field type "${kind}"`)
    const result = this[kind](dom)
    return result
  }

  _fixTypes (expr) {
    util.check(expr &&
               Array.isArray(expr) &&
               (expr.length === 3) &&
               (expr[0] === '@expr'),
               `Expected expression array`)

    // Missing value.
    if (expr[2].match(/null/i)) {
      expr[2] = MISSING
    }

    // Logical.
    else if (expr[1] === 'logical') {
      if (expr[2].match(/true/i)) {
        expr[2] = true
      } else if (expr[2].match(/false/i)) {
        expr[2] = false
      } else {
        util.fail(`Unknown "Boolean" value ${expr[2]}`)
      }
    }

    // Number.
    else if (expr[1] === 'number') {
      const value = parseFloat(expr[2])
      util.check(!Number.isNaN(value),
                 `Unknown "number" value ${expr[2]}`)
      expr[2] = value
    }

    // Datetime.
    else if (expr[1] === 'datetime') {
      const value = new Date(expr[2])
      util.check(!value.toString().match(/Invalid Date/i),
                 `Unknown "datetime" value ${expr[2]}`)
      expr[2] = value
    }

    // Must be string.
    else {
      util.check(expr[1] === 'string',
                 `Unknown type "${expr[1]}"`)
    }

    return expr
  }
}

module.exports = {HtmlToJson}
