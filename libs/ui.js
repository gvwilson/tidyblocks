'use strict'

const util = require('./util')
const {DataFrame} = require('./dataframe')
const {Environment} = require('./environment')
const {JsonToObj} = require('./json2obj')

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

  showTab (chosenButton, tabName, selector = null) {
    const group = chosenButton.getAttribute('data-tb-group')
    Array.from(this.document.querySelectorAll(`button[data-tb-group=${group}]`))
      .forEach(button => { button.classList.remove('active') })
    chosenButton.classList.add('active')

    const chosenTab = this.document.getElementById(tabName)
    util.check(group === chosenTab.getAttribute('data-tb-group'),
               `Tab should have same group as button`)
    Array.from(this.document.querySelectorAll(`div[data-tb-group=${group}]`))
      .forEach(tab => { tab.style.display = 'none' })
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

  loadProgram (name, text) {
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
   * @param {Object} results Results of statistical test (p-value)
   */
  displayStatistics (results) {
    const html = this.statisticsToHTML(results)
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
   * Display a program's structure.
   * @param {Object} json JSON representation of program to display.
   */
  displayProgram (json) {
    if (json) {
      this.displayLog([`<pre>${JSON.stringify(json, null, 1)}</pre>`])
      // FIXME
      // const factory = new JsonToHtml()
      // this.displayInArea('programArea', factory.program(json))
    }
    else {
      this.displayLog(['clear program'])
      // FIXME
      // this.displayInArea('programArea', this.makeEmptyProgram())
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
    const html = `<table class="data" data-tb-tablename="${name}">${header}${body}</table>`
    return html
  }

  /**
   * Convert results of statistical test to HTML.
   */
  statisticsToHTML (results) {
    return `<p>p-value: ${results}</p>`
  }

  /**
   * Convert array of messages to HTML list.
   * @param {string[]} messages To convert.
   * @returns HTML
   */
  listToHTML (messages) {
    return '<ol>' + messages.map(m => `<li>${m}</li>`).join('') + '</ol>'
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
