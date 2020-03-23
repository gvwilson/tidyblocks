'use strict'

const {Expr} = require('./expr')
const {Stage} = require('./stage')
const {JsonToHtml} = require('./json2html')

/**
 * Utilities for generating HTML (here for testing).
 */
class HtmlFactory {
  /**
   * Create a toolbox of draggables.
   */
  static Toolbox (label) {
    const factory = new JsonToHtml()
    let contents = null
    if (label === 'expr') {
      contents = Expr
        .makeBlanks()
        .map(expr => factory.expr(expr))
    }
    else if (label === 'stage') {
      contents = Stage
        .makeBlanks()
        .map(expr => factory.stage(expr))
    }
    else {
      util.fail(`Unknown toolbox label ${label}`)
    }
    contents = contents
      .map(html => `<tr>${html}</tr>`)
      .join('')
    return `<table class="briq-toolbox"><tbody>${contents}</tbody></table>`
  }

  /**
   * Create an empty program as a placeholder.
   */
  static EmptyProgram () {
    const content = `${HtmlFactory.PipelineIDCell(0)}${HtmlFactory.Placeholder()}`
    const table = `<table id="briq-program"><tbody><tr>${content}</tr></tbody></table>`
    return table
  }

  /**
   * Build a table cell that can be filled in.
   */
  static Placeholder () {
    return `<td class="briq-placeholder"></td>`
  }

  /**
   * Create a pipeline ID cell.
   */
  static PipelineIDCell (i) {
    return `<th class="redips-mark">${i}</th>`
  }
}

module.exports = {HtmlFactory}
