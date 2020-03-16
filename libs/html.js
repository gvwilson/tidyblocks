'use strict'

const cl = console.log

const util = require('./util')

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
   * Build a widget with several parts.
   */
  widget (...parts) {
    parts = parts
      .map(p => (p === null)
           ? this.placeholder()
           : this.frozen(p))
      .join('')
    const content = `<table class="briq-widget"><tbody><tr>${parts}</tr></tbody></table>`
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
  check () {
    return `<input class="briq-checkbox" type="checkbox"/>`
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
    value = value ? `value="${value}"` : ''
    return `<input class="briq-textbox" type="text" ${value}/>`
  }

  /**
   * Restore an input field.
   */
  fromInput (cell, splitOnCommas) {
    util.check(cell && (cell.tagName.toUpperCase() === 'INPUT'),
               `Expected input cell`)
    const raw = cell.getAttribute('value')
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
