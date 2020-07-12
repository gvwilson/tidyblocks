'use strict'

const util = require('./util')
const {UserInterface} = require('./ui')

/**
 * Browser-based interface.
 */
class BrowserInterface extends UserInterface {
  /**
   * Set up after DOM is loaded: create singleton and show default tab.
   */
  static Setup (document) {
    BrowserInterface.instance =
      new BrowserInterface(document,
                           BrowserInterface.GetData,
                           BrowserInterface.ShowPlot)
    return BrowserInterface.instance
  }

  /**
   * Get a named dataset (provided as callback to runtime environment objects).
   * @param {string} name Name of previously-loaded data set.
   * @returns Tabular data to be converted to dataframe.
   */
  static GetData (name) {
    util.check(BrowserInterface.instance,
               `BrowserInterface instance not defined`)
    util.check(name && (typeof name === 'string'),
               `Require non-empty string as dataset name`)
    util.check(BrowserInterface.instance.data.has(name),
               `Cannot get unknown dataset ${name}`)
    return BrowserInterface.instance.data.get(name).data
  }

  /**
   * Display a plot.
   * @param {JSON} spec Plotting specification.
   */
  static ShowPlot (spec) {
    vegaEmbed('#plotArea', spec, {})
  }

  /**
   * Build instance.
   * @param {object} document The DOM document.
   * @param {function} howToGetData How to read datasets.
   * @param {function} howToShowPlot How to display a plot.
   */
  constructor (document, howToGetData, howToShowPlot) {
    super(document, howToGetData, howToShowPlot)
  }

  /**
   * Show the specified tab.
   * @param {event} evt Browser event.
   * @param {string} tabName Name of the tab (must match an id in the page).
   * @param {string} selector Select dataset to display (or null).
   */
  onShowTab (evt, tabName, selector = null) {
    const chosenButton = evt.target
    this.showTab(chosenButton, tabName, selector)
  }

  /**
   * Trigger an input element when a button is clicked.
   * @param {string} id ID of element to trigger.
   */
  onTriggerInput (id) {
    this.document.getElementById(id).click()
  }

  /**
   * Load a CSV data file.
   * @param {FileList} fileList List of files provided by browser file selection dialog.
   */
  onLoadData (fileList) {
    if (fileList.length === 0) {
      return
    }
    const file = fileList[0]
    const name = file.name
    file.text().then(text => this.loadData(name, text))
  }

  /**
   * Save the current results to disk.
   * @param {event} evt Browser event (ignored).
   */
  onSaveResults (evt) {
    const filename = 'result.csv' // FIXME how to trigger dialog to ask for filename?
    const text = 'a,b,c' // FIXME get the current result
    this._saveFile(filename, text)
  }

  /**
   * Load a program from disk.
   * @param {FileList} fileList List of files provided by browser file selection dialog.
   */
  onLoadProgram (fileList) {
    if (fileList.length === 0) {
      return
    }
    const file = fileList[0]
    const name = file.name
    file.text().then(text => this.loadProgram(name, text))
  }

  /**
   * Save a program to disk.
   * @param {event} evt Browser event (ignored).
   */
  onSaveProgram (evt) {
    const filename = 'program.jeff' // FIXME how to trigger dialog to ask for filename?
    const text = 'saved program' // FIXME get the actual JSON
    this._saveFile(filename, text)
  }

  /**
   * Display a named data table as an HTML table.
   * @param {string} which Which table to display.
   */
  onDisplayTable (which) {
    this.displayTable(which, null)
  }

  /**
   * Run the current program.
   */
  onRunProgram () {
    this.runProgram()
  }

  /**
   * Add a row to the program area.
   */
  onAddProgramRow () {
    this.addProgramRow()
  }

  /**
   * Add a column to the program area.
   */
  onAddProgramCol () {
    this.addProgramCol()
  }

  /**
   * Save a file locally.
   * @param {string} filename Name of file to save to.
   * @param {whatever} content Data to save.
   */
  _saveFile (filename, content) {
    const element = this.document.createElement('a')
    element.setAttribute('href', 'data:text/plaincharset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', filename)
    element.style.display = 'none'
    this.document.body.appendChild(element)
    element.click()
    this.document.body.removeChild(element)
  }
}

module.exports = {
  BrowserInterface
}
