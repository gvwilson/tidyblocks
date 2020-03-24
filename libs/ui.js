'use strict'

const pretty = require('pretty')

const util = require('./util')
const {DataFrame} = require('./dataframe')
const {Expr} = require('./expr')
const {Stage} = require('./stage')
const {Environment} = require('./environment')
const {Program} = require('./program')
const {JsonToObj} = require('./json2obj')
const {JsonToHtml} = require('./json2html')

/**
 * Generic user interface.
 */
class UserInterface {
  /**
   * Build instance.
   * @param {object} document The DOM document.
   * @param {function} howToGetData How to read datasets.
   */
  constructor (document, howToGetData, howToShowPlot) {
    this.howToGetData = howToGetData
    this.howToShowPlot = howToShowPlot
    this.document = document
    this.env = new Environment(this.howToGetData)
    this.data = new Map()
    this.program = null
    this.redisplay()
  }

  // ----------------------------------------------------------------------
  // Handling events.
  // ----------------------------------------------------------------------

  showTab (chosenButton, tabName, selector) {
    const buttonGroup = chosenButton.getAttribute('data-briq-buttongroup')
    util.check(buttonGroup,
               `Tab button must be part of button group`)
    const buttons = this.document.querySelectorAll(`[data-briq-buttongroup=${buttonGroup}]`)
    Array.from(buttons)
      .forEach(button => {button.classList.remove('active')})
    chosenButton.classList.add('active')

    const chosenTab = this.document.getElementById(tabName)
    const tabGroup = chosenTab.getAttribute('data-briq-tabgroup')
    util.check(tabGroup,
               `Tab must be part of tab group`)
    const tabs = this.document.querySelectorAll(`[data-briq-tabgroup=${tabGroup}]`)
    Array.from(tabs)
      .forEach(tab => tab.style.display = 'none')
    chosenTab.style.display = 'block'

    if (selector) {
      this.displayTable(selector, null)
    }
  }

  loadData (name, text) {
    const data = util.csvToTable(text)
    const df = new DataFrame(data)
    this.data.set(name, df)
    this.displayTable('data', name)
  }

  loadProgram(name, text) {
    const json = JSON.parse(text)
    this.program = (new JsonToObj()).program(json)
    this.displayProgram(json)
  }

  // ----------------------------------------------------------------------
  // Displays.
  // ----------------------------------------------------------------------

  /**
   * Reset stored data and displays before running program.
   */
  redisplay () {
    this.displayToolbox()
    this.displayProgram(null)
    this.displayTable('data', null)
    this.displayTable('results', null)
    this.displayPlot(null)
    this.displayStatistics(null, null)
    this.displayLog(null)
    this.displayError(null)
  }

  displayTable (which, name) {
    const [selectorId, areaId, available] = {
      data: ['dataSelect', 'dataArea', this.data],
      results: ['resultsSelect', 'resultsArea', this.env.results]
    }[which]
    util.check(selectorId && areaId,
               `Unknown name ${name}`)

    // Elements.
    const selector = this.document.getElementById(selectorId)
    const area = this.document.getElementById(areaId)

    // Nothing to select.
    if (available.size === 0) {
      selector.innerHTML = '<option value="">-none-</option>'
      area.innerHTML = ''
      return
    }

    // Show all available datasets, potentially selecting one.
    const desired = name || selector.value
    const makeSelected = (key) => ((key === desired) ? 'selected="selected"' : '')
    selector.innerHTML =
      Array.from(available.keys())
      .map(key => `<option value="${key}"${makeSelected(key)}>${key}</option>`)
      .join('')

    // Display the selected dataset.
    const table = this.dataFrameToHTML(desired, available.get(desired))
    area.innerHTML = table
  }

  /**
   * Display a plot.
   * @param {Object} spec Vega-Lite plot spec (or null to clear)..
   */
  displayPlot (spec) {
    if (spec === null) {
      this.displayInArea('plotArea', null)
    }
    else {
      spec = Object.assign({}, spec, UserInterface.FULL_PLOT_SIZE)
      this.howToShowPlot(spec)
    }
  }

  /**
   * Display statistics.
   * @param {Object} results Results of statistical test.
   * @param {Object} legend Explanatory legend.
   */
  displayStatistics (results, legend) {
    const html = (results && legend) ? this.statisticsToHTML(results, legend) : ''
    this.displayInArea('statisticsArea', html)
  }

  /**
   * Display log messages.
   * @param {string[]} message To display.
   */
  displayLog (messages) {
    if (messages) {
      messages = this.listToHTML(messages)
    }
    this.displayInArea('logArea', messages)
  }

  /**
   * Display error messages.
   * @param {string[]} message To display.
   */
  displayError (messages) {
    if (messages) {
      messages.forEach(m => console.log(m))
      messages = this.listToHTML(messages)
    }
    this.displayInArea('errorArea', messages)
  }

  /**
   * Make and display the toolbox.
   */
  displayToolbox () {
    const allTabs = [
      ['expr', 'exprTab'],
      ['stage', 'transformTab']
    ]
    for (const [label, id] of allTabs) {
      const toolbox = this.makeToolbox(label)
      const div = this.document.getElementById(id)
      div.innerHTML = toolbox
    }
  }

  /**
   * Display a program's structure.
   * @param {Object} json JSON representation of program to display.
   */
  displayProgram (json) {
    if (json) {
      this.displayLog([`<pre>${JSON.stringify(json, null, 1)}</pre>`])
      const factory = new JsonToHtml()
      this.displayInArea('programArea', factory.program(json))
    }
    else {
      this.displayLog(['clear program'])
      this.displayInArea('programArea', this.makeEmptyProgram())
    }
  }

  // ----------------------------------------------------------------------
  // Program management.
  // ----------------------------------------------------------------------

  runProgram () {
    if (this.program === null) {
      this.displayError([`No program available`])
      return
    }
    this.env = new Environment(this.howToGetData)
    this.program.run(this.env)
    this.displayLog(this.env.log)
    this.displayError(this.env.errors)
  }

  /**
   * Add a row to the program area.
   */
  addProgramRow () {
    const body = this.getProgramBody()
    const height = body.children.length
    const width = body.firstChild.children.length
    util.check(width > 0,
               `Must have at least one column before adding row`)
    const factory = new JsonToHtml()
    const content = Array(width).fill(factory.makePlaceholder()).join('')
    const newRow = this.document.createElement('tr')
    newRow.innerHTML = content
    body.appendChild(newRow)
  }

  /**
   * Add a column to the program area.
   */
  addProgramCol () {
    const factory = new JsonToHtml()
    const body = this.getProgramBody()
    const temp = this.document.createElement('tr')
    const children = Array.from(body.children)
    children.forEach(row => {
      temp.innerHTML = factory.makePlaceholder()
      row.appendChild(temp.firstChild)
    })
  }

  /**
   * Get body of program table.
   */
  getProgramBody () {
    const table = this.document.getElementById('briq-program')
    util.check(table.tagName.match(/table/i),
               `Cannot find valid program`)
    const body = table.firstChild
    util.check(body.tagName.match(/tbody/i),
               `Program table does not have a valid body`)
    return body
  }

  // ----------------------------------------------------------------------
  // Utilities.
  // ----------------------------------------------------------------------

  /**
   * Display some HTML in a browser element.
   * @param {string} id ID of element to display in.
   * @param {string} html What to display.
   */
  displayInArea (id, html) {
    const div = this.document.getElementById(id)
    div.innerHTML = html ? html : ''
  }

  /**
   * Convert dataframe to HTML.
   * @param {DataFrame} df Dataframe to display.
   */
  dataFrameToHTML (name, df) {
    util.check(name,
               `Require name for dataframe`)
    util.check(df instanceof DataFrame,
               `Require dataframe`)
    const data = df.data
    const keys = Array.from(Object.keys(data[0]))
    const header = '<tr>' + keys.map(k => `<th>${k}</th>`).join('') + '</tr>'
    const body = data.map(row => '<tr>' + keys.map(k => `<td>${row[k]}</td>`).join('') + '</tr>').join('')
    const html = `<table class="data" briq-data-tablename="${name}">${header}${body}</table>`
    return html
  }

  /**
   * Convert results of statistical test to HTML.
   */
  statisticsToHTML (results, legend) {
    const title = legend._title
    const header = '<tr><th>Result</th><th>Value</th><th>Explanation</th></tr>'
    const body = Object.keys(legend).map(key => {
      if (key === '_title') {
        return ''
      }
      let value = results[key]
      if (value === undefined) {
        value = ''
      }
      else if (Array.isArray(value)) {
        value = value.map(x => x.toPrecision(UserInterface.PRECISION)).join(',<br/>')
      }
      else {
        util.check(typeof value === 'number',
                   `Unknown type of value in legend`)
        value = value.toPrecision(UserInterface.PRECISION)
      }
      return `<tr><td>${key}</td><td>${value}</td><td>${legend[key]}</td></tr>`
    }).join('')
    const html = `<p>${title}</p><table class="statistics">${header}${body}</table>`
    return html
  }

  /**
   * Convert array of messages to HTML list.
   * @param {string[]} messages To convert.
   * @returns HTML
   */
  listToHTML (messages) {
    return '<ol>' + messages.map(m => `<li>${m}</li>`).join('') + '</ol>'
  }

  /**
   * Create a toolbox of draggables.
   */
  makeToolbox (label) {
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
  makeEmptyProgram () {
    const factory = new JsonToHtml()
    const placeholder = factory.makePlaceholder()
    const table = `<table id="briq-program"><tbody><tr>${placeholder}</tr></tbody></table>`
    return table
  }
}

/**
 * Size of standard plotting area.
 */
UserInterface.FULL_PLOT_SIZE = {
  width: 500,
  height: 300
}

/**
 * Precision for displaying floating-point values.
 */
UserInterface.PRECISION = 6

module.exports = {
  UserInterface
}
