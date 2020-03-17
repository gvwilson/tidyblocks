'use strict'

const util = require('./util')
const {Expr} = require('./expr')

/**
 * Create HTML nodes for blocks.
 */
class HTMLFactory {
  /**
   * Build an HTML factory.
   */
  constructor () {
  }

  /**
   * Drill down.
   */
  drillDown (dom) {
    ['DIV', 'TABLE', 'TBODY'].forEach(tag => {
      util.check((dom.tagName.toUpperCase() === tag) &&
                 (dom.children.length === 1),
                 `Expected ${tag} with one child`)
      dom = dom.firstChild
    })
    util.check(dom.tagName.toUpperCase() === 'TR',
               `Expected table row`)
    return dom
  }

  /**
   * Get the children of a draggable div.
   */
  getChildren (dom) {
    dom = this.drillDown(dom)
    const children = Array.from(dom.children)
    util.check(children.length,
               `widget must have children`)
    util.check(children.every(child => (child.tagName.toUpperCase() === 'TD')
                                    && (child.children.length === 1)),
               `All children should be table cells with a single child`)
    return children
  }

  /**
   * Top-level dispatch for things that might be in expression HTML.
   */
  exprFromHTML (dom) {
    util.check(dom,
               `Require something to working with`)
    const tagName = dom.tagName.toUpperCase()
    if (tagName === 'INPUT') {
      util.check(dom.getAttribute('type').toUpperCase() == 'TEXT',
                 `Expected only text nodes in expressions`)
      const text = dom.getAttribute('value')
      return this.toValue(text)
    }
    else if (tagName === 'SELECT') {
      const selected = dom.querySelector('[selected=selected]')
      return selected.getAttribute('value')
    }
    else if (tagName === 'DIV') {
      return Expr.fromHTML(this, dom)
    }
    util.fail(`Unknown node type "${tagName}"`)
  }

  /**
   * Convert text to value.
   */
  toValue (text) {
    util.check(typeof text === 'string',
               `Require some text`)

    if (text.toUpperCase() === 'TRUE') {
      return true
    }
    if (text.toUpperCase() === 'FALSE') {
      return false
    }

    const asNumber = parseFloat(text)
    if (!Number.isNaN(asNumber)) {
        return asNumber
    }

    const asDate = new Date(text)
    if ((typeof asDate === 'object') &&
        (asDate.toString() !== 'Invalid Date')) {
      return asDate
    }

    // String.
    return text
  }

  /**
   * Create a table containing an entire program.
   */
  program (pipelines) {
    // Fill in short pipelines.
    const longest = Math.max(...pipelines.map(p => p.length))
    const justified = pipelines.map(p => {
      const temp = [...p]
      while (temp.length < longest) {
        temp.push(this.placeholder())
      }
      return temp
    })
    // Create table.
    const body = justified
      .map((p, i) => `<tr>${this.pipelineIDCell(i)}${p.join('')}</tr>`)
      .join('')
    const table = `<table id="briq-program"><tbody>${body}</tbody></table>`
    return table
  }

  /**
   * Create an empty program as a placeholder.
   */
  emptyProgram () {
    const content = `${this.pipelineIDCell(0)}${this.placeholder()}`
    const table = `<table id="briq-program"><tbody><tr>${content}</tr></tbody></table>`
    return table
  }

  /**
   * Build a widget with several parts.
   */
  widget (...parts) {
    return this._widget('', ...parts)
  }

  /**
   * Build an infix widget.
   */
  infixWidget (...parts) {
    return this._widget('briq-infix="true"', ...parts)
  }

  /**
   * Build a widget with an attribute (utility method).
   */
  _widget (attr, ...parts) {
    parts = parts
      .map(p => (p === null)
           ? this.placeholder()
           : this.frozen(p))
      .join('')
    attr = `class="briq-widget" ${attr}`
    const content = `<table ${attr}><tbody><tr>${parts}</tr></tbody></table>`
    return `<div class="redips-drag redips-clone">${content}</div>`
  }

  /**
   * Turn an expression into HTML.
   */
  expr (thing) {
    if (thing === null) {
      return null
    }
    util.check(!(typeof thing === 'string'),
               `Require callable, not string`)
    thing = thing.toHTML(this)
    util.check(thing.startsWith('<'),
               `Expression must turn into valid HTML`)
    return thing
  }

  /**
   * Build a checkbox.
   */
  check (isChecked) {
    const checked = isChecked ? 'checked="checked"' : ''
    return `<input class="briq-checkbox" type="checkbox" ${checked}/>`
  }

  /**
   * Recover a Boolean value from a checkbox.
   */
  fromCheck (dom) {
    util.check(dom && (dom.tagName.toUpperCase() == 'INPUT'),
               `Expected input cell`)
    return dom.hasAttribute('checked')
  }

  /**
   * Build an option selector.
   */
  choose (options, selected) {
    options = options.map(opt => {
      let display = null, value = null
      if (Array.isArray(opt)) {
        util.check(opt.length === 2,
                   `Expect [display, value] pair`)
        display = opt[0]
        value = opt[1]
      }
      else {
        util.check(typeof opt === 'string',
                   `Expect a single string`)
        display = opt
        value = opt
      }
      const s = (selected === value) ? 'selected="selected"' : ''
      return `<option value="${value}" ${s}>${display}</option>`
    })
    options = options.join('')
    return `<select class="briq-select">${options}</select>`
  }

  /**
   * Build an input field.
   * @param {string} value What to display or null.
   */
  input (value) {
    const attribute = (value === null) ? '' : `value="${value}"`
    return `<input class="briq-textbox" type="text" ${attribute}/>`
  }

  /**
   * Restore an input field.
   */
  fromInput (dom, splitOnCommas) {
    util.check(dom && (dom.tagName.toUpperCase() === 'INPUT'),
               `Expected input cell`)
    const raw = dom.getAttribute('value')
    return splitOnCommas
      ? raw.split(',').map(f => f.trim())
      : raw
  }

  /**
   * Build label text.
   */
  label (text) {
    text = text ? text : ''
    return `<span>${text}</span>`
  }

  /**
   * Create a toolbox of draggables.
   */
  makeToolbox (classes) {
    const blanks = classes.map(cls => cls.MakeBlank())
    const contents = blanks.map(blank => this.frozen(blank.toHTML(this)))
    const rows = contents.map(c => `<tr>${c}</tr>`).join('')
    return `<table class="briq-toolbox"><tbody>${rows}</tbody></table>`
  }

  /**
   * Build a table cell that can be filled in.
   */
  placeholder () {
    return `<td class="briq-placeholder"></td>`
  }

  /**
   * Build a table cell that cannot be filled in.
   */
  frozen (content) {
    return `<td class="redips-mark">${content}</td>`
  }

  /**
   * Create a pipeline ID cell.
   */
  pipelineIDCell (i) {
    return `<th class="redips-mark">${i}</th>`
  }
}

module.exports = {
  HTMLFactory
}
